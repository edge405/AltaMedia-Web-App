const { executeQuery } = require('../config/mysql');
const logger = require('../utils/logger');
const { createLocalUpload, processUploadedFiles } = require('../utils/fileUploadUtils');
const path = require('path');

/**
 * Upload deliverable (Admin only)
 * @route POST /api/admin/deliverables/upload
 * @access Admin
 */
const uploadDeliverable = async (req, res) => {
  try {
    
    const { purchaseId, featureName, adminNotes, uploadType, deliverableLink } = req.body;
    const uploadedBy = req.user.id;

    // Validate required fields
    if (!purchaseId || !featureName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: purchaseId and featureName'
      });
    }

    // Validate upload type and corresponding data
    if (uploadType === 'files') {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: files'
        });
      }
    } else if (uploadType === 'link') {
      if (!deliverableLink || !deliverableLink.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: deliverableLink'
        });
      }
      
      // Basic URL validation
      try {
        new URL(deliverableLink);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid URL format'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid upload type. Must be "files" or "link"'
      });
    }

    // Verify purchase exists and belongs to a user
    const purchases = await executeQuery(
      'SELECT id, user_id FROM purchased_package_with_features WHERE id = ?',
      [purchaseId]
    );

    if (purchases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    // Get the next version number for this purchase/feature combination
    const existingVersions = await executeQuery(
      'SELECT MAX(version_number) as max_version FROM deliverables WHERE purchase_id = ? AND feature_name = ?',
      [purchaseId, featureName]
    );

    const nextVersionNumber = (existingVersions[0].max_version || 0) + 1;

    // Process upload based on type
    let filePath = '';
    let linkPath = null;

    if (uploadType === 'files') {
      // Process uploaded files
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }
      const uploadedFiles = processUploadedFiles(req.files);
      filePath = uploadedFiles[0].path;
    } else if (uploadType === 'link') {
      // Store the link
      linkPath = deliverableLink.trim();
    }
    
    // Insert new deliverable record with version number
    // For revisions (version > 1), always set status to pending for client review
    const deliverableStatus = nextVersionNumber > 1 ? 'pending' : 'pending';
    
    const insertResult = await executeQuery(
      `INSERT INTO deliverables 
       (purchase_id, feature_name, version_number, file_path, deliverable_link, uploaded_by, status, admin_notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [purchaseId, featureName, nextVersionNumber, filePath, linkPath, uploadedBy, deliverableStatus, adminNotes || null]
    );

    const deliverableId = insertResult.insertId;

    logger.info(`Deliverable uploaded: ID ${deliverableId}, Purchase ${purchaseId}, Feature ${featureName}, Version ${nextVersionNumber}, Type: ${uploadType}`);

    res.status(201).json({
      success: true,
      message: 'Deliverable uploaded successfully',
      data: {
        id: deliverableId,
        purchaseId,
        featureName,
        versionNumber: nextVersionNumber,
        uploadType: uploadType,
        filePath: filePath,
        deliverableLink: linkPath,
        status: 'pending',
        uploadedAt: new Date()
      }
    });

  } catch (error) {
    logger.error('Error uploading deliverable:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload deliverable',
      error: error.message
    });
  }
};

/**
 * Get deliverables by purchase ID (all versions)
 * @route GET /api/admin/deliverables/:purchaseId
 * @access Admin
 */
const getDeliverablesByPurchase = async (req, res) => {
  try {
    const { purchaseId } = req.params;

    const deliverables = await executeQuery(
      `SELECT d.*, u.fullname as uploaded_by_name 
       FROM deliverables d 
       LEFT JOIN users u ON d.uploaded_by = u.id 
       WHERE d.purchase_id = ? 
       ORDER BY d.feature_name, d.version_number DESC`,
      [purchaseId]
    );

    res.json({
      success: true,
      data: deliverables
    });

  } catch (error) {
    logger.error('Error fetching deliverables:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deliverables',
      error: error.message
    });
  }
};

/**
 * Get latest deliverables by purchase ID (only latest version per feature)
 * @route GET /api/admin/deliverables/:purchaseId/latest
 * @access Admin
 */
const getLatestDeliverablesByPurchase = async (req, res) => {
  try {
    const { purchaseId } = req.params;

    const deliverables = await executeQuery(
      `SELECT d.*, u.fullname as uploaded_by_name 
       FROM deliverables d 
       LEFT JOIN users u ON d.uploaded_by = u.id 
       WHERE d.purchase_id = ? 
       AND d.version_number = (
         SELECT MAX(version_number) 
         FROM deliverables d2 
         WHERE d2.purchase_id = d.purchase_id 
         AND d2.feature_name = d.feature_name
       )
       ORDER BY d.feature_name`,
      [purchaseId]
    );

    res.json({
      success: true,
      data: deliverables
    });

  } catch (error) {
    logger.error('Error fetching latest deliverables:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest deliverables',
      error: error.message
    });
  }
};

/**
 * Approve deliverable (Client only)
 * @route PUT /api/deliverables/:id/approve
 * @access Private
 */
const approveDeliverable = async (req, res) => {
  try {
    const { id: deliverableId } = req.params;
    const userId = req.user.id;

    // Verify deliverable exists and belongs to user
    const deliverables = await executeQuery(
      `SELECT d.*, ppwf.user_id as purchase_user_id 
       FROM deliverables d 
       LEFT JOIN purchased_package_with_features ppwf ON d.purchase_id = ppwf.id 
       WHERE d.id = ?`,
      [deliverableId]
    );

    if (deliverables.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Deliverable not found'
      });
    }

    const deliverable = deliverables[0];

    // Check if user has access to this deliverable
    if (deliverable.purchase_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if deliverable is in a state that allows approval
    if (deliverable.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only approve pending deliverables'
      });
    }

    // Update deliverable status to approved
    const result = await executeQuery(
      'UPDATE deliverables SET status = "approved", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [deliverableId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Deliverable not found'
      });
    }

    // Update any pending revision requests for the same purchase and feature
    // This handles the case where revision requests are linked to the original deliverable
    // but the client is approving a new revision
    await executeQuery(
      `UPDATE revision_requests rr 
       JOIN deliverables d ON rr.deliverable_id = d.id 
       SET rr.status = "completed", rr.updated_at = CURRENT_TIMESTAMP 
       WHERE d.purchase_id = ? AND d.feature_name = ? AND rr.status = "pending"`,
      [deliverable.purchase_id, deliverable.feature_name]
    );

    logger.info(`Deliverable approved: ID ${deliverableId}, User ${userId}`);

    res.json({
      success: true,
      message: 'Deliverable approved successfully'
    });

  } catch (error) {
    logger.error('Error approving deliverable:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve deliverable',
      error: error.message
    });
  }
};

/**
 * Get deliverable version history for a specific feature
 * @route GET /api/admin/deliverables/:purchaseId/:featureName/history
 * @access Admin
 */
const getDeliverableHistory = async (req, res) => {
  try {
    const { purchaseId, featureName } = req.params;

    const deliverables = await executeQuery(
      `SELECT d.*, u.fullname as uploaded_by_name,
              rr.request_reason as client_revision_comment,
              rr.requested_at as revision_requested_at,
              rr.status as revision_request_status
       FROM deliverables d 
       LEFT JOIN users u ON d.uploaded_by = u.id 
       LEFT JOIN revision_requests rr ON d.id = rr.deliverable_id
       WHERE d.purchase_id = ? AND d.feature_name = ?
       ORDER BY d.version_number DESC`,
      [purchaseId, featureName]
    );

    res.json({
      success: true,
      data: deliverables
    });

  } catch (error) {
    logger.error('Error fetching deliverable history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deliverable history',
      error: error.message
    });
  }
};

/**
 * Get single deliverable
 * @route GET /api/deliverables/:id
 * @access Private
 */
const getDeliverable = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deliverables = await executeQuery(
      `SELECT d.*, u.fullname as uploaded_by_name, ppwf.user_id as purchase_user_id
       FROM deliverables d 
       LEFT JOIN users u ON d.uploaded_by = u.id 
       LEFT JOIN purchased_package_with_features ppwf ON d.purchase_id = ppwf.id
       WHERE d.id = ?`,
      [id]
    );

    if (deliverables.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Deliverable not found'
      });
    }

    const deliverable = deliverables[0];

    // Check if user has access to this deliverable
    if (deliverable.purchase_user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: deliverable
    });

  } catch (error) {
    logger.error('Error fetching deliverable:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deliverable',
      error: error.message
    });
  }
};

/**
 * Update deliverable (Admin only) - This now creates a new version instead of updating existing
 * @route PUT /api/admin/deliverables/:id
 * @access Admin
 */
const updateDeliverable = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;
    let filePath = null;

    // Get the existing deliverable to get purchase_id and feature_name
    const existingDeliverables = await executeQuery(
      'SELECT purchase_id, feature_name FROM deliverables WHERE id = ?',
      [id]
    );

    if (existingDeliverables.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Deliverable not found'
      });
    }

    const existingDeliverable = existingDeliverables[0];

    // Handle file upload if provided
    if (req.files && req.files.length > 0) {
      const uploadedFiles = processUploadedFiles(req.files);
      filePath = uploadedFiles[0].path;
    } else {
      return res.status(400).json({
        success: false,
        message: 'New file is required for deliverable updates'
      });
    }

    // Get the next version number for this purchase/feature combination
    const existingVersions = await executeQuery(
      'SELECT MAX(version_number) as max_version FROM deliverables WHERE purchase_id = ? AND feature_name = ?',
      [existingDeliverable.purchase_id, existingDeliverable.feature_name]
    );

    const nextVersionNumber = (existingVersions[0].max_version || 0) + 1;

    // Insert new deliverable record with incremented version
    const insertResult = await executeQuery(
      `INSERT INTO deliverables 
       (purchase_id, feature_name, version_number, file_path, uploaded_by, status, admin_notes) 
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
      [existingDeliverable.purchase_id, existingDeliverable.feature_name, nextVersionNumber, filePath, req.user.id, adminNotes || null]
    );

    const newDeliverableId = insertResult.insertId;

    logger.info(`Deliverable updated (new version): ID ${newDeliverableId}, Purchase ${existingDeliverable.purchase_id}, Feature ${existingDeliverable.feature_name}, Version ${nextVersionNumber}`);

    res.json({
      success: true,
      message: 'Deliverable updated successfully (new version created)',
      data: {
        id: newDeliverableId,
        purchaseId: existingDeliverable.purchase_id,
        featureName: existingDeliverable.feature_name,
        versionNumber: nextVersionNumber,
        filePath: filePath,
        status: 'pending',
        uploadedAt: new Date()
      }
    });

  } catch (error) {
    logger.error('Error updating deliverable:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update deliverable',
      error: error.message
    });
  }
};

/**
 * Update deliverable status (Admin only)
 * @route PUT /api/admin/deliverables/:id/status
 * @access Admin
 */
const updateDeliverableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'revision_requested'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, approved, or revision_requested'
      });
    }

    const result = await executeQuery(
      'UPDATE deliverables SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Deliverable not found'
      });
    }

    logger.info(`Deliverable status updated: ID ${id}, Status ${status}`);

    res.json({
      success: true,
      message: 'Deliverable status updated successfully'
    });

  } catch (error) {
    logger.error('Error updating deliverable status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update deliverable status',
      error: error.message
    });
  }
};

/**
 * Get pending deliverables (Admin only) - Latest versions only
 * @route GET /api/admin/deliverables/pending
 * @access Admin
 */
const getPendingDeliverables = async (req, res) => {
  try {
    const deliverables = await executeQuery(
      `SELECT d.*, u.fullname as uploaded_by_name, ppwf.user_id as purchase_user_id
       FROM deliverables d 
       LEFT JOIN users u ON d.uploaded_by = u.id 
       LEFT JOIN purchased_package_with_features ppwf ON d.purchase_id = ppwf.id
       WHERE d.status = 'pending'
       AND d.version_number = (
         SELECT MAX(version_number) 
         FROM deliverables d2 
         WHERE d2.purchase_id = d.purchase_id 
         AND d2.feature_name = d.feature_name
       )
       ORDER BY d.uploaded_at DESC`
    );

    res.json({
      success: true,
      data: deliverables
    });

  } catch (error) {
    logger.error('Error fetching pending deliverables:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending deliverables',
      error: error.message
    });
  }
};

/**
 * Get all deliverables (Admin only) - Latest versions only
 * @route GET /api/deliverables/admin/all
 * @access Admin
 */
const getAllDeliverables = async (req, res) => {
  try {
    const deliverables = await executeQuery(
      `SELECT d.*, u.fullname as uploaded_by_name, ppwf.user_id as purchase_user_id, 
              ppwf.package_name, ppwf.user_id as client_user_id,
              client.fullname as client_name, client.email as client_email
       FROM deliverables d 
       LEFT JOIN users u ON d.uploaded_by = u.id 
       LEFT JOIN purchased_package_with_features ppwf ON d.purchase_id = ppwf.id
       LEFT JOIN users client ON ppwf.user_id = client.id
       WHERE d.version_number = (
         SELECT MAX(version_number) 
         FROM deliverables d2 
         WHERE d2.purchase_id = d.purchase_id 
         AND d2.feature_name = d.feature_name
       )
       ORDER BY d.uploaded_at DESC`
    );

    res.json({
      success: true,
      data: deliverables
    });

  } catch (error) {
    logger.error('Error fetching all deliverables:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all deliverables',
      error: error.message
    });
  }
};

/**
 * Get deliverables for client (by purchase ID) - Latest versions only
 * @route GET /api/deliverables/:purchaseId
 * @access Private
 */
const getClientDeliverables = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const userId = req.user.id;

    // Verify purchase belongs to user
    const purchases = await executeQuery(
      'SELECT id FROM purchased_package_with_features WHERE id = ? AND user_id = ?',
      [purchaseId, userId]
    );

    if (purchases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found or access denied'
      });
    }

    const deliverables = await executeQuery(
      `SELECT d.*, u.fullname as uploaded_by_name 
       FROM deliverables d 
       LEFT JOIN users u ON d.uploaded_by = u.id 
       WHERE d.purchase_id = ? 
       AND d.version_number = (
         SELECT MAX(version_number) 
         FROM deliverables d2 
         WHERE d2.purchase_id = d.purchase_id 
         AND d2.feature_name = d.feature_name
       )
       ORDER BY d.feature_name`,
      [purchaseId]
    );

    res.json({
      success: true,
      data: deliverables
    });

  } catch (error) {
    logger.error('Error fetching client deliverables:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deliverables',
      error: error.message
    });
  }
};

/**
 * Get deliverable version history for client
 * @route GET /api/deliverables/:purchaseId/:featureName/history
 * @access Private
 */
const getClientDeliverableHistory = async (req, res) => {
  try {
    const { purchaseId, featureName } = req.params;
    const userId = req.user.id;

    // Verify purchase belongs to user
    const purchases = await executeQuery(
      'SELECT id FROM purchased_package_with_features WHERE id = ? AND user_id = ?',
      [purchaseId, userId]
    );

    if (purchases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found or access denied'
      });
    }

    const deliverables = await executeQuery(
      `SELECT d.*, u.fullname as uploaded_by_name,
              rr.request_reason as client_revision_comment,
              rr.requested_at as revision_requested_at,
              rr.status as revision_request_status
       FROM deliverables d 
       LEFT JOIN users u ON d.uploaded_by = u.id 
       LEFT JOIN revision_requests rr ON d.id = rr.deliverable_id
       WHERE d.purchase_id = ? AND d.feature_name = ?
       ORDER BY d.version_number DESC`,
      [purchaseId, featureName]
    );

    res.json({
      success: true,
      data: deliverables
    });

  } catch (error) {
    logger.error('Error fetching client deliverable history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deliverable history',
      error: error.message
    });
  }
};

module.exports = {
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
};
