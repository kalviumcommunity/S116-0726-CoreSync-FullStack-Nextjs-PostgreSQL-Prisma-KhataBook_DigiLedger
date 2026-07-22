import { ConflictError, ValidationError } from '../middleware/errorHandler.js';

// In-memory store for active transaction edit locks
// Key: transactionId (string), Value: { userId: string, expiresAt: number }
const lockStore = new Map();

// Lock TTL duration (2 minutes)
const LOCK_TTL_MS = 2 * 60 * 1000;

/**
 * Periodically clean up expired locks
 */
setInterval(() => {
  const now = Date.now();
  for (const [txId, lock] of lockStore.entries()) {
    if (lock.expiresAt <= now) {
      lockStore.delete(txId);
    }
  }
}, 30 * 1000);

/**
 * Helper: Check if a transaction is locked by another user
 */
export function isLockedByOther(transactionId, userId) {
  const existingLock = lockStore.get(transactionId);
  if (!existingLock) return false;

  // Check if expired
  if (existingLock.expiresAt <= Date.now()) {
    lockStore.delete(transactionId);
    return false;
  }

  // Locked by someone else
  return existingLock.userId !== userId;
}

/**
 * Helper: Acquire lock programmatically
 */
export function acquireLock(transactionId, userId) {
  if (!transactionId || !userId) {
    throw new ValidationError({ general: 'Transaction ID and User ID are required' });
  }

  if (isLockedByOther(transactionId, userId)) {
    const existingLock = lockStore.get(transactionId);
    throw new ConflictError('Transaction is currently being edited by another shopkeeper', {
      lockedBy: existingLock.userId,
      expiresAt: new Date(existingLock.expiresAt).toISOString(),
    });
  }

  const expiresAt = Date.now() + LOCK_TTL_MS;
  lockStore.set(transactionId, { userId, expiresAt });
  return { success: true, transactionId, userId, expiresAt: new Date(expiresAt).toISOString() };
}

/**
 * Helper: Release lock programmatically
 */
export function releaseLock(transactionId, userId) {
  const existingLock = lockStore.get(transactionId);
  if (existingLock && (existingLock.userId === userId || existingLock.expiresAt <= Date.now())) {
    lockStore.delete(transactionId);
    return true;
  }
  return false;
}

/**
 * Endpoint: Acquire transaction edit lock
 * GET /api/transactions/:id/lock?userId=...
 */
export async function acquireLockEndpoint(req, res) {
  const { id } = req.params;
  const userId = req.query.userId || req.body?.userId;

  if (!userId) {
    throw new ValidationError({ userId: 'User ID is required to lock a transaction' });
  }

  const result = acquireLock(id, userId);
  return res.status(200).json(result);
}

/**
 * Endpoint: Release transaction edit lock
 * DELETE /api/transactions/:id/lock?userId=...
 */
export async function releaseLockEndpoint(req, res) {
  const { id } = req.params;
  const userId = req.query.userId || req.body?.userId;

  if (userId) {
    releaseLock(id, userId);
  } else {
    // If no userId provided, clean up lock for transaction
    lockStore.delete(id);
  }

  return res.status(200).json({ success: true, message: 'Lock released' });
}

export default {
  acquireLock,
  releaseLock,
  isLockedByOther,
  acquireLockEndpoint,
  releaseLockEndpoint,
};
