const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {Buffer|string} file - File buffer or base64 string
 * @param {string} folder - Cloudinary folder name
 * @param {string} public_id - Optional public ID for the image
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadImage = async (file, folder = 'brandkit', public_id = null) => {
  try {
    const uploadOptions = {
      folder: folder,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'svg', 'ai', 'eps'],
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    };

    if (public_id) {
      uploadOptions.public_id = public_id;
    }

    let uploadResult;
    if (Buffer.isBuffer(file)) {
      // Upload buffer
      uploadResult = await cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) throw error;
          return result;
        }
      ).end(file);
    } else {
      // Upload base64 string
      uploadResult = await cloudinary.uploader.upload(file, uploadOptions);
    }

    console.log('Image uploaded successfully:', {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
      format: uploadResult.format,
      size: uploadResult.bytes
    });

    return {
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      size: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height
    };

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} public_id - Cloudinary public ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    
    console.log('Image deleted successfully:', {
      public_id: public_id,
      result: result.result
    });

    return {
      success: true,
      message: 'Image deleted successfully'
    };

  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Generate optimized URL for Cloudinary image
 * @param {string} public_id - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} Optimized URL
 */
const getOptimizedUrl = (public_id, options = {}) => {
  const defaultOptions = {
    quality: 'auto:good',
    fetch_format: 'auto',
    ...options
  };

  return cloudinary.url(public_id, defaultOptions);
};

/**
 * Upload multiple images
 * @param {Array} files - Array of file buffers or base64 strings
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Array>} Array of upload results
 */
const uploadMultipleImages = async (files, folder = 'brandkit') => {
  try {
    const uploadPromises = files.map((file, index) => {
      const public_id = `${folder}_${Date.now()}_${index}`;
      return uploadImage(file, folder, public_id);
    });

    const results = await Promise.all(uploadPromises);
    
    console.log(`Uploaded ${results.length} images successfully`);
    
    return {
      success: true,
      images: results
    };

  } catch (error) {
    console.error('Multiple image upload error:', error);
    throw new Error(`Failed to upload multiple images: ${error.message}`);
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  getOptimizedUrl,
  uploadMultipleImages
}; 