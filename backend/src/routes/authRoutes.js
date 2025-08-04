const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, refreshToken, editProfile, editPassword } = require('../controllers/authController');
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
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', refreshToken);

/**
 * @route   PUT /api/auth/profile
 * @desc    Edit current user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, editProfile);

/**
 * @route   PUT /api/auth/password
 * @desc    Edit current user password
 * @access  Private
 */
router.put('/password', authenticateToken, editPassword);

module.exports = router;
