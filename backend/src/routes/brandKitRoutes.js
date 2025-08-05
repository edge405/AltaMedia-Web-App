const express = require('express');
const router = express.Router();
const { 
  saveFormData, 
  getFormData
} = require('../controllers/brandKitController');
const { authenticateToken } = require('../middleware/auth');

// Simple validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    // For now, just pass through - we can add validation later
    next();
  };
};

// Test endpoint to verify routes are working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'BrandKit routes are working!',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route   PUT /api/brandkit/save
 * @desc    Save or update BrandKit form data for a specific step
 * @access  Private
 */
router.put('/save', 
  // authenticateToken, // Temporarily disabled for testing
  saveFormData
);

/**
 * @route   GET /api/brandkit/data/:userId
 * @desc    Get BrandKit form data for a user
 * @access  Private
 */
router.get('/data/:userId', 
  // authenticateToken, // Temporarily disabled for testing
  getFormData
);

module.exports = router; 