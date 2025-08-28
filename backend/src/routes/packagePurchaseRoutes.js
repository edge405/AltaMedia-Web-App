const express = require('express');
const router = express.Router();
const { 
  getUserPackagePurchases, 
  getPackagePurchaseById, 
  getAllPackagePurchases,
  createPackagePurchase,
  updatePackagePurchaseStatus,
  updatePackagePurchaseFeatureStatus,
  getPackagePurchasesByUserId,
  deletePackagePurchase
} = require('../controllers/packagePurchaseController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @route   GET /api/package-purchases
 * @desc    Get user's package purchases
 * @access  Private
 */
router.get('/', authenticateToken, getUserPackagePurchases);

/**
 * @route   GET /api/package-purchases/:id
 * @desc    Get package purchase by ID
 * @access  Private
 */
router.get('/:id', authenticateToken, getPackagePurchaseById);

/**
 * @route   POST /api/package-purchases
 * @desc    Create a new package purchase with features
 * @access  Private
 */
router.post('/', authenticateToken, createPackagePurchase);

/**
 * @route   PUT /api/package-purchases/:id/status
 * @desc    Update package purchase status
 * @access  Private
 */
router.put('/:id/status', authenticateToken, updatePackagePurchaseStatus);

/**
 * @route   PUT /api/package-purchases/:id/features/:featureId/status
 * @desc    Update feature status in a package purchase
 * @access  Private
 */
router.put('/:id/features/:featureId/status', authenticateToken, updatePackagePurchaseFeatureStatus);

/**
 * @route   GET /api/package-purchases/admin/all
 * @desc    Get all package purchases (Admin only)
 * @access  Admin only
 */
router.get('/admin/all', authenticateToken, requireRole(['admin']), getAllPackagePurchases);

/**
 * @route   GET /api/package-purchases/admin/user/:userId
 * @desc    Get package purchases by user ID (Admin only)
 * @access  Admin only
 */
router.get('/admin/user/:userId', authenticateToken, requireRole(['admin']), getPackagePurchasesByUserId);

/**
 * @route   DELETE /api/package-purchases/admin/:id
 * @desc    Delete package purchase (Admin only)
 * @access  Admin only
 */
router.delete('/admin/:id', authenticateToken, requireRole(['admin']), deletePackagePurchase);

module.exports = router; 