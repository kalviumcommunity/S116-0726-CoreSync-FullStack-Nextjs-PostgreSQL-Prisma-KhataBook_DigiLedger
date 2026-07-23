/**
 * Audit Trail Recording Service
 * Records all transaction modifications for compliance and recovery
 *
 * Requirements: 1.6, 4.4, 5.2, 7.1, 7.5
 */

import { getPrisma } from '../db.js';

/**
 * Record an audit log entry for a transaction change
 *
 * @param {object} params - Audit log parameters
 * @param {string} params.transactionId - Transaction being modified
 * @param {string} params.userId - User making the change
 * @param {string} params.changeType - 'CREATE' | 'UPDATE' | 'DELETE'
 * @param {object} params.oldValues - Previous values (null for CREATE)
 * @param {object} params.newValues - New/current values
 * @param {string[]} params.fieldsChanged - Array of field names that changed
 * @returns {Promise<object>} Created audit log entry
 *
 * @throws {Error} If database operation fails
 */
export async function recordAuditLog({
  transactionId,
  userId,
  changeType,
  oldValues = null,
  newValues = {},
  fieldsChanged = [],
}) {
  try {
    const prisma = getPrisma();

    // Determine fields changed based on changeType
    let fieldsToRecord = fieldsChanged;
    if (changeType === 'CREATE') {
      fieldsToRecord = Object.keys(newValues);
    } else if (changeType === 'DELETE') {
      fieldsToRecord = ['deletedAt'];
    }

    // Create audit log entry
    const auditLog = await prisma.auditLog.create({
      data: {
        transactionId,
        userId,
        changeType,
        oldValues: oldValues || undefined,
        newValues,
        fieldsChanged: fieldsToRecord,
        timestamp: new Date(),
      },
    });

    return {
      id: auditLog.id,
      transactionId: auditLog.transactionId,
      userId: auditLog.userId,
      changeType: auditLog.changeType,
      oldValues: auditLog.oldValues,
      newValues: auditLog.newValues,
      fieldsChanged: auditLog.fieldsChanged,
      timestamp: auditLog.timestamp,
    };
  } catch (error) {
    console.error('Audit log recording failed:', error);
    throw new Error(`Failed to record audit log: ${error.message}`);
  }
}

/**
 * Get audit trail for a transaction
 *
 * @param {string} transactionId - Transaction to retrieve audit history for
 * @returns {Promise<array>} Array of audit log entries in reverse chronological order
 */
export async function getAuditTrail(transactionId) {
  try {
    const prisma = getPrisma();

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        transactionId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return auditLogs.map((log) => ({
      id: log.id,
      transactionId: log.transactionId,
      changeType: log.changeType,
      shopkeeperName: log.user.name,
      shopkeeperId: log.user.id,
      timestamp: log.timestamp,
      oldValues: log.oldValues,
      newValues: log.newValues,
      fieldsChanged: log.fieldsChanged,
    }));
  } catch (error) {
    console.error('Audit trail retrieval failed:', error);
    throw new Error(
      `Failed to retrieve audit trail: ${error.message}`
    );
  }
}

/**
 * Get all audit logs for a user
 *
 * @param {string} userId - User to retrieve audit history for
 * @returns {Promise<array>} Array of audit log entries
 */
export async function getUserAuditHistory(userId) {
  try {
    const prisma = getPrisma();

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        userId,
      },
      include: {
        transaction: {
          select: {
            id: true,
            shopkeeperId: true,
            amount: true,
            type: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return auditLogs;
  } catch (error) {
    console.error('User audit history retrieval failed:', error);
    throw new Error(
      `Failed to retrieve user audit history: ${error.message}`
    );
  }
}

export default {
  recordAuditLog,
  getAuditTrail,
  getUserAuditHistory,
};