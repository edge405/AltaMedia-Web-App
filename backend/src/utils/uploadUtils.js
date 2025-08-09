const multer = require('multer');
const { uploadFile } = require('./cloudinary');

/**
 * Reusable multer configuration factory
 * @param {Object} options - Custom options for multer
 * @returns {Object} Configured multer instance
 */
const createMulterUpload = (options = {}) => {
  const defaultOptions = {
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      // Allow all file types by default
      cb(null, true);
    }
  };

  // Merge with custom options
  const finalOptions = { ...defaultOptions, ...options };
  
  return multer(finalOptions);
};

/**
 * Reusable function for uploading multiple files to Cloudinary
 * @param {Array} files - Array of file objects from multer
 * @param {Object} options - Upload options
 * @param {string} options.folder - Cloudinary folder name (default: 'uploads')
 * @param {string} options.prefix - File name prefix (default: 'file')
 * @param {boolean} options.imagesOnly - Whether to allow only images (default: false)
 * @param {number} options.maxFiles - Maximum number of files (default: 10)
 * @returns {Promise<Object>} Upload results
 */
const uploadMultipleFiles = async (files, options = {}) => {
  const {
    folder = 'uploads',
    prefix = 'file',
    imagesOnly = false,
    maxFiles = 10
  } = options;

  try {
    // Validate input
    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new Error('No files provided');
    }

    if (files.length > maxFiles) {
      throw new Error(`Maximum ${maxFiles} files allowed`);
    }

    console.log(`Uploading ${files.length} files to Cloudinary...`);

    const uploadResults = [];
    const errors = [];
    const fileTypes = {
      images: 0,
      videos: 0,
      documents: 0,
      others: 0
    };

    // Process each file
    for (const file of files) {
      try {
        console.log('Processing file:', {
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        });

        // Validate file type if imagesOnly is true
        if (imagesOnly && !file.mimetype.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }

        // Determine Cloudinary resource_type and track file types
        let resourceType = 'auto';
        if (file.mimetype.startsWith('image/')) {
          resourceType = 'image';
          fileTypes.images++;
        } else if (file.mimetype.startsWith('video/')) {
          resourceType = 'video';
          fileTypes.videos++;
        } else if (file.mimetype.startsWith('application/') || file.mimetype.startsWith('text/')) {
          resourceType = 'raw';
          fileTypes.documents++;
        } else {
          resourceType = 'raw';
          fileTypes.others++;
        }

        // Generate unique public ID
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substr(2, 9);
        const publicId = `${prefix}_${timestamp}_${randomId}`;

        // Upload to Cloudinary
        const uploadResult = await uploadFile(
          file.buffer,
          folder,
          publicId,
          resourceType
        );

        uploadResults.push({
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          resourceType: resourceType,
          cloudinary: uploadResult
        });

      } catch (uploadError) {
        console.error(`Failed to upload ${file.originalname}:`, uploadError);
        errors.push({
          originalName: file.originalname,
          error: uploadError.message
        });
      }
    }

    // Calculate summary statistics
    const totalSize = uploadResults.reduce((sum, file) => sum + file.size, 0);
    const averageSize = uploadResults.length > 0 ? Math.round(totalSize / uploadResults.length) : 0;

    return {
      success: true,
      message: `Uploaded ${uploadResults.length} files successfully`,
      urls: uploadResults.map(file => file.cloudinary.url),
      data: {
        uploaded: uploadResults,
        failed: errors,
        totalFiles: files.length,
        successfulUploads: uploadResults.length,
        failedUploads: errors.length,
        fileTypes: fileTypes,
        summary: {
          totalSize,
          averageSize,
          successRate: files.length > 0 ? Math.round((uploadResults.length / files.length) * 100) : 0
        }
      }
    };

  } catch (error) {
    console.error('Multiple file upload error:', error);
    throw new Error(`Failed to upload files: ${error.message}`);
  }
};

/**
 * Create multer middleware for multiple file uploads
 * @param {Object} options - Multer and upload options
 * @param {string} options.fieldName - Form field name (default: 'files')
 * @param {number} options.maxFiles - Maximum number of files (default: 10)
 * @param {boolean} options.imagesOnly - Whether to allow only images (default: false)
 * @param {Object} options.multerOptions - Custom multer options
 * @returns {Function} Express middleware function
 */
const createUploadMiddleware = (options = {}) => {
  const {
    fieldName = 'files',
    maxFiles = 10,
    imagesOnly = false,
    multerOptions = {}
  } = options;

  // Create multer instance
  const multerConfig = {
    ...multerOptions,
    fileFilter: imagesOnly ? (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    } : multerOptions.fileFilter || ((req, file, cb) => cb(null, true))
  };

  const upload = createMulterUpload(multerConfig);

  return upload.array(fieldName, maxFiles);
};

/**
 * Express middleware for handling file uploads
 * @param {Object} options - Upload options
 * @returns {Function} Express middleware
 */
const handleFileUpload = (options = {}) => {
  const uploadMiddleware = createUploadMiddleware(options);

  return (req, res, next) => {
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files provided'
        });
      }

      try {
        const result = await uploadMultipleFiles(req.files, {
          ...options,
          folder: options.folder || 'uploads'
        });
        req.uploadResult = result;
        next();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to upload files',
          error: error.message
        });
      }
    });
  };
};

module.exports = {
  createMulterUpload,
  uploadMultipleFiles,
  createUploadMiddleware,
  handleFileUpload
};
