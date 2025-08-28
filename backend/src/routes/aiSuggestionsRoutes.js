const express = require('express');
const router = express.Router();
const { getAISuggestions } = require('../controllers/aiSuggestionsController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   GET /api/ai-suggestions
 * @desc    Get AI suggestions for form fields
 * @access  Private
 */
router.get('/', authenticateToken, getAISuggestions);

module.exports = router;