const express = require('express');
const router = express.Router();
const { 
  getUserAddonPurchases, 
  getAddonPurchaseById, 
  createAddonPurchase, 
  updateAddonPurchaseStatus,
  getAllAddonPurchases,
  getAddonPurchasesByUserId,
  deleteAddonPurchase
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
 * @route   PUT /api/addon-purchases/:id/status
 * @desc    Update addon purchase status
 * @access  Private
 */
router.put('/:id/status', authenticateToken, updateAddonPurchaseStatus);

/**
 * @route   GET /api/addon-purchases/admin/all
 * @desc    Get all addon purchases (Admin only)
 * @access  Admin only
 */
router.get('/admin/all', authenticateToken, requireRole(['admin']), getAllAddonPurchases);

/**
 * @route   GET /api/addon-purchases/admin/user/:userId
 * @desc    Get addon purchases by user ID (Admin only)
 * @access  Admin only
 */
router.get('/admin/user/:userId', authenticateToken, requireRole(['admin']), getAddonPurchasesByUserId);

/**
 * @route   DELETE /api/addon-purchases/admin/:id
 * @desc    Delete addon purchase (Admin only)
 * @access  Admin only
 */
router.delete('/admin/:id', authenticateToken, requireRole(['admin']), deleteAddonPurchase);

module.exports = router; 