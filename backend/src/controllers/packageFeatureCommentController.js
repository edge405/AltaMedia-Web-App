const { executeQuery } = require('../config/mysql');
const logger = require('../utils/logger');

/**
 * Create a new package feature comment
 * @route POST /api/package-feature-comments
 * @access Private
 */
const createComment = async (req, res) => {
  try {
    console.log('📥 Received create comment request:', req.body);
    const { package_feature_id, user_id, comment_text } = req.body;

    if (!package_feature_id || !user_id || !comment_text) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: package_feature_id, user_id, comment_text',
        received: { package_feature_id, user_id, comment_text: !!comment_text }
      });
    }

    logger.info(`Creating package feature comment for user ${user_id}, feature ${package_feature_id}`);

    const result = await executeQuery(`
      INSERT INTO package_feature_comments (package_feature_id, user_id, comment_text, created_at, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [package_feature_id, user_id, comment_text]);

    const commentId = result.insertId;

    // Get the created comment
    const comments = await executeQuery(`
      SELECT * FROM package_feature_comments WHERE id = ?
    `, [commentId]);

    const data = comments[0];

    logger.info(`Successfully created package feature comment ${data.id}`);

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: {
        id: data.id,
        package_feature_id: data.package_feature_id,
        user_id: data.user_id,
        comment_text: data.comment_text,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    });

  } catch (error) {
    console.error('❌ Unexpected error in createComment:', error);
    logger.error('Unexpected error in createComment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all comments for a specific package feature
 * @route GET /api/package-feature-comments/feature/:packageFeatureId
 * @access Private
 */
const getCommentsByFeature = async (req, res) => {
  try {
    const { packageFeatureId } = req.params;

    if (!packageFeatureId) {
      return res.status(400).json({
        success: false,
        message: 'Package feature ID is required'
      });
    }

    logger.info(`Fetching comments for package feature ${packageFeatureId}`);

    const comments = await executeQuery(`
      SELECT pfc.*, u.fullname, u.email, pf.feature_name, pf.feature_description
      FROM package_feature_comments pfc
      INNER JOIN users u ON pfc.user_id = u.id
      INNER JOIN package_features pf ON pfc.package_feature_id = pf.id
      WHERE pfc.package_feature_id = ?
      ORDER BY pfc.created_at DESC
    `, [packageFeatureId]);

    res.json({
      success: true,
      message: 'Comments retrieved successfully',
      data: {
        package_feature_id: packageFeatureId,
        total_comments: comments.length,
        comments: comments
      }
    });

  } catch (error) {
    console.error('❌ Error in getCommentsByFeature:', error);
    logger.error('Error in getCommentsByFeature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve comments',
      error: error.message
    });
  }
};

/**
 * Get all comments for a specific user
 * @route GET /api/package-feature-comments/user/:userId
 * @access Private
 */
const getCommentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    logger.info(`Fetching comments for user ${userId}`);

    const comments = await executeQuery(`
      SELECT pfc.*, pf.feature_name, pf.feature_description, p.name as package_name
      FROM package_feature_comments pfc
      INNER JOIN package_features pf ON pfc.package_feature_id = pf.id
      INNER JOIN packages p ON pf.package_id = p.id
      WHERE pfc.user_id = ?
      ORDER BY pfc.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      message: 'User comments retrieved successfully',
      data: {
        user_id: userId,
        total_comments: comments.length,
        comments: comments
      }
    });

  } catch (error) {
    console.error('❌ Error in getCommentsByUser:', error);
    logger.error('Error in getCommentsByUser:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user comments',
      error: error.message
    });
  }
};

/**
 * Get comment by ID
 * @route GET /api/package-feature-comments/:id
 * @access Private
 */
const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Comment ID is required'
      });
    }

    logger.info(`Fetching comment ${id}`);

    const comments = await executeQuery(`
      SELECT pfc.*, u.fullname, u.email, pf.feature_name, pf.feature_description, p.name as package_name
      FROM package_feature_comments pfc
      INNER JOIN users u ON pfc.user_id = u.id
      INNER JOIN package_features pf ON pfc.package_feature_id = pf.id
      INNER JOIN packages p ON pf.package_id = p.id
      WHERE pfc.id = ?
    `, [id]);

    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const comment = comments[0];

    res.json({
      success: true,
      message: 'Comment retrieved successfully',
      data: comment
    });

  } catch (error) {
    console.error('❌ Error in getCommentById:', error);
    logger.error('Error in getCommentById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve comment',
      error: error.message
    });
  }
};

/**
 * Update comment
 * @route PUT /api/package-feature-comments/:id
 * @access Private
 */
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment_text } = req.body;
    const userId = req.user.id;

    if (!comment_text) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    logger.info(`Updating comment ${id} for user ${userId}`);

    // Check if comment exists and belongs to user
    const existingComments = await executeQuery(`
      SELECT * FROM package_feature_comments WHERE id = ? AND user_id = ?
    `, [id, userId]);

    if (existingComments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or access denied'
      });
    }

    // Update the comment
    await executeQuery(`
      UPDATE package_feature_comments 
      SET comment_text = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [comment_text, id]);

    // Get the updated comment
    const updatedComments = await executeQuery(`
      SELECT * FROM package_feature_comments WHERE id = ?
    `, [id]);

    const updatedComment = updatedComments[0];

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment
    });

  } catch (error) {
    console.error('❌ Error in updateComment:', error);
    logger.error('Error in updateComment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update comment',
      error: error.message
    });
  }
};

/**
 * Delete comment
 * @route DELETE /api/package-feature-comments/:id
 * @access Private
 */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    logger.info(`Deleting comment ${id} for user ${userId}`);

    // Check if comment exists and belongs to user
    const existingComments = await executeQuery(`
      SELECT * FROM package_feature_comments WHERE id = ? AND user_id = ?
    `, [id, userId]);

    if (existingComments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or access denied'
      });
    }

    // Delete the comment
    const result = await executeQuery(`
      DELETE FROM package_feature_comments WHERE id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error in deleteComment:', error);
    logger.error('Error in deleteComment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message
    });
  }
};

/**
 * Get all comments (Admin)
 * @route GET /api/package-feature-comments/admin/all
 * @access Private (Admin)
 */
const getAllComments = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const comments = await executeQuery(`
      SELECT pfc.*, u.fullname, u.email, pf.feature_name, pf.feature_description, p.name as package_name
      FROM package_feature_comments pfc
      INNER JOIN users u ON pfc.user_id = u.id
      INNER JOIN package_features pf ON pfc.package_feature_id = pf.id
      INNER JOIN packages p ON pf.package_id = p.id
      ORDER BY pfc.created_at DESC
    `);

    res.json({
      success: true,
      message: 'All comments retrieved successfully',
      data: {
        total_comments: comments.length,
        comments: comments
      }
    });

  } catch (error) {
    console.error('❌ Error in getAllComments:', error);
    logger.error('Error in getAllComments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve comments',
      error: error.message
    });
  }
};

/**
 * Delete comment (Admin)
 * @route DELETE /api/package-feature-comments/admin/:id
 * @access Private (Admin)
 */
const deleteCommentAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    logger.info(`Admin deleting comment ${id}`);

    // Check if comment exists
    const existingComments = await executeQuery(`
      SELECT * FROM package_feature_comments WHERE id = ?
    `, [id]);

    if (existingComments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Delete the comment
    const result = await executeQuery(`
      DELETE FROM package_feature_comments WHERE id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Comment deleted successfully by admin'
    });

  } catch (error) {
    console.error('❌ Error in deleteCommentAdmin:', error);
    logger.error('Error in deleteCommentAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message
    });
  }
};

module.exports = {
  createComment,
  getCommentsByFeature,
  getCommentsByUser,
  getCommentById,
  updateComment,
  deleteComment,
  getAllComments,
  deleteCommentAdmin
};
