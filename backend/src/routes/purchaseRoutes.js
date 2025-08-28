const express = require('express');
const router = express.Router();
const { 
  getUserPurchases, 
  getPurchaseById, 
  createPurchase, 
  updatePurchaseStatus,
  getAllPurchases,
  getPurchasesByUserId,
  deletePurchase
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
 * @route   PUT /api/purchases/:id/status
 * @desc    Update purchase status
 * @access  Private
 */
router.put('/:id/status', authenticateToken, updatePurchaseStatus);

/**
 * @route   GET /api/purchases/admin/all
 * @desc    Get all purchases (Admin only)
 * @access  Admin only
 */
router.get('/admin/all', authenticateToken, requireRole(['admin']), getAllPurchases);

/**
 * @route   GET /api/purchases/admin/user/:userId
 * @desc    Get purchases by user ID (Admin only)
 * @access  Admin only
 */
router.get('/admin/user/:userId', authenticateToken, requireRole(['admin']), getPurchasesByUserId);

/**
 * @route   DELETE /api/purchases/admin/:id
 * @desc    Delete purchase (Admin only)
 * @access  Admin only
 */
router.delete('/admin/:id', authenticateToken, requireRole(['admin']), deletePurchase);

module.exports = router; 