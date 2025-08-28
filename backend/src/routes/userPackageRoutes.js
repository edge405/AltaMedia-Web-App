const express = require('express');
const { 
  createUserWithPackage,
  getUserPackages,
  getUserPackageById,
  getUserPackagesDetailed,
  getUserActivePackages,
  updateFeatureStatus,
  getAllUserPackages,
  deleteUserPackage,
  getAdminDashboardStats
} = require('../controllers/userPackageController');
const { authenticateToken, requireRole } = require('../middleware/auth');
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

/**
 * @route   GET /api/user-package/packages
 * @desc    Get user's purchased packages with features
 * @access  Private
 */
router.get('/packages', authenticateToken, getUserPackages);

/**
 * @route   GET /api/user-package/user-packages-detailed
 * @desc    Get user's purchased packages with detailed information including statistics
 * @access  Private
 */
router.get('/user-packages-detailed', authenticateToken, getUserPackagesDetailed);

/**
 * @route   GET /api/user-package/active-packages
 * @desc    Get user's active packages only (not expired)
 * @access  Private
 */
router.get('/active-packages', authenticateToken, getUserActivePackages);

/**
 * @route   GET /api/user-package/packages/:id
 * @desc    Get user's purchased package by ID
 * @access  Private
 */
router.get('/packages/:id', authenticateToken, getUserPackageById);

/**
 * @route   PUT /api/user-package/packages/:id/features/:featureId/status
 * @desc    Update feature status in user's package
 * @access  Private
 */
router.put('/packages/:id/features/:featureId/status', authenticateToken, updateFeatureStatus);

/**
 * @route   GET /api/user-package/admin/dashboard-stats
 * @desc    Get admin dashboard statistics
 * @access  Private (Admin)
 */
router.get('/admin/dashboard-stats', authenticateToken, requireRole(['admin']), getAdminDashboardStats);

/**
 * @route   GET /api/user-package/admin/all
 * @desc    Get all user packages (Admin)
 * @access  Private (Admin)
 */
router.get('/admin/all', authenticateToken, requireRole(['admin']), getAllUserPackages);

/**
 * @route   DELETE /api/user-package/admin/:id
 * @desc    Delete user package (Admin)
 * @access  Private (Admin)
 */
router.delete('/admin/:id', authenticateToken, requireRole(['admin']), deleteUserPackage);

module.exports = router;
