const { executeQuery } = require('../config/mysql');
const logger = require('../utils/logger');

/**
 * Create client request (Client)
 * @route POST /api/client-requests
 * @access Private
 */
const createClientRequest = async (req, res) => {
  try {
    const { subject, message, category, priority } = req.body;
    const userId = req.user.id;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    // Validate category
    const validCategories = ['general', 'technical', 'billing', 'feature_request', 'bug_report', 'other'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority'
      });
    }

    // Create client request
    const insertResult = await executeQuery(
      `INSERT INTO client_requests 
       (user_id, subject, message, category, priority, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [userId, subject, message, category || 'general', priority || 'medium']
    );

    const requestId = insertResult.insertId;

    logger.info(`Client request created: ID ${requestId}, User ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully',
      data: {
        id: requestId,
        subject,
        message,
        category: category || 'general',
        priority: priority || 'medium',
        status: 'pending',
        createdAt: new Date()
      }
    });

  } catch (error) {
    logger.error('Error creating client request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get client requests for current user (Client)
 * @route GET /api/client-requests
 * @access Private
 */
const getClientRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, category, page = 1, limit = 10 } = req.query;

    let whereClause = 'WHERE cr.user_id = ?';
    const params = [userId];

    if (status) {
      whereClause += ' AND cr.status = ?';
      params.push(status);
    }

    if (category) {
      whereClause += ' AND cr.category = ?';
      params.push(category);
    }

    const offset = (page - 1) * limit;

    // Get requests with user info
    const requests = await executeQuery(
      `SELECT cr.*, u.fullname, u.email 
       FROM client_requests cr 
       LEFT JOIN users u ON cr.user_id = u.id 
       ${whereClause} 
       ORDER BY cr.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total 
       FROM client_requests cr 
       ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    res.json({
      success: true,
      data: requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Error getting client requests:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get client request by ID (Client)
 * @route GET /api/client-requests/:id
 * @access Private
 */
const getClientRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const requests = await executeQuery(
      `SELECT cr.*, u.fullname, u.email 
       FROM client_requests cr 
       LEFT JOIN users u ON cr.user_id = u.id 
       WHERE cr.id = ? AND cr.user_id = ?`,
      [id, userId]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      data: requests[0]
    });

  } catch (error) {
    logger.error('Error getting client request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get all client requests (Admin)
 * @route GET /api/admin/client-requests
 * @access Admin
 */
const getAllClientRequests = async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (status) {
      whereClause += ' AND cr.status = ?';
      params.push(status);
    }

    if (category) {
      whereClause += ' AND cr.category = ?';
      params.push(category);
    }

    if (priority) {
      whereClause += ' AND cr.priority = ?';
      params.push(priority);
    }

    const offset = (page - 1) * limit;

    // Get requests with user info
    const requests = await executeQuery(
      `SELECT cr.*, u.fullname, u.email 
       FROM client_requests cr 
       LEFT JOIN users u ON cr.user_id = u.id 
       ${whereClause} 
       ORDER BY 
         CASE cr.priority 
           WHEN 'urgent' THEN 1 
           WHEN 'high' THEN 2 
           WHEN 'medium' THEN 3 
           WHEN 'low' THEN 4 
         END,
         cr.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total 
       FROM client_requests cr 
       ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    res.json({
      success: true,
      data: requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Error getting all client requests:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update client request status and response (Admin)
 * @route PUT /api/admin/client-requests/:id
 * @access Admin
 */
const updateClientRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_response } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Check if request exists
    const existingRequests = await executeQuery(
      'SELECT id FROM client_requests WHERE id = ?',
      [id]
    );

    if (existingRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Update request
    const updateFields = ['status = ?'];
    const params = [status];

    if (admin_response !== undefined) {
      updateFields.push('admin_response = ?');
      params.push(admin_response);
    }

    if (status === 'resolved' || status === 'closed') {
      updateFields.push('resolved_at = CURRENT_TIMESTAMP');
    }

    params.push(id);

    await executeQuery(
      `UPDATE client_requests 
       SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      params
    );

    logger.info(`Client request updated: ID ${id}, Status ${status}`);

    res.json({
      success: true,
      message: 'Request updated successfully'
    });

  } catch (error) {
    logger.error('Error updating client request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get client request by ID (Admin)
 * @route GET /api/admin/client-requests/:id
 * @access Admin
 */
const getClientRequestAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const requests = await executeQuery(
      `SELECT cr.*, u.fullname, u.email 
       FROM client_requests cr 
       LEFT JOIN users u ON cr.user_id = u.id 
       WHERE cr.id = ?`,
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      data: requests[0]
    });

  } catch (error) {
    logger.error('Error getting client request (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createClientRequest,
  getClientRequests,
  getClientRequest,
  getAllClientRequests,
  updateClientRequest,
  getClientRequestAdmin
};
