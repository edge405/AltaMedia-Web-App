const express = require('express');
const router = express.Router();
const { saveFormData, getFormData } = require('../controllers/productServiceController');
const { authenticateToken } = require('../middleware/auth');
const { handleFileUploadError, handleMultipleFileUploads } = require('../middleware/fileUpload');

/**
 * @route PUT /api/productservice/save
 * @desc Save or update ProductService form data for a specific step
 * @access Private
 */
router.put('/save', 
  // authenticateToken, // Temporarily disabled for testing
  handleMultipleFileUploads([{
    name: 'reference_materials',
    maxCount: 10
  }]),
  handleFileUploadError,
  saveFormData
);

/**
 * @route GET /api/productservice/data/:userId
 * @desc Get ProductService form data for a user
 * @access Private
 */
router.get('/data/:userId', 
  // authenticateToken, // Temporarily disabled for testing
  getFormData
);

module.exports = router;
