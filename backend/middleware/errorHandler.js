/**
 * Error Handling Middleware
 * Centralizes error handling and response formatting
 *
 * Task: 14
 * Requirements: 13.1-13.5
 */

/**
 * Error response formatter
 * Converts errors into standardized API responses
 *
 * @param {Error} error - The error to format
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export function handleError(error, req, res) {
  console.error('Error:', error);

  // Validation error (400)
  if (error.name === 'ValidationError' || error.statusCode === 400) {
    return res.status(400).json({
      error: 'Validation failed',
      fields: error.fields || { general: error.message },
    });
  }

  // Conflict error (409)
  if (error.name === 'ConflictError' || error.statusCode === 409) {
    return res.status(409).json({
      error: error.message || 'Resource conflict',
      ...(error.context && error.context),
    });
  }

  // Not found error (404)
  if (error.name === 'NotFoundError' || error.statusCode === 404) {
    return res.status(404).json({
      error: error.message || 'Resource not found',
    });
  }

  // Database error (500)
  if (
    error.name === 'PrismaClientKnownRequestError' ||
    error.name === 'PrismaClientValidationError'
  ) {
    console.error('Database error:', error);
    return res.status(500).json({
      error: 'Database operation failed',
      message: 'An error occurred while processing your request',
    });
  }

  // Default server error (500)
  if (error.statusCode >= 500 || !error.statusCode) {
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    });
  }

  // Unknown error
  return res.status(error.statusCode || 500).json({
    error: error.message || 'An error occurred',
  });
}

/**
 * Error class for application-specific errors
 */
export class AppError extends Error {
  constructor(message, statusCode, context = {}) {
    super(message);
    this.statusCode = statusCode;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error class
 */
export class ValidationError extends AppError {
  constructor(fields = {}) {
    super('Validation failed', 400);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

/**
 * Conflict error class
 */
export class ConflictError extends AppError {
  constructor(message, context = {}) {
    super(message, 409);
    this.name = 'ConflictError';
    this.context = context;
  }
}

/**
 * Not found error class
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Async error wrapper - wraps async route handlers to catch errors
 *
 * @param {function} fn - Async route handler function
 * @returns {function} Wrapped handler that catches errors
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Express error handling middleware
 * Place this AFTER all other middleware and routes
 *
 * @param {Error} err - Error object
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next function
 */
export function errorHandlingMiddleware(err, req, res, next) {
  handleError(err, req, res);
}

export default {
  handleError,
  asyncHandler,
  errorHandlingMiddleware,
  AppError,
  ValidationError,
  ConflictError,
  NotFoundError,
};