const express = require('express');
const router = express.Router();
const { getAISuggestions } = require('../controllers/aiSuggestionsController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   POST /api/ai-suggestions
 * @desc    Get AI suggestions for form fields
 * @access  Private
 */
router.post('/', authenticateToken, getAISuggestions);

module.exports = router;