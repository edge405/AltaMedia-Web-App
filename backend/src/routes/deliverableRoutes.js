const express = require('express');
const router = express.Router();
const { 
  uploadDeliverable,
  getDeliverablesByPurchase,
  getLatestDeliverablesByPurchase,
  getDeliverableHistory,
  getDeliverable,
  updateDeliverable,
  updateDeliverableStatus,
  getPendingDeliverables,
  getAllDeliverables,
  getClientDeliverables,
  getClientDeliverableHistory,
  approveDeliverable
} = require('../controllers/deliverableController');
const { createRevisionRequest } = require('../controllers/revisionRequestController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { createLocalUpload } = require('../utils/fileUploadUtils');

// Configure file upload middleware for deliverables
const deliverableUpload = createLocalUpload({
  uploadPath: './uploads/deliverables',
  prefix: 'deliverable',
  maxFileSize: 50 * 1024 * 1024, // 50MB for deliverables
  maxFiles: 1
});

// Admin routes
/**
 * @route   POST /api/deliverables/admin/upload
 * @desc    Upload deliverable (Admin only) - Supports both file and link uploads
 * @access  Admin
 */
router.post('/admin/upload', 
  authenticateToken,
  requireRole(['admin']),
  (req, res, next) => {
    // Check if this is a FormData request (file upload) or JSON request (link upload)
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('multipart/form-data')) {
      // For FormData requests, always apply the upload middleware
      // The controller will handle the logic based on the uploadType
      deliverableUpload.array('files', 1)(req, res, next);
    } else {
      // JSON request - body should already be parsed by express.json()
      next();
    }
  },
  uploadDeliverable
);

/**
 * @route   GET /api/deliverables/admin/:purchaseId
 * @desc    Get all deliverables by purchase ID (Admin only) - All versions
 * @access  Admin
 */
router.get('/admin/:purchaseId', 
  authenticateToken,
  requireRole(['admin']),
  getDeliverablesByPurchase
);

/**
 * @route   GET /api/deliverables/admin/:purchaseId/latest
 * @desc    Get latest deliverables by purchase ID (Admin only) - Latest version per feature
 * @access  Admin
 */
router.get('/admin/:purchaseId/latest', 
  authenticateToken,
  requireRole(['admin']),
  getLatestDeliverablesByPurchase
);

/**
 * @route   GET /api/deliverables/admin/:purchaseId/:featureName/history
 * @desc    Get deliverable version history for a specific feature (Admin only)
 * @access  Admin
 */
router.get('/admin/:purchaseId/:featureName/history', 
  authenticateToken,
  requireRole(['admin']),
  getDeliverableHistory
);

/**
 * @route   PUT /api/deliverables/admin/:id
 * @desc    Update deliverable (Admin only) - Creates new version
 * @access  Admin
 */
router.put('/admin/:id', 
  authenticateToken,
  requireRole(['admin']),
  deliverableUpload.array('files', 1),
  updateDeliverable
);

/**
 * @route   PUT /api/deliverables/admin/:id/status
 * @desc    Update deliverable status (Admin only)
 * @access  Admin
 */
router.put('/admin/:id/status', 
  authenticateToken,
  requireRole(['admin']),
  updateDeliverableStatus
);

/**
 * @route   GET /api/deliverables/admin/pending
 * @desc    Get pending deliverables (Admin only) - Latest versions only
 * @access  Admin
 */
router.get('/admin/pending', 
  authenticateToken,
  requireRole(['admin']),
  getPendingDeliverables
);

/**
 * @route   GET /api/deliverables/admin/all
 * @desc    Get all deliverables (Admin only) - Latest versions only
 * @access  Admin
 */
router.get('/admin/all', 
  authenticateToken,
  requireRole(['admin']),
  getAllDeliverables
);

// Client routes
/**
 * @route   GET /api/deliverables/:purchaseId
 * @desc    Get deliverables for client by purchase ID - Latest versions only
 * @access  Private
 */
router.get('/:purchaseId', 
  authenticateToken,
  getClientDeliverables
);

/**
 * @route   GET /api/deliverables/:purchaseId/:featureName/history
 * @desc    Get deliverable version history for client
 * @access  Private
 */
router.get('/:purchaseId/:featureName/history', 
  authenticateToken,
  getClientDeliverableHistory
);

/**
 * @route   GET /api/deliverables/:id
 * @desc    Get single deliverable
 * @access  Private
 */
router.get('/:id', 
  authenticateToken,
  getDeliverable
);

/**
 * @route   POST /api/deliverables/:id/request-revision
 * @desc    Request revision for deliverable
 * @access  Private
 */
router.post('/:id/request-revision', 
  authenticateToken,
  createRevisionRequest
);

/**
 * @route   PUT /api/deliverables/:id/approve
 * @desc    Approve deliverable (Client only)
 * @access  Private
 */
router.put('/:id/approve', 
  authenticateToken,
  approveDeliverable
);

module.exports = router;
