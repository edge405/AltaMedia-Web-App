const { executeQuery } = require('../config/mysql');
const logger = require('../utils/logger');

/**
 * Create revision request (Client)
 * @route POST /api/deliverables/:id/request-revision
 * @access Private
 */
const createRevisionRequest = async (req, res) => {
  try {
    const { id: deliverableId } = req.params;
    const { requestReason } = req.body;
    const userId = req.user.id;

    if (!requestReason) {
      return res.status(400).json({
        success: false,
        message: 'Request reason is required'
      });
    }

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

    // Check if deliverable is in a state that allows revision requests
    if (deliverable.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only request revision for pending deliverables'
      });
    }

    // Check if there's already a pending revision request
    const existingRequests = await executeQuery(
      'SELECT id FROM revision_requests WHERE deliverable_id = ? AND status = "pending"',
      [deliverableId]
    );

    if (existingRequests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'A revision request is already pending for this deliverable'
      });
    }

    // Create revision request
    const insertResult = await executeQuery(
      `INSERT INTO revision_requests 
       (deliverable_id, user_id, request_reason, status) 
       VALUES (?, ?, ?, 'pending')`,
      [deliverableId, userId, requestReason]
    );

    // Update deliverable status to revision_requested
    await executeQuery(
      'UPDATE deliverables SET status = "revision_requested", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [deliverableId]
    );

    const revisionRequestId = insertResult.insertId;

    logger.info(`Revision request created: ID ${revisionRequestId}, Deliverable ${deliverableId}`);

    res.status(201).json({
      success: true,
      message: 'Revision request created successfully',
      data: {
        id: revisionRequestId,
        deliverableId,
        requestReason,
        status: 'pending',
        requestedAt: new Date()
      }
    });

  } catch (error) {
    logger.error('Error creating revision request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create revision request',
      error: error.message
    });
  }
};

/**
 * Get revision requests for current user
 * @route GET /api/revision-requests
 * @access Private
 */
const getRevisionRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await executeQuery(
      `SELECT rr.*, d.feature_name, d.file_path, d.deliverable_link, d.status as deliverable_status, d.purchase_id
       FROM revision_requests rr 
       LEFT JOIN deliverables d ON rr.deliverable_id = d.id 
       WHERE rr.user_id = ? 
       ORDER BY rr.requested_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    logger.error('Error fetching revision requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revision requests',
      error: error.message
    });
  }
};

/**
 * Get all revision requests (Admin only)
 * @route GET /api/admin/revision-requests
 * @access Admin
 */
const getAllRevisionRequests = async (req, res) => {
  try {
    const requests = await executeQuery(
      `SELECT rr.*, d.feature_name, d.file_path, d.deliverable_link, d.purchase_id,
              u.fullname as user_name, u.email as user_email,
              latest_d.status as deliverable_status,
              latest_d.version_number,
              latest_d.file_path as latest_file_path,
              latest_d.deliverable_link as latest_deliverable_link,
              version_counts.total_versions
       FROM revision_requests rr 
       LEFT JOIN deliverables d ON rr.deliverable_id = d.id 
       LEFT JOIN users u ON rr.user_id = u.id 
       LEFT JOIN (
         SELECT d1.purchase_id, d1.feature_name, d1.status, d1.version_number, d1.file_path, d1.deliverable_link
         FROM deliverables d1
         INNER JOIN (
           SELECT purchase_id, feature_name, MAX(version_number) as max_version
           FROM deliverables
           GROUP BY purchase_id, feature_name
         ) d2 ON d1.purchase_id = d2.purchase_id 
                AND d1.feature_name = d2.feature_name 
                AND d1.version_number = d2.max_version
       ) latest_d ON d.purchase_id = latest_d.purchase_id 
                  AND d.feature_name = latest_d.feature_name
       LEFT JOIN (
         SELECT purchase_id, feature_name, COUNT(*) as total_versions
         FROM deliverables
         GROUP BY purchase_id, feature_name
       ) version_counts ON d.purchase_id = version_counts.purchase_id 
                       AND d.feature_name = version_counts.feature_name
       ORDER BY rr.requested_at DESC`
    );

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    logger.error('Error fetching all revision requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revision requests',
      error: error.message
    });
  }
};

/**
 * Update revision request status (Admin only)
 * @route PUT /api/admin/revision-requests/:id/status
 * @access Admin
 */
const updateRevisionRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    if (!['pending', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, in_progress, or completed'
      });
    }

    // Build update query
    let updateQuery = 'UPDATE revision_requests SET status = ?, updated_at = CURRENT_TIMESTAMP';
    let queryParams = [status];

    if (adminResponse) {
      updateQuery += ', admin_response = ?';
      queryParams.push(adminResponse);
    }

    updateQuery += ' WHERE id = ?';
    queryParams.push(id);

    const result = await executeQuery(updateQuery, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Revision request not found'
      });
    }

    logger.info(`Revision request status updated: ID ${id}, Status ${status}`);

    res.json({
      success: true,
      message: 'Revision request status updated successfully'
    });

  } catch (error) {
    logger.error('Error updating revision request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update revision request status',
      error: error.message
    });
  }
};

/**
 * Update revision request (Client only)
 * @route PUT /api/revision-requests/:id
 * @access Private
 */
const updateRevisionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { requestReason } = req.body;
    const userId = req.user.id;

    if (!requestReason) {
      return res.status(400).json({
        success: false,
        message: 'Request reason is required'
      });
    }

    // Get the revision request and verify ownership
    const requests = await executeQuery(
      `SELECT rr.*, d.status as deliverable_status 
       FROM revision_requests rr 
       LEFT JOIN deliverables d ON rr.deliverable_id = d.id 
       WHERE rr.id = ?`,
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Revision request not found'
      });
    }

    const request = requests[0];

    // Check if user owns this revision request
    if (request.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only allow editing if request is still pending
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only edit pending revision requests'
      });
    }

    // Update the revision request
    const result = await executeQuery(
      `UPDATE revision_requests 
       SET request_reason = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [requestReason, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Revision request not found'
      });
    }

    logger.info(`Revision request updated: ID ${id}, User ${userId}`);

    res.json({
      success: true,
      message: 'Revision request updated successfully',
      data: {
        id,
        requestReason,
        status: request.status,
        updatedAt: new Date()
      }
    });

  } catch (error) {
    logger.error('Error updating revision request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update revision request',
      error: error.message
    });
  }
};

/**
 * Get revision request by ID
 * @route GET /api/revision-requests/:id
 * @access Private
 */
const getRevisionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const requests = await executeQuery(
      `SELECT rr.*, d.feature_name, d.file_path, d.deliverable_link, d.status as deliverable_status, d.purchase_id,
              u.fullname as user_name, u.email as user_email
       FROM revision_requests rr 
       LEFT JOIN deliverables d ON rr.deliverable_id = d.id 
       LEFT JOIN users u ON rr.user_id = u.id 
       WHERE rr.id = ?`,
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Revision request not found'
      });
    }

    const request = requests[0];

    // Check if user has access to this request
    if (request.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: request
    });

  } catch (error) {
    logger.error('Error fetching revision request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revision request',
      error: error.message
    });
  }
};

module.exports = {
  createRevisionRequest,
  getRevisionRequests,
  getAllRevisionRequests,
  updateRevisionRequestStatus,
  updateRevisionRequest,
  getRevisionRequest
};
