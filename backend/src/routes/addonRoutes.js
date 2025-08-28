const express = require('express');
const router = express.Router();
const { 
  getAllAddons, 
  getAddonById, 
  createAddon, 
  updateAddon, 
  deleteAddon,
  addFeatureToAddon,
  updateAddonFeature,
  deleteAddonFeature
} = require('../controllers/addonController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @route   GET /api/addons
 * @desc    Get all active addons
 * @access  Public
 */
router.get('/', getAllAddons);

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

/**
 * @route   POST /api/addons/:id/features
 * @desc    Add feature to addon
 * @access  Admin only
 */
router.post('/:id/features', authenticateToken, requireRole(['admin']), addFeatureToAddon);

/**
 * @route   PUT /api/addons/:addonId/features/:featureId
 * @desc    Update addon feature
 * @access  Admin only
 */
router.put('/:addonId/features/:featureId', authenticateToken, requireRole(['admin']), updateAddonFeature);

/**
 * @route   DELETE /api/addons/:addonId/features/:featureId
 * @desc    Delete addon feature
 * @access  Admin only
 */
router.delete('/:addonId/features/:featureId', authenticateToken, requireRole(['admin']), deleteAddonFeature);

module.exports = router; 