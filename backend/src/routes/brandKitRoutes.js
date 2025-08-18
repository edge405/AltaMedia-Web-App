const express = require('express');
const router = express.Router();
const { 
  saveFormData, 
  getFormData,
  getAllFormDataFromMariaDB
} = require('../controllers/brandKitController');
const { authenticateToken } = require('../middleware/auth');
const { handleMultipleFileUploads, handleFileUploadError } = require('../middleware/fileUpload');

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
  handleMultipleFileUploads([
    { name: 'reference_materials', maxCount: 10 },
    { name: 'inspiration_links', maxCount: 10 }
  ]),
  handleFileUploadError,
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



/**
 * @route   GET /api/brandkit/all/mariadb
 * @desc    Get all BrandKit form data from MariaDB (for admin purposes)
 * @access  Private
 */
router.get('/all/mariadb', 
  // authenticateToken, // Temporarily disabled for testing
  getAllFormDataFromMariaDB
);

module.exports = router; 