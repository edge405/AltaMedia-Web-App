const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, updateProfile, changePassword, verifyToken } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { loginValidation, registerValidation } = require('../middleware/validation');

/**
 * @route   POST /api/auth/register
 * @desc    User registration
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    User login
 * @access  Public
 */
router.post('/login', loginValidation, login);

/**
 * @route   POST /api/auth/logout
 * @desc    User logout
 * @access  Private
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify JWT token
 * @access  Private
 */
router.get('/verify', authenticateToken, verifyToken);

/**
 * @route   PUT /api/auth/profile
 * @desc    Edit current user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, updateProfile);

/**
 * @route   PUT /api/auth/password
 * @desc    Edit current user password
 * @access  Private
 */
router.put('/password', authenticateToken, changePassword);

module.exports = router;
