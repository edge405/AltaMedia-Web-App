const { body, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Validation rules for login
 */
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

/**
 * Validation rules for registration
 */
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long'),
  body('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters long'),
  handleValidationErrors
];

/**
 * Validation rules for create user with package
 */
const createUserWithPackageValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('fullname')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters long'),
  body('phone_number')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Phone number must be at least 10 characters long'),
  body('package_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Package name is required'),
  body('expiration_date')
    .isISO8601()
    .withMessage('Expiration date must be a valid date in YYYY-MM-DD format'),
  body('total_amount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  loginValidation,
  registerValidation,
  createUserWithPackageValidation
}; 