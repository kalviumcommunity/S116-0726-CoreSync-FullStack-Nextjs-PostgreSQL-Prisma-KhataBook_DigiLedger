/**
 * Main API Router
 * Routes all API endpoints
 */

import express from 'express';
import {
  createTransaction,
  listTransactions,
  updateTransaction,
  deleteTransaction,
} from '../api/transactions.js';
import {
  acquireLockEndpoint,
  releaseLockEndpoint,
} from '../api/locks.js';
import {
  getAuditEndpoint,
} from '../api/audit.js';
import {
  getBalanceEndpoint,
} from '../api/balance.js';
import {
  asyncHandler,
} from '../middleware/errorHandler.js';

export const router = express.Router();

// Transaction endpoints
router.post(
  '/transactions',
  asyncHandler(createTransaction)
);
router.get(
  '/transactions',
  asyncHandler(listTransactions)
);
router.patch(
  '/transactions/:id',
  asyncHandler(updateTransaction)
);
router.delete(
  '/transactions/:id',
  asyncHandler(deleteTransaction)
);

// Lock endpoints
router.get(
  '/transactions/:id/lock',
  asyncHandler(acquireLockEndpoint)
);
router.delete(
  '/transactions/:id/lock',
  asyncHandler(releaseLockEndpoint)
);

// Audit endpoints
router.get(
  '/transactions/:id/audit',
  asyncHandler(getAuditEndpoint)
);

// Balance endpoints
router.get(
  '/balance',
  asyncHandler(getBalanceEndpoint)
);

export default router;