const express = require('express');
const router = express.Router();
const { 
  createClientRequest,
  getClientRequests,
  getClientRequest,
  getAllClientRequests,
  updateClientRequest,
  getClientRequestAdmin
} = require('../controllers/clientRequestController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Admin routes
/**
 * @route   GET /api/admin/client-requests
 * @desc    Get all client requests (Admin only)
 * @access  Admin
 */
router.get('/admin', 
  authenticateToken,
  requireRole(['admin']),
  getAllClientRequests
);

/**
 * @route   GET /api/admin/client-requests/:id
 * @desc    Get client request by ID (Admin only)
 * @access  Admin
 */
router.get('/admin/:id', 
  authenticateToken,
  requireRole(['admin']),
  getClientRequestAdmin
);

/**
 * @route   PUT /api/admin/client-requests/:id
 * @desc    Update client request status and response (Admin only)
 * @access  Admin
 */
router.put('/admin/:id', 
  authenticateToken,
  requireRole(['admin']),
  updateClientRequest
);

// Client routes
/**
 * @route   POST /api/client-requests
 * @desc    Create new client request
 * @access  Private
 */
router.post('/', 
  authenticateToken,
  createClientRequest
);

/**
 * @route   GET /api/client-requests
 * @desc    Get client requests for current user
 * @access  Private
 */
router.get('/', 
  authenticateToken,
  getClientRequests
);

/**
 * @route   GET /api/client-requests/:id
 * @desc    Get client request by ID
 * @access  Private
 */
router.get('/:id', 
  authenticateToken,
  getClientRequest
);

module.exports = router;
