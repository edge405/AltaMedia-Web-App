const express = require('express');
const router = express.Router();
const { 
  getUserPurchases, 
  getPurchaseById, 
  createPurchase, 
  cancelPurchase,
  getAllPurchases,
  updatePurchaseFeatureStatus
} = require('../controllers/purchaseController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @route   GET /api/purchases
 * @desc    Get user's package purchases
 * @access  Private
 */
router.get('/', authenticateToken, getUserPurchases);

/**
 * @route   GET /api/purchases/:id
 * @desc    Get purchase by ID with addons
 * @access  Private
 */
router.get('/:id', authenticateToken, getPurchaseById);

/**
 * @route   POST /api/purchases
 * @desc    Create new package purchase
 * @access  Private
 */
router.post('/', authenticateToken, createPurchase);

/**
 * @route   PUT /api/purchases/:id/cancel
 * @desc    Cancel purchase
 * @access  Private
 */
router.put('/:id/cancel', authenticateToken, cancelPurchase);

/**
 * @route   GET /api/admin/purchases
 * @desc    Get all purchases (Admin only)
 * @access  Admin only
 */
router.get('/admin/all', authenticateToken, requireRole(['admin']), getAllPurchases);

/**
 * @route   PUT /api/purchases/:id/features/:featureId/status
 * @desc    Update feature status in a purchase
 * @access  Private
 */
router.put('/:id/features/:featureId/status', authenticateToken, updatePurchaseFeatureStatus);

module.exports = router; 