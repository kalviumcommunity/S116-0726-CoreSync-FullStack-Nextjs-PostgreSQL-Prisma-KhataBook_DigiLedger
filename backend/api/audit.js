import { db } from '../db.js';
import { NotFoundError } from '../middleware/errorHandler.js';

/**
 * Endpoint: Get complete audit history for a transaction
 * GET /api/transactions/:id/audit
 */
export async function getAuditEndpoint(req, res) {
  const { id } = req.params;

  // Check if transaction exists (including soft-deleted ones)
  const transaction = await db.transaction.findUnique({
    where: { id },
  });

  if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }

  // Fetch audit logs sorted chronologically descending
  const auditLogs = await db.auditLog.findMany({
    where: { transactionId: id },
    orderBy: { timestamp: 'desc' },
  });

  return res.status(200).json({
    success: true,
    data: auditLogs,
  });
}

export default {
  getAuditEndpoint,
};