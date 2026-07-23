/**
 * Transaction Validator Service
 * Validates transaction data for correctness before persistence
 *
 * Requirements: 1.2, 1.3, 1.5, 8.1, 8.2, 8.3, 8.4, 8.5
 */

/**
 * Validate transaction amount
 * @param {number | string} amount - Amount to validate
 * @returns {object} { valid: boolean, error?: string }
 *
 * Rules:
 * - Must be provided and non-empty
 * - Must be a positive numeric value
 * - Must not exceed 2 decimal places
 */
export function validateAmount(amount) {
  // Check if provided
  if (amount === null || amount === undefined || amount === '') {
    return { valid: false, error: 'Amount field is required' };
  }

  // Convert to number if string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Check if valid number
  if (isNaN(numAmount)) {
    return { valid: false, error: 'Amount must be a valid numeric value' };
  }

  // Check if positive
  if (numAmount <= 0) {
    return { valid: false, error: 'Amount must be a positive number' };
  }

  // Check decimal places - convert to string and check decimal part
  const decimalPart = numAmount.toString().split('.')[1];
  if (decimalPart && decimalPart.length > 2) {
    return { valid: false, error: 'Amount must not exceed 2 decimal places' };
  }

  return { valid: true };
}

/**
 * Validate transaction type
 * @param {string} type - Transaction type to validate
 * @returns {object} { valid: boolean, error?: string }
 *
 * Rules:
 * - Must be either 'debit' or 'credit' (case-sensitive)
 */
export function validateType(type) {
  // Check if provided
  if (type === null || type === undefined || type === '') {
    return { valid: false, error: 'Transaction type is required' };
  }

  // Check if valid type (case-sensitive)
  if (type !== 'debit' && type !== 'credit') {
    return {
      valid: false,
      error: "Transaction type must be either 'debit' or 'credit'",
    };
  }

  return { valid: true };
}

/**
 * Validate description (optional but should be non-empty string if provided)
 * @param {string} description - Description to validate
 * @returns {object} { valid: boolean, error?: string }
 */
export function validateDescription(description) {
  // Optional field, but if provided must be string and not exceed 500 chars
  if (description && typeof description !== 'string') {
    return { valid: false, error: 'Description must be a text string' };
  }

  if (description && description.length > 500) {
    return {
      valid: false,
      error: 'Description must not exceed 500 characters',
    };
  }

  return { valid: true };
}

/**
 * Validate complete transaction data
 * @param {object} transactionData - Transaction data with amount, type, description
 * @returns {object} { valid: boolean, errors?: {field: string} }
 */
export function validateTransaction(transactionData) {
  const errors = {};

  // Validate amount
  const amountValidation = validateAmount(transactionData.amount);
  if (!amountValidation.valid) {
    errors.amount = amountValidation.error;
  }

  // Validate type
  const typeValidation = validateType(transactionData.type);
  if (!typeValidation.valid) {
    errors.type = typeValidation.error;
  }

  // Validate description (optional)
  if (transactionData.description !== undefined) {
    const descValidation = validateDescription(transactionData.description);
    if (!descValidation.valid) {
      errors.description = descValidation.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    ...(Object.keys(errors).length > 0 && { errors }),
  };
}

export default {
  validateAmount,
  validateType,
  validateDescription,
  validateTransaction,
};
