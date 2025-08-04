const express = require('express');
const router = express.Router();
const { 
  getAllPackages, 
  getPackageById, 
  createPackage, 
  updatePackage, 
  deletePackage 
} = require('../controllers/packageController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @route   GET /api/packages
 * @desc    Get all active packages
 * @access  Public
 */
router.get('/', getAllPackages);

/**
 * @route   GET /api/packages/:id
 * @desc    Get package by ID with features
 * @access  Public
 */
router.get('/:id', getPackageById);

/**
 * @route   POST /api/packages
 * @desc    Create new package
 * @access  Admin only
 */
router.post('/', authenticateToken, requireRole(['admin']), createPackage);

/**
 * @route   PUT /api/packages/:id
 * @desc    Update package
 * @access  Admin only
 */
router.put('/:id', authenticateToken, requireRole(['admin']), updatePackage);

/**
 * @route   DELETE /api/packages/:id
 * @desc    Delete package
 * @access  Admin only
 */
router.delete('/:id', authenticateToken, requireRole(['admin']), deletePackage);

module.exports = router;