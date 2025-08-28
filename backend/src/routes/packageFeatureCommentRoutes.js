const express = require('express');
const router = express.Router();
const { 
  createComment, 
  getCommentsByFeature, 
  getCommentsByUser, 
  getCommentById,
  updateComment, 
  deleteComment, 
  getAllComments,
  deleteCommentAdmin
} = require('../controllers/packageFeatureCommentController');
const { authenticateToken, requireRole } = require('../middleware/auth');

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
 * @route GET /api/package-feature-comments/:id
 * @desc Get a specific comment by ID
 * @access Private
 */
router.get('/:id', authenticateToken, getCommentById);

/**
 * @route PUT /api/package-feature-comments/:id
 * @desc Update a comment
 * @access Private
 */
router.put('/:id', authenticateToken, updateComment);

/**
 * @route DELETE /api/package-feature-comments/:id
 * @desc Delete a comment
 * @access Private
 */
router.delete('/:id', authenticateToken, deleteComment);

/**
 * @route GET /api/package-feature-comments/admin/all
 * @desc Get all comments (Admin)
 * @access Private (Admin)
 */
router.get('/admin/all', authenticateToken, requireRole(['admin']), getAllComments);

/**
 * @route DELETE /api/package-feature-comments/admin/:id
 * @desc Delete comment (Admin)
 * @access Private (Admin)
 */
router.delete('/admin/:id', authenticateToken, requireRole(['admin']), deleteCommentAdmin);

module.exports = router;
