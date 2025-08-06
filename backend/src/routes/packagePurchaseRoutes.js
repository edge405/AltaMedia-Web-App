const express = require('express');
const router = express.Router();
const { 
  getUserPackagePurchases, 
  getPackagePurchaseById, 
  getAllPackagePurchases
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

module.exports = router; 