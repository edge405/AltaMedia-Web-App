const express = require('express');
const router = express.Router();
const { getAISuggestions } = require('../controllers/aiSuggestionsController');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/ai-suggestions
 * @desc    Get AI suggestions for form fields
 * @access  Private
 */
router.get('/', protect, getAISuggestions);

module.exports = router;