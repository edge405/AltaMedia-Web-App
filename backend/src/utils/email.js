const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Generic email sender function
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @param {string} textContent - Plain text content (optional)
 */
const sendEmail = async (to, subject, htmlContent, textContent = '') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: to,
      subject: subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email with generated password
 * @param {string} email - User's email address
 * @param {string} password - Generated password
 * @param {string} fullname - User's full name
 * @param {Object} purchasedPackage - Purchased package details
 * @param {Array} features - Package features array
 */
const sendWelcomeEmail = async (email, password, fullname, purchasedPackage, features = []) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: #333; margin: 0; text-align: center;">Welcome to AltaMedia!</h1>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #495057; margin-top: 0;">Hello ${fullname || 'there'}!</h2>
        
        <p style="color: #6c757d; line-height: 1.6;">
          Your account has been successfully created. Here are your login credentials:
        </p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
        </div>
        
        ${purchasedPackage ? `
        <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0;">
          <h3 style="color: #155724; margin-top: 0;">Your Package Details:</h3>
          <div style="color: #155724;">
            <p style="margin: 8px 0;"><strong>Package Name:</strong> ${purchasedPackage.package_name}</p>
            <p style="margin: 8px 0;"><strong>Total Amount:</strong> ₱${purchasedPackage.total_amount}</p>
            <p style="margin: 8px 0;"><strong>Purchase Date:</strong> ${new Date(purchasedPackage.purchase_date).toLocaleDateString()}</p>
            <p style="margin: 8px 0;"><strong>Expiration Date:</strong> ${new Date(purchasedPackage.expiration_date).toLocaleDateString()}</p>
          </div>
        </div>
        ` : ''}
        
        ${features.length > 0 ? `
        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; margin: 20px 0;">
          <h3 style="color: #004085; margin-top: 0;">Your Package Features:</h3>
          <ul style="color: #004085; margin: 0; padding-left: 20px;">
            ${features.map(feature => `
              <li style="margin-bottom: 8px;">
                <strong>${feature.feature_name}</strong>
                ${feature.description ? `<br><span style="font-size: 14px; color: #6c757d;">${feature.description}</span>` : ''}
                <br>
              </li>
            `).join('')}
          </ul>
        </div>
        ` : ''}
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">
            <strong>Important:</strong> For security reasons, we recommend changing your password after your first login.
          </p>
        </div>
        
        <p style="color: #6c757d; line-height: 1.6;">
          You can now log in to your account and start using our services. If you have any questions, 
          please don't hesitate to contact our support team.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${`https://builder.altamedia.ai/login`}/login" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Login to Your Account
          </a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>&copy; 2025 AltaMedia. All rights reserved.</p>
      </div>
    </div>
  `;

  return await sendEmail(
    email,
    'Welcome to AltaMedia - Your Account Details',
    htmlContent
  );
};

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @param {string} resetToken - Password reset token
 * @param {string} fullname - User's full name
 */
const sendPasswordResetEmail = async (email, resetToken, fullname) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: #333; margin: 0; text-align: center;">Password Reset Request</h1>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #495057; margin-top: 0;">Hello ${fullname || 'there'}!</h2>
        
        <p style="color: #6c757d; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Your Password
          </a>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">
            <strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request this reset, 
            please ignore this email or contact support immediately.
          </p>
        </div>
        
        <p style="color: #6c757d; line-height: 1.6;">
          If the button doesn't work, you can copy and paste this link into your browser:
        </p>
        <p style="color: #007bff; word-break: break-all;">${resetUrl}</p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>&copy; 2024 AltaMedia. All rights reserved.</p>
      </div>
    </div>
  `;

  return await sendEmail(
    email,
    'AltaMedia - Password Reset Request',
    htmlContent
  );
};

/**
 * Send notification email
 * @param {string} email - Recipient email
 * @param {string} subject - Email subject
 * @param {string} message - Notification message
 * @param {string} fullname - Recipient's name
 */
const sendNotificationEmail = async (email, subject, message, fullname) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: #333; margin: 0; text-align: center;">AltaMedia Notification</h1>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #495057; margin-top: 0;">Hello ${fullname || 'there'}!</h2>
        
        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; margin: 20px 0;">
          <p style="margin: 0; color: #004085; line-height: 1.6;">${message}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>&copy; 2024 AltaMedia. All rights reserved.</p>
      </div>
    </div>
  `;

  return await sendEmail(email, subject, htmlContent);
};

/**
 * Generate a secure random password
 * @returns {string} Generated password
 */
const generatePassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each category
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special character
  
  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Test email configuration
 * @returns {Object} Test result
 */
const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendNotificationEmail,
  generatePassword,
  testEmailConfiguration
};
