/**
 * Balance Calculator Service
 * Computes running balances from transaction sets
 *
 * Requirements: 2.2, 2.4, 2.5, 2.6
 */

import { getPrisma } from '../db.js';

/**
 * Calculate running balance from transaction array
 * Running Balance = Σ(debit amounts) - Σ(credit amounts)
 * Only includes non-deleted transactions
 *
 * @param {array} transactions - Array of transaction objects with amount and type
 * @returns {number} Running balance formatted to 2 decimal places
 */
export function calculateBalance(transactions = []) {
  // Filter non-deleted transactions
  const activeTransactions = transactions.filter((t) => !t.deletedAt);

  // Calculate sum
  const balance = activeTransactions.reduce((sum, transaction) => {
    const amount = parseFloat(transaction.amount) || 0;
    const type = transaction.type?.toLowerCase();

    if (type === 'debit') {
      return sum + amount;
    } else if (type === 'credit') {
      return sum - amount;
    }
    return sum;
  }, 0);

  // Round to 2 decimal places
  return Math.round(balance * 100) / 100;
}

/**
 * Format balance to string with exactly 2 decimal places
 *
 * @param {number} balance - Balance amount
 * @returns {string} Formatted balance string (e.g., "1250.75")
 */
export function formatBalance(balance) {
  return (Math.round(balance * 100) / 100).toFixed(2);
}

/**
 * Calculate running balance for a shopkeeper from database
 * Queries all non-deleted transactions and calculates balance
 *
 * @param {string} shopkeeperId - Shopkeeper ID
 * @returns {Promise<object>} { balance, lastUpdated, transactionCount }
 * @throws {Error} If database query fails
 */
export async function calculateShopkeeperBalance(shopkeeperId) {
  try {
    const prisma = getPrisma();

    // Get all non-deleted transactions for this shopkeeper
    const transactions = await prisma.transaction.findMany({
      where: {
        shopkeeperId,
        deletedAt: null,
      },
      select: {
        amount: true,
        type: true,
        deletedAt: true,
        createdAt: true,
      },
    });

    // Calculate balance
    const balance = calculateBalance(transactions);
    const transactionCount = transactions.length;

    // Find most recent transaction
    const latestTransaction = transactions.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    return {
      balance,
      lastUpdated: latestTransaction?.createdAt || new Date(),
      transactionCount,
    };
  } catch (error) {
    console.error('Balance calculation failed:', error);
    throw new Error(
      `Failed to calculate balance: ${error.message}`
    );
  }
}

/**
 * Verify balance consistency for all transactions
 * Useful for auditing and validation
 *
 * @param {array} transactions - Array of transactions
 * @returns {object} { isConsistent: boolean, calculatedBalance: number, expectedBalance: number }
 */
export function verifyBalanceConsistency(transactions, expectedBalance) {
  const calculatedBalance = calculateBalance(transactions);
  return {
    isConsistent: calculatedBalance === expectedBalance,
    calculatedBalance,
    expectedBalance,
  };
}

export default {
  calculateBalance,
  formatBalance,
  calculateShopkeeperBalance,
  verifyBalanceConsistency,
};