const express = require('express');
const router = express.Router();
const { 
  sendVerificationCode, 
  verifyCode, 
  checkVerificationStatus 
} = require('../controllers/emailVerificationController');

/**
 * @route   POST /api/email-verification/send-code
 * @desc    Send email verification code
 * @access  Public
 */
router.post('/send-code', sendVerificationCode);

/**
 * @route   POST /api/email-verification/verify-code
 * @desc    Verify email verification code
 * @access  Public
 */
router.post('/verify-code', verifyCode);

/**
 * @route   GET /api/email-verification/check/:email
 * @desc    Check email verification status
 * @access  Public
 */
router.get('/check/:email', checkVerificationStatus);

module.exports = router;
