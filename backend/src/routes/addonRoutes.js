const express = require('express');
const router = express.Router();
const { 
  getAllAddons, 
  getAddonById, 
  createAddon, 
  updateAddon, 
  deleteAddon,
  getUserAddons
} = require('../controllers/addonController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @route   GET /api/addons
 * @desc    Get all active addons
 * @access  Public
 */
router.get('/', getAllAddons);

/**
 * @route   GET /api/addons/user
 * @desc    Get current user's purchased addons
 * @access  Private
 */
router.get('/user', authenticateToken, getUserAddons);

/**
 * @route   GET /api/addons/:id
 * @desc    Get addon by ID
 * @access  Public
 */
router.get('/:id', getAddonById);

/**
 * @route   POST /api/addons
 * @desc    Create new addon
 * @access  Admin only
 */
router.post('/', authenticateToken, requireRole(['admin']), createAddon);

/**
 * @route   PUT /api/addons/:id
 * @desc    Update addon
 * @access  Admin only
 */
router.put('/:id', authenticateToken, requireRole(['admin']), updateAddon);

/**
 * @route   DELETE /api/addons/:id
 * @desc    Delete addon
 * @access  Admin only
 */
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteAddon);

module.exports = router; 