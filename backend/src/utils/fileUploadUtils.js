const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Create uploads directory if it doesn't exist
 * @param {string} uploadPath - Path to create
 */
const ensureUploadDirectory = (uploadPath) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

/**
 * Generate unique filename
 * @param {string} originalName - Original filename
 * @param {string} prefix - Prefix for the filename
 * @returns {string} Unique filename
 */
const generateUniqueFilename = (originalName, prefix = 'file') => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substr(2, 9);
  const extension = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, extension);
  return `${prefix}_${timestamp}_${randomId}_${nameWithoutExt}${extension}`;
};

/**
 * Configure multer storage for local file uploads
 * @param {string} uploadPath - Directory path for uploads
 * @param {string} prefix - Prefix for filenames
 * @returns {Object} Multer storage configuration
 */
const createLocalStorage = (uploadPath, prefix = 'file') => {
  ensureUploadDirectory(uploadPath);
  
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueFilename = generateUniqueFilename(file.originalname, prefix);
      cb(null, uniqueFilename);
    }
  });
};

/**
 * File filter function for multer
 * @param {Object} req - Express request object
 * @param {Object} file - File object from multer
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
  // Allow common file types
  const allowedMimeTypes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Documents
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv',
    // Archives
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
    // Videos (optional - can be removed if not needed)
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

/**
 * Create multer upload instance for local file storage
 * @param {Object} options - Configuration options
 * @param {string} options.uploadPath - Directory path for uploads
 * @param {string} options.prefix - Prefix for filenames
 * @param {number} options.maxFileSize - Maximum file size in bytes (default: 10MB)
 * @param {number} options.maxFiles - Maximum number of files (default: 10)
 * @returns {Object} Configured multer instance
 */
const createLocalUpload = (options = {}) => {
  const {
    uploadPath = process.env.UPLOAD_PATH || './uploads/forms',
    prefix = 'form',
    maxFileSize = 10 * 1024 * 1024, // 10MB
    maxFiles = 10
  } = options;

  return multer({
    storage: createLocalStorage(uploadPath, prefix),
    limits: {
      fileSize: maxFileSize,
      files: maxFiles
    },
    fileFilter: fileFilter
  });
};

/**
 * Process uploaded files and return file information
 * @param {Array} files - Array of uploaded files from multer
 * @param {string} baseUrl - Base URL for file access (optional)
 * @returns {Array} Array of file information objects
 */
const processUploadedFiles = (files, baseUrl = '') => {
  if (!files || files.length === 0) {
    return [];
  }

  return files.map(file => ({
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    url: baseUrl ? `${baseUrl}/${file.filename}` : file.path
  }));
};

/**
 * Extract file uploads from form data
 * @param {Object} formData - Form data object
 * @param {Array} uploadedFiles - Array of uploaded files from multer
 * @param {string} fieldName - Field name to extract files for
 * @returns {Array} Array of file paths for the specified field
 */
const extractFileUploads = (formData, uploadedFiles, fieldName) => {
  const filePaths = [];
  
  // If there are new uploaded files, use only those (replace existing)
  if (uploadedFiles && uploadedFiles.length > 0) {
    // Add only the newly uploaded files
    uploadedFiles.forEach(file => {
      filePaths.push(file.path);
    });
    return filePaths; // Return only new files, don't merge with existing
  }
  
  // If no new files uploaded, preserve existing files from form data
  // But only if they are actual file paths (not File objects from frontend)
  if (formData[fieldName]) {
    if (Array.isArray(formData[fieldName])) {
      // Filter out File objects and keep only string paths
      const existingPaths = formData[fieldName].filter(item => 
        typeof item === 'string' && (item.includes('/') || item.includes('\\'))
      );
      filePaths.push(...existingPaths);
    } else if (typeof formData[fieldName] === 'string') {
      // If it's a string, it might be a single path or comma-separated paths
      const paths = formData[fieldName].split(',').map(p => p.trim()).filter(p => p);
      filePaths.push(...paths);
    }
  }
  
  return filePaths;
};

/**
 * Clean up files that are no longer needed
 * @param {Array} oldPaths - Array of old file paths
 * @param {Array} newPaths - Array of new file paths
 */
const cleanupOldFiles = (oldPaths, newPaths) => {
  if (!Array.isArray(oldPaths)) return;
  
  oldPaths.forEach(oldPath => {
    if (oldPath && !newPaths.includes(oldPath) && fs.existsSync(oldPath)) {
      try {
        fs.unlinkSync(oldPath);
        console.log(`Deleted old file: ${oldPath}`);
      } catch (error) {
        console.error(`Error deleting file ${oldPath}:`, error);
      }
    }
  });
};

module.exports = {
  createLocalUpload,
  processUploadedFiles,
  extractFileUploads,
  cleanupOldFiles,
  ensureUploadDirectory,
  generateUniqueFilename
};