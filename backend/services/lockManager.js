/**
 * Lock Manager Service
 * Manages concurrent edit prevention through pessimistic locking
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { getPrisma } from '../db.js';

// Lock duration in milliseconds (30 minutes)
const LOCK_DURATION_MS = 30 * 60 * 1000;

/**
 * Acquire a lock on a transaction for editing
 *
 * @param {string} transactionId - Transaction to lock
 * @param {string} shopkeeperId - Shopkeeper requesting the lock
 * @returns {Promise<object>} Lock object on success or conflict info on failure
 *   Success: { locked: true, lockId, transactionId, shopkeeperId, acquiredAt }
 *   Conflict: { locked: false, error, lockedBy, lockedSince }
 * @throws {Error} If database operation fails
 */
export async function acquireLock(transactionId, shopkeeperId) {
  try {
    const prisma = getPrisma();

    // Check if lock already exists
    const existingLock = await prisma.transactionLock.findUnique({
      where: { transactionId },
      include: {
        shopkeeper: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // If lock exists and is held by different shopkeeper
    if (existingLock) {
      // Check if lock is expired
      const now = new Date();
      if (existingLock.expiresAt > now) {
        // Lock is still valid and held by someone else
        if (existingLock.shopkeeperId !== shopkeeperId) {
          return {
            locked: false,
            error: 'Transaction is currently locked',
            lockedBy: existingLock.shopkeeper.name,
            lockedSince: existingLock.acquiredAt,
            lockedByShopkeeperId: existingLock.shopkeeperId,
          };
        }
        // Same shopkeeper trying to re-lock (already has lock)
        return {
          locked: true,
          lockId: existingLock.id,
          transactionId: existingLock.transactionId,
          shopkeeperId: existingLock.shopkeeperId,
          acquiredAt: existingLock.acquiredAt,
        };
      }
      // Lock is expired, delete it first
      await prisma.transactionLock.delete({
        where: { transactionId },
      });
    }

    // Create new lock
    const now = new Date();
    const expiresAt = new Date(now.getTime() + LOCK_DURATION_MS);

    const newLock = await prisma.transactionLock.create({
      data: {
        transactionId,
        shopkeeperId,
        acquiredAt: now,
        expiresAt,
      },
    });

    return {
      locked: true,
      lockId: newLock.id,
      transactionId: newLock.transactionId,
      shopkeeperId: newLock.shopkeeperId,
      acquiredAt: newLock.acquiredAt,
    };
  } catch (error) {
    console.error('Lock acquisition failed:', error);
    throw new Error(`Failed to acquire lock: ${error.message}`);
  }
}

/**
 * Release a lock on a transaction
 *
 * @param {string} transactionId - Transaction to unlock
 * @param {string} shopkeeperId - Shopkeeper releasing the lock
 * @returns {Promise<object>} { unlocked: true, transactionId } or error
 * @throws {Error} If database operation fails
 */
export async function releaseLock(transactionId, shopkeeperId) {
  try {
    const prisma = getPrisma();

    // Find and verify lock ownership
    const lock = await prisma.transactionLock.findUnique({
      where: { transactionId },
    });

    if (!lock) {
      return {
        unlocked: false,
        error: 'No lock found for this transaction',
      };
    }

    // Verify shopkeeper owns the lock
    if (lock.shopkeeperId !== shopkeeperId) {
      return {
        unlocked: false,
        error: 'Lock is held by another shopkeeper',
      };
    }

    // Delete lock
    await prisma.transactionLock.delete({
      where: { transactionId },
    });

    return {
      unlocked: true,
      transactionId,
    };
  } catch (error) {
    console.error('Lock release failed:', error);
    throw new Error(`Failed to release lock: ${error.message}`);
  }
}

/**
 * Check if a transaction is locked
 *
 * @param {string} transactionId - Transaction to check
 * @returns {Promise<object>} Lock info or null if no lock
 */
export async function checkLock(transactionId) {
  try {
    const prisma = getPrisma();

    const lock = await prisma.transactionLock.findUnique({
      where: { transactionId },
      include: {
        shopkeeper: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!lock) {
      return null;
    }

    // Check if lock is expired
    const now = new Date();
    if (lock.expiresAt <= now) {
      // Lock is expired, delete it
      await prisma.transactionLock.delete({
        where: { transactionId },
      });
      return null;
    }

    // Return lock info
    return {
      lockId: lock.id,
      transactionId: lock.transactionId,
      shopkeeperId: lock.shopkeeperId,
      shopkeeperName: lock.shopkeeper.name,
      acquiredAt: lock.acquiredAt,
      expiresAt: lock.expiresAt,
    };
  } catch (error) {
    console.error('Lock check failed:', error);
    throw new Error(`Failed to check lock: ${error.message}`);
  }
}

/**
 * Expire old locks (should be run as scheduled task)
 * Deletes locks older than LOCK_DURATION_MS
 *
 * @returns {Promise<object>} { expiredCount: number }
 * @throws {Error} If database operation fails
 */
export async function expireLocks() {
  try {
    const prisma = getPrisma();

    const now = new Date();

    const result = await prisma.transactionLock.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    console.log(
      `Expired ${result.count} old transaction locks`
    );

    return { expiredCount: result.count };
  } catch (error) {
    console.error('Lock expiration failed:', error);
    throw new Error(`Failed to expire locks: ${error.message}`);
  }
}

export default {
  acquireLock,
  releaseLock,
  checkLock,
  expireLocks,
};
