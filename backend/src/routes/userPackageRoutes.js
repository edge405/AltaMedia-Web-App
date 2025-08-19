const express = require('express');
const { createUserWithPackage } = require('../controllers/userPackageController');
const { createUserWithPackageValidation } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   POST /api/user-package/create-user-with-package
 * @desc    Create a new user with package purchase
 * @access  Public
 * @body    {
 *   email: string (required),
 *   fullname: string (required),
 *   phone_number: string (required),
 *   package_name: string (required),
 *   expiration_date: string (required, YYYY-MM-DD format),
 *   total_amount: number (required),
 *   features: array (optional) - Array of feature objects
 * }
 */
router.post('/create-user-with-package', createUserWithPackageValidation, createUserWithPackage);

module.exports = router;
