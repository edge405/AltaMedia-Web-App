const { executeQuery } = require('../config/mysql');
const { sendEmailVerificationCode } = require('../utils/email');
const crypto = require('crypto');

/**
 * Send email verification code
 * POST /api/email-verification/send-code
 */
const sendVerificationCode = async (req, res) => {
  try {
    const { email, businessName } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create a unique token for this verification
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Store verification code in database with expiration (10 minutes)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

    
    await executeQuery(
      `INSERT INTO email_verifications (email, verification_code, verification_token, expires_at, created_at) 
       VALUES (?, ?, ?, ?, NOW()) 
       ON DUPLICATE KEY UPDATE 
       verification_code = VALUES(verification_code), 
       verification_token = VALUES(verification_token), 
       expires_at = VALUES(expires_at), 
       created_at = NOW()`,
      [email, verificationCode, verificationToken, expiresAt]
    );

    // Send verification email
    const emailResult = await sendEmailVerificationCode(email, verificationCode, businessName);
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'Verification code sent successfully',
      data: {
        email: email,
        expiresAt: expiresAt
      }
    });

  } catch (error) {
    console.error('Send verification code error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Verify email verification code
 * POST /api/email-verification/verify-code
 */
const verifyCode = async (req, res) => {
  try {
    console.log('🔍 Verify code request body:', req.body);
    const { email, verificationCode } = req.body;

    // Validate inputs
    console.log('🔍 Email:', email, 'VerificationCode:', verificationCode);
    if (!email || !verificationCode) {
      console.log('❌ Missing email or verification code');
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }

    // Check if verification code exists and is valid
    console.log('🔍 Checking verification code for email:', email, 'code:', verificationCode);
    
    // Check current time in database
    const timeCheck = await executeQuery('SELECT NOW() as db_time');
    console.log('🔍 Database current time:', timeCheck[0].db_time);
    
    const verifications = await executeQuery(
      `SELECT id, email, verification_code, expires_at, is_verified 
       FROM email_verifications 
       WHERE email = ? AND verification_code = ? AND expires_at > NOW()`,
      [email, verificationCode]
    );
    console.log('🔍 Query result:', verifications);

    if (verifications.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    const verification = verifications[0];

    // Mark email as verified
    await executeQuery(
      'UPDATE email_verifications SET is_verified = 1, verified_at = NOW() WHERE id = ?',
      [verification.id]
    );

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        email: email,
        verifiedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Check if email is verified
 * GET /api/email-verification/check/:email
 */
const checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check verification status
    const verifications = await executeQuery(
      'SELECT is_verified, verified_at FROM email_verifications WHERE email = ? ORDER BY created_at DESC LIMIT 1',
      [email]
    );

    if (verifications.length === 0) {
      return res.json({
        success: true,
        data: {
          email: email,
          isVerified: false
        }
      });
    }

    const verification = verifications[0];

    res.json({
      success: true,
      data: {
        email: email,
        isVerified: verification.is_verified === 1,
        verifiedAt: verification.verified_at
      }
    });

  } catch (error) {
    console.error('Check verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  sendVerificationCode,
  verifyCode,
  checkVerificationStatus
};
