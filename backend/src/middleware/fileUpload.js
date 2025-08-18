const multer = require('multer');
const { createLocalUpload } = require('../utils/fileUploadUtils');

/**
 * Middleware for handling file uploads for form data
 * @param {string} fieldName - Name of the field to handle files for
 * @param {number} maxFiles - Maximum number of files allowed
 * @returns {Function} Express middleware function
 */
const handleFormFileUpload = (fieldName, maxFiles = 10) => {
  const upload = createLocalUpload({
    uploadPath: './uploads/forms',
    prefix: 'form',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: maxFiles
  });

  return upload.array(fieldName, maxFiles);
};

/**
 * Middleware for handling multiple file upload fields
 * @param {Array} fields - Array of field configurations
 * @returns {Function} Express middleware function
 */
const handleMultipleFileUploads = (fields) => {
  const upload = createLocalUpload({
    uploadPath: './uploads/forms',
    prefix: 'form',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 50 // Higher limit for multiple fields
  });

  return upload.fields(fields);
};

/**
 * Error handling middleware for file uploads
 * @param {Error} error - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleFileUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum file size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 10 files allowed.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
  }

  if (error.message.includes('File type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};

module.exports = {
  handleFormFileUpload,
  handleMultipleFileUploads,
  handleFileUploadError
};
