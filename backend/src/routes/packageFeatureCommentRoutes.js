const express = require('express');
const router = express.Router();
const { 
  createComment, 
  getCommentsByFeature, 
  getCommentsByUser, 
  getCommentsByFeatureAndUser,
  updateComment, 
  deleteComment, 
  getCommentById 
} = require('../controllers/packageFeatureCommentController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route POST /api/package-feature-comments
 * @desc Create a new package feature comment
 * @access Private
 */
router.post('/', authenticateToken, createComment);

/**
 * @route GET /api/package-feature-comments/feature/:packageFeatureId
 * @desc Get all comments for a specific package feature
 * @access Private
 */
router.get('/feature/:packageFeatureId', authenticateToken, getCommentsByFeature);

/**
 * @route GET /api/package-feature-comments/user/:userId
 * @desc Get all comments by a specific user
 * @access Private
 */
router.get('/user/:userId', authenticateToken, getCommentsByUser);

/**
 * @route GET /api/package-feature-comments/feature/:packageFeatureId/user/:userId
 * @desc Get comments by feature ID and user ID
 * @access Private
 */
router.get('/feature/:packageFeatureId/user/:userId', authenticateToken, getCommentsByFeatureAndUser);

/**
 * @route GET /api/package-feature-comments/:commentId
 * @desc Get a specific comment by ID
 * @access Private
 */
router.get('/:commentId', authenticateToken, getCommentById);

/**
 * @route PUT /api/package-feature-comments/:commentId
 * @desc Update a comment
 * @access Private
 */
router.put('/:commentId', authenticateToken, updateComment);

/**
 * @route DELETE /api/package-feature-comments/:commentId
 * @desc Delete a comment
 * @access Private
 */
router.delete('/:commentId', authenticateToken, deleteComment);

module.exports = router;
