const express = require('express');
const router = express.Router();
const { 
  getUserAddonPurchases, 
  getAddonPurchaseById, 
  createAddonPurchase, 
  cancelAddonPurchase,
  getAllAddonPurchases
} = require('../controllers/addonPurchaseController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @route   GET /api/addon-purchases
 * @desc    Get user's independent addon purchases
 * @access  Private
 */
router.get('/', authenticateToken, getUserAddonPurchases);

/**
 * @route   GET /api/addon-purchases/:id
 * @desc    Get addon purchase by ID
 * @access  Private
 */
router.get('/:id', authenticateToken, getAddonPurchaseById);

/**
 * @route   POST /api/addon-purchases
 * @desc    Create new independent addon purchase
 * @access  Private
 */
router.post('/', authenticateToken, createAddonPurchase);

/**
 * @route   PUT /api/addon-purchases/:id/cancel
 * @desc    Cancel addon purchase
 * @access  Private
 */
router.put('/:id/cancel', authenticateToken, cancelAddonPurchase);

/**
 * @route   GET /api/admin/addon-purchases
 * @desc    Get all addon purchases (Admin only)
 * @access  Admin only
 */
router.get('/admin/all', authenticateToken, requireRole(['admin']), getAllAddonPurchases);

module.exports = router; 