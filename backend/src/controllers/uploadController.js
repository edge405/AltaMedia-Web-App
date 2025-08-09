const { uploadMultipleFiles, handleFileUpload } = require('../utils/uploadUtils');

/**
 * Test multiple file upload to Cloudinary (any file type)
 * POST /api/upload/test
 */
const testFileUpload = async (req, res) => {
  try {
    const result = await uploadMultipleFiles(req.files, {
      folder: 'test-uploads',
      prefix: 'test',
      imagesOnly: false,
      maxFiles: 10
    });

    res.json(result);

  } catch (error) {
    console.error('Upload test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files',
      error: error.message
    });
  }
};

/**
 * Test single image upload to Cloudinary (images only)
 * POST /api/upload/test-image
 */
const testImageUpload = async (req, res) => {
  try {
    const result = await uploadMultipleFiles([req.file], {
      folder: 'test-uploads',
      prefix: 'image',
      imagesOnly: true,
      maxFiles: 1
    });

    res.json(result);

  } catch (error) {
    console.error('Upload test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
};

module.exports = {
  testFileUpload,
  testImageUpload
};
