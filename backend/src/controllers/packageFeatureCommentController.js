const { supabase } = require('../config/supabase');
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

    const { data, error } = await supabase
      .from('package_feature_comments')
      .insert({
        package_feature_id,
        user_id,
        comment_text,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating package feature comment:', error);
      logger.error('Error creating package feature comment:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create comment',
        error: error.message
      });
    }

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

    const { data: comments, error } = await supabase
      .from('package_feature_comments')
      .select(`
        *,
        users!inner(fullname, email),
        package_features!inner(feature_name, feature_description)
      `)
      .eq('package_feature_id', packageFeatureId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching package feature comments:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch comments',
        error: error.message
      });
    }

    logger.info(`Successfully fetched ${comments.length} comments for package feature ${packageFeatureId}`);

    res.json({
      success: true,
      message: 'Comments retrieved successfully',
      data: {
        comments: comments,
        total: comments.length,
        package_feature_id: packageFeatureId
      }
    });

  } catch (error) {
    logger.error('Unexpected error in getCommentsByFeature:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all comments by a specific user
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

    const { data: comments, error } = await supabase
      .from('package_feature_comments')
      .select(`
        *,
        package_features!inner(
          feature_name, 
          feature_description, 
          package_id,
          packages!inner(name, description)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching user comments:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user comments',
        error: error.message
      });
    }

    logger.info(`Successfully fetched ${comments.length} comments for user ${userId}`);

    res.json({
      success: true,
      message: 'User comments retrieved successfully',
      data: {
        comments: comments,
        total: comments.length,
        user_id: userId
      }
    });

  } catch (error) {
    logger.error('Unexpected error in getCommentsByUser:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update a comment
 * @route PUT /api/package-feature-comments/:commentId
 * @access Private
 */
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment_text } = req.body;

    if (!commentId || !comment_text) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: commentId, comment_text',
        received: { commentId, comment_text: !!comment_text }
      });
    }

    logger.info(`Updating comment ${commentId}`);

    const { data, error } = await supabase
      .from('package_feature_comments')
      .update({
        comment_text,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      logger.error('Error updating comment:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update comment',
        error: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    logger.info(`Successfully updated comment ${commentId}`);

    res.json({
      success: true,
      message: 'Comment updated successfully',
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
    logger.error('Unexpected error in updateComment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete a comment
 * @route DELETE /api/package-feature-comments/:commentId
 * @access Private
 */
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: 'Comment ID is required'
      });
    }

    logger.info(`Deleting comment ${commentId}`);

    const { error } = await supabase
      .from('package_feature_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      logger.error('Error deleting comment:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete comment',
        error: error.message
      });
    }

    logger.info(`Successfully deleted comment ${commentId}`);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    logger.error('Unexpected error in deleteComment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get a specific comment by ID
 * @route GET /api/package-feature-comments/:commentId
 * @access Private
 */
const getCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: 'Comment ID is required'
      });
    }

    logger.info(`Fetching comment ${commentId}`);

    const { data: comment, error } = await supabase
      .from('package_feature_comments')
      .select(`
        *,
        users!inner(fullname, email),
        package_features!inner(
          feature_name, 
          feature_description, 
          package_id,
          packages!inner(name, description)
        )
      `)
      .eq('id', commentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }
      logger.error('Error fetching comment:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch comment',
        error: error.message
      });
    }

    logger.info(`Successfully fetched comment ${commentId}`);

    res.json({
      success: true,
      message: 'Comment retrieved successfully',
      data: comment
    });

  } catch (error) {
    logger.error('Unexpected error in getCommentById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get comments by feature ID and user ID
 * @route GET /api/package-feature-comments/feature/:packageFeatureId/user/:userId
 * @access Private
 */
const getCommentsByFeatureAndUser = async (req, res) => {
  try {
    const { packageFeatureId, userId } = req.params;

    if (!packageFeatureId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Package feature ID and User ID are required'
      });
    }

    logger.info(`Fetching comments for package feature ${packageFeatureId} by user ${userId}`);

    const { data: comments, error } = await supabase
      .from('package_feature_comments')
      .select(`
        *,
        users!inner(fullname, email),
        package_features!inner(
          feature_name, 
          feature_description, 
          package_id,
          packages!inner(name, description)
        )
      `)
      .eq('package_feature_id', packageFeatureId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching comments by feature and user:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch comments',
        error: error.message
      });
    }

    logger.info(`Successfully fetched ${comments.length} comments for package feature ${packageFeatureId} by user ${userId}`);

    res.json({
      success: true,
      message: 'Comments retrieved successfully',
      data: {
        comments: comments,
        total: comments.length,
        package_feature_id: packageFeatureId,
        user_id: userId
      }
    });

  } catch (error) {
    logger.error('Unexpected error in getCommentsByFeatureAndUser:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createComment,
  getCommentsByFeature,
  getCommentsByUser,
  getCommentsByFeatureAndUser,
  updateComment,
  deleteComment,
  getCommentById
};
