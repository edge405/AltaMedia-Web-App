const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { consolidateFormData, triggerWebhook } = require('../controllers/brandKitConsolidationController');

/**
 * @route GET /api/brandkit/consolidate/:userId
 * @desc Consolidate all BrandKit form data into a single JSON structure
 * @access Private
 */
router.get('/consolidate/:userId', authenticateToken, consolidateFormData);

/**
 * @route POST /api/brandkit/webhook/:userId
 * @desc Trigger webhook with consolidated BrandKit form data
 * @access Private
 */
router.post('/webhook/:userId', authenticateToken, triggerWebhook);

module.exports = router;
