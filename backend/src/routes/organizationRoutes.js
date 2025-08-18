const express = require('express');
const router = express.Router();
const { saveFormData, getFormData } = require('../controllers/organizationController');
const { handleMultipleFileUploads, handleFileUploadError } = require('../middleware/fileUpload');

/**
 * @route PUT /api/organization/save
 * @desc Save or update Organization form data
 * @access Private
 */
router.put('/save', 
  handleMultipleFileUploads([
    { name: 'reference_materials', maxCount: 10 }
  ]),
  handleFileUploadError,
  saveFormData
);

/**
 * @route GET /api/organization/data/:userId
 * @desc Get Organization form data for a user
 * @access Private
 */
router.get('/data/:userId', getFormData);

module.exports = router;
