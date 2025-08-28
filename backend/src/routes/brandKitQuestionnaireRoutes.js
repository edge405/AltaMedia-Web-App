const express = require('express');
const router = express.Router();
const { 
  saveFormData, 
  getFormData,
  getAllForms,
  completeForm,
  deleteForm
} = require('../controllers/brandKitQuestionnaireController');
const { authenticateToken, requireRole } = require('../middleware/auth');
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
    message: 'BrandKit Questionnaire routes are working!',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route   PUT /api/brandkit-questionnaire/save
 * @desc    Save or update BrandKit Questionnaire form data for a specific step
 * @access  Private
 */
router.put('/save', 
  authenticateToken,
  handleMultipleFileUploads([
    { name: 'brand_logo', maxCount: 5 },
    { name: 'reference_materials', maxCount: 10 },
    { name: 'web_page_upload', maxCount: 5 }
  ]),
  handleFileUploadError,
  saveFormData
);

/**
 * @route   GET /api/brandkit-questionnaire/data/:userId
 * @desc    Get BrandKit Questionnaire form data for a user
 * @access  Private
 */
router.get('/data/:userId', 
  authenticateToken,
  getFormData
);

/**
 * @route   GET /api/brandkit-questionnaire/admin/all
 * @desc    Get all BrandKit Questionnaire forms (Admin)
 * @access  Private (Admin)
 */
router.get('/admin/all', 
  authenticateToken,
  requireRole(['admin']),
  getAllForms
);

/**
 * @route   PUT /api/brandkit-questionnaire/complete/:userId
 * @desc    Mark BrandKit Questionnaire form as completed
 * @access  Private
 */
router.put('/complete/:userId', 
  authenticateToken,
  completeForm
);

/**
 * @route   DELETE /api/brandkit-questionnaire/admin/:id
 * @desc    Delete BrandKit Questionnaire form (Admin)
 * @access  Private (Admin)
 */
router.delete('/admin/:id', 
  authenticateToken,
  requireRole(['admin']),
  deleteForm
);

module.exports = router;
