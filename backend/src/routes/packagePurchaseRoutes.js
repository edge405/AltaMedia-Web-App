const express = require('express');
const router = express.Router();
const { 
  getUserPackagePurchases, 
  getPackagePurchaseById, 
  getAllPackagePurchases,
  createPackagePurchase,
  updatePurchaseFeatureStatus
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
 * @route   GET /api/package-purchases/admin/all
 * @desc    Get all package purchases (Admin only)
 * @access  Admin only
 */
router.get('/admin/all', authenticateToken, requireRole(['admin']), getAllPackagePurchases);

/**
 * @route   POST /api/package-purchases
 * @desc    Create a new package purchase with features
 * @access  Private
 */
router.post('/', authenticateToken, createPackagePurchase);

/**
 * @route   PUT /api/package-purchases/:id/features/:featureId/status
 * @desc    Update feature status in a package purchase
 * @access  Private
 */
router.put('/:id/features/:featureId/status', authenticateToken, updatePurchaseFeatureStatus);

module.exports = router; 