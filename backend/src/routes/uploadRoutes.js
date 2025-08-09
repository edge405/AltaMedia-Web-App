const express = require('express');
const router = express.Router();
const { testFileUpload, testImageUpload } = require('../controllers/uploadController');
const { handleFileUpload } = require('../utils/uploadUtils');

/**
 * @route   POST /api/upload/test
 * @desc    Test multiple file upload to Cloudinary (any file type)
 * @access  Public
 */
router.post('/test', 
  handleFileUpload({
    fieldName: 'files',
    maxFiles: 10,
    imagesOnly: false
  }),
  testFileUpload
);

/**
 * @route   POST /api/upload/test-image
 * @desc    Test single image upload to Cloudinary (images only)
 * @access  Public
 */
router.post('/test-image',
  handleFileUpload({
    fieldName: 'image',
    maxFiles: 1,
    imagesOnly: true
  }),
  testImageUpload
);

module.exports = router;
