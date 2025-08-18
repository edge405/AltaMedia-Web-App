const express = require('express');
const router = express.Router();
const { 
  sendEmail, 
  sendWelcomeEmail, 
  sendPasswordResetEmail, 
  sendNotificationEmail, 
  generatePassword, 
  testEmailConfiguration 
} = require('../utils/email.js');

/**
 * @route   POST /api/email/test-config
 * @desc    Test email configuration
 * @access  Public
 */
router.post('/test-config', async (req, res) => {
  try {
    const result = await testEmailConfiguration();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/email/send-test
 * @desc    Send a test email
 * @access  Public
 */
router.post('/send-test', async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, message'
      });
    }
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Test Email</h1>
        <p>${message}</p>
        <p>Time sent: ${new Date().toLocaleString()}</p>
        <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>Recipient: ${to}</li>
            <li>Subject: ${subject}</li>
            <li>Sent via API endpoint</li>
          </ul>
        </div>
      </div>
    `;
    
    const result = await sendEmail(to, subject, htmlContent);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/email/send-welcome
 * @desc    Send welcome email
 * @access  Public
 */
router.post('/send-welcome', async (req, res) => {
  try {
    const { email, fullname } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }
    
    const password = generatePassword();
    const result = await sendWelcomeEmail(email, password, fullname);
    
    res.json({
      ...result,
      password: password // Only for testing - remove in production
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/email/send-reset
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/send-reset', async (req, res) => {
  try {
    const { email, resetToken, fullname } = req.body;
    
    if (!email || !resetToken) {
      return res.status(400).json({
        success: false,
        error: 'Email and resetToken are required'
      });
    }
    
    const result = await sendPasswordResetEmail(email, resetToken, fullname);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/email/send-notification
 * @desc    Send notification email
 * @access  Public
 */
router.post('/send-notification', async (req, res) => {
  try {
    const { email, subject, message, fullname } = req.body;
    
    if (!email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Email, subject, and message are required'
      });
    }
    
    const result = await sendNotificationEmail(email, subject, message, fullname);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/email/generate-password
 * @desc    Generate a secure password
 * @access  Public
 */
router.post('/generate-password', (req, res) => {
  try {
    const password = generatePassword();
    res.json({
      success: true,
      password: password
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
