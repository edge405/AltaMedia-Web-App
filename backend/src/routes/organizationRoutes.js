const express = require('express');
const router = express.Router();
const { 
  saveFormData, 
  getFormData, 
  completeForm, 
  getAllForms, 
  getFormById, 
  deleteForm 
} = require('../controllers/organizationController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { handleMultipleFileUploads, handleFileUploadError } = require('../middleware/fileUpload');

/**
 * @route PUT /api/organization/save
 * @desc Save or update Organization form data
 * @access Private
 */
router.put('/save', 
  authenticateToken,
  handleMultipleFileUploads([
    { name: 'reference_materials', maxCount: 10 }
  ]),
  handleFileUploadError,
  saveFormData
);

/**
 * @route GET /api/organization/data
 * @desc Get Organization form data for current user
 * @access Private
 */
router.get('/data', 
  authenticateToken,
  getFormData
);

/**
 * @route PUT /api/organization/complete
 * @desc Complete Organization form
 * @access Private
 */
router.put('/complete', 
  authenticateToken,
  completeForm
);

/**
 * @route GET /api/organization/admin/all
 * @desc Get all Organization forms (Admin)
 * @access Private (Admin)
 */
router.get('/admin/all', 
  authenticateToken,
  requireRole(['admin']),
  getAllForms
);

/**
 * @route GET /api/organization/admin/:id
 * @desc Get Organization form by ID (Admin)
 * @access Private (Admin)
 */
router.get('/admin/:id', 
  authenticateToken,
  requireRole(['admin']),
  getFormById
);

/**
 * @route DELETE /api/organization/admin/:id
 * @desc Delete Organization form (Admin)
 * @access Private (Admin)
 */
router.delete('/admin/:id', 
  authenticateToken,
  requireRole(['admin']),
  deleteForm
);

module.exports = router;
