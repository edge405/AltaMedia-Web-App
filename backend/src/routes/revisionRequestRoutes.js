const express = require('express');
const router = express.Router();
const { 
  createRevisionRequest,
  getRevisionRequests,
  getAllRevisionRequests,
  updateRevisionRequestStatus,
  updateRevisionRequest,
  getRevisionRequest
} = require('../controllers/revisionRequestController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Admin routes
/**
 * @route   GET /api/admin/revision-requests
 * @desc    Get all revision requests (Admin only)
 * @access  Admin
 */
router.get('/admin', 
  authenticateToken,
  requireRole(['admin']),
  getAllRevisionRequests
);

/**
 * @route   PUT /api/admin/revision-requests/:id/status
 * @desc    Update revision request status (Admin only)
 * @access  Admin
 */
router.put('/admin/:id/status', 
  authenticateToken,
  requireRole(['admin']),
  updateRevisionRequestStatus
);

// Client routes
/**
 * @route   GET /api/revision-requests
 * @desc    Get revision requests for current user
 * @access  Private
 */
router.get('/', 
  authenticateToken,
  getRevisionRequests
);

/**
 * @route   PUT /api/revision-requests/:id
 * @desc    Update revision request (Client only)
 * @access  Private
 */
router.put('/:id', 
  authenticateToken,
  updateRevisionRequest
);

/**
 * @route   GET /api/revision-requests/:id
 * @desc    Get revision request by ID
 * @access  Private
 */
router.get('/:id', 
  authenticateToken,
  getRevisionRequest
);

module.exports = router;
