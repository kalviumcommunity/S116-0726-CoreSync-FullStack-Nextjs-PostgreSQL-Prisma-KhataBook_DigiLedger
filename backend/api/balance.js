import { db } from '../db.js';
import { ValidationError } from '../middleware/errorHandler.js';


export async function getBalanceEndpoint(req, res) {
  const shopkeeperId = req.query.shopkeeperId || req.body?.shopkeeperId;

  if (!shopkeeperId) {
    throw new ValidationError({ shopkeeperId: 'Shopkeeper ID is required' });
  }

  // Calculate total CREDIT
  const creditAgg = await db.transaction.aggregate({
    _sum: { amount: true },
    where: {
      shopkeeperId,
      type: 'CREDIT',
      deletedAt: null,
    },
  });

  // Calculate total DEBIT
  const debitAgg = await db.transaction.aggregate({
    _sum: { amount: true },
    where: {
      shopkeeperId,
      type: 'DEBIT',
      deletedAt: null,
    },
  });

  const totalCredits = parseFloat(creditAgg._sum.amount || 0);
  const totalDebits = parseFloat(debitAgg._sum.amount || 0);
  const netBalance = totalCredits - totalDebits;

  return res.status(200).json({
    success: true,
    balance: netBalance,
    totalCredits,
    totalDebits,
  });
}

export default {
  getBalanceEndpoint,
};
