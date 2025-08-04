/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    message: 'Internal server error',
    statusCode: 500
  };

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = err.message;
    error.statusCode = 400;
  }

  // Supabase errors
  if (err.code && err.code.startsWith('PGRST')) {
    error.message = 'Database operation failed';
    error.statusCode = 400;
  }

  // Custom error with status code
  if (err.statusCode) {
    error.statusCode = err.statusCode;
    error.message = err.message;
  }

  res.status(error.statusCode).json(error);
};

/**
 * 404 handler for undefined routes
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

module.exports = {
  errorHandler,
  notFound
}; 