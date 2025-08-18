# 📧 Email System Setup & Testing Guide

This guide explains how to set up and test the email functionality in the AltaMedia backend.

## 🏗️ System Overview

The email system is built using **Nodemailer** and provides the following features:

- ✅ **Welcome emails** for new user registration
- ✅ **Password reset emails** with secure tokens
- ✅ **Notification emails** for project updates
- ✅ **Generic email sender** for custom messages
- ✅ **Secure password generation** for new accounts
- ✅ **SMTP configuration testing**

## 📁 File Structure

```
backend/
├── src/
│   ├── utils/
│   │   └── email.js              # Main email utility functions
│   └── routes/
│       └── emailRoutes.js        # Email API endpoints
├── test-email.js                 # Command-line test script
├── test-email-api.html           # Web-based test interface
└── EMAIL_SYSTEM_README.md        # This file
```

## ⚙️ Configuration Setup

### 1. Environment Variables

Add these variables to your `.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
FRONTEND_URL=http://localhost:5173
TEST_EMAIL=your-test-email@gmail.com
```

### 2. Gmail App Password Setup

For Gmail, you need to create an **App Password**:

1. Go to your Google Account settings
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Generate a new app password for "Mail"
5. Use this password in `SMTP_PASS` (not your regular Gmail password)

### 3. Alternative SMTP Providers

You can use other SMTP providers by changing the configuration:

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

**Custom SMTP Server:**
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
```

## 🧪 Testing Methods

### Method 1: Command Line Testing

Run the comprehensive test script:

```bash
cd backend
node test-email.js
```

This will test:
- ✅ Email configuration
- ✅ Password generation
- ✅ Generic email sending
- ✅ Welcome email
- ✅ Password reset email
- ✅ Notification email

### Method 2: Web Interface Testing

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Open `test-email-api.html` in your browser
3. Fill in your test email address
4. Test each email function individually

### Method 3: API Testing

Use the REST API endpoints directly:

```bash
# Test configuration
curl -X POST http://localhost:3000/api/email/test-config

# Send test email
curl -X POST http://localhost:3000/api/email/send-test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@gmail.com",
    "subject": "Test Email",
    "message": "Hello from AltaMedia!"
  }'

# Send welcome email
curl -X POST http://localhost:3000/api/email/send-welcome \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new-user@gmail.com",
    "fullname": "John Doe"
  }'
```

## 📧 Available Email Functions

### 1. `sendEmail(to, subject, htmlContent, textContent)`
Generic email sender for custom messages.

```javascript
const result = await sendEmail(
  'user@example.com',
  'Custom Subject',
  '<h1>HTML Content</h1>',
  'Plain text version'
);
```

### 2. `sendWelcomeEmail(email, password, fullname)`
Sends welcome email with generated password.

```javascript
const password = generatePassword();
const result = await sendWelcomeEmail(
  'newuser@example.com',
  password,
  'John Doe'
);
```

### 3. `sendPasswordResetEmail(email, resetToken, fullname)`
Sends password reset email with secure token.

```javascript
const result = await sendPasswordResetEmail(
  'user@example.com',
  'secure-reset-token-123',
  'John Doe'
);
```

### 4. `sendNotificationEmail(email, subject, message, fullname)`
Sends notification emails for project updates.

```javascript
const result = await sendNotificationEmail(
  'user@example.com',
  'Project Update',
  'Your project is ready for review.',
  'John Doe'
);
```

### 5. `generatePassword()`
Generates secure 12-character passwords.

```javascript
const password = generatePassword();
// Returns: "Kj9#mN2$pQ7x"
```

### 6. `testEmailConfiguration()`
Tests SMTP configuration.

```javascript
const result = await testEmailConfiguration();
// Returns: { success: true, message: 'Email configuration is valid' }
```

## 🔗 API Endpoints

| Endpoint | Method | Description | Body Parameters |
|----------|--------|-------------|-----------------|
| `/api/email/test-config` | POST | Test SMTP configuration | None |
| `/api/email/send-test` | POST | Send test email | `to`, `subject`, `message` |
| `/api/email/send-welcome` | POST | Send welcome email | `email`, `fullname` |
| `/api/email/send-reset` | POST | Send password reset | `email`, `resetToken`, `fullname` |
| `/api/email/send-notification` | POST | Send notification | `email`, `subject`, `message`, `fullname` |
| `/api/email/generate-password` | POST | Generate password | None |

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Use App Password, not regular password
   - Enable 2-Factor Authentication on Gmail
   - Check SMTP_USER is correct

2. **"Connection timeout" error**
   - Check internet connection
   - Verify SMTP_HOST and SMTP_PORT
   - Try different port (465 with SSL, 587 with TLS)

3. **"Authentication failed" error**
   - Verify SMTP_USER and SMTP_PASS
   - Check if App Password is generated correctly
   - Ensure 2FA is enabled

4. **"Rate limit exceeded" error**
   - Gmail has daily sending limits
   - Wait and try again later
   - Consider using a different email provider

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
DEBUG=nodemailer:*
```

### Test with Different Provider

If Gmail doesn't work, try:

1. **Mailtrap** (for testing):
   ```env
   SMTP_HOST=sandbox.smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=your_mailtrap_user
   SMTP_PASS=your_mailtrap_pass
   ```

2. **SendGrid**:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your_sendgrid_api_key
   ```

## 🔒 Security Considerations

1. **Never commit `.env` files** to version control
2. **Use App Passwords** instead of regular passwords
3. **Rate limit** email sending to prevent abuse
4. **Validate email addresses** before sending
5. **Log email activities** for monitoring
6. **Use HTTPS** in production for secure communication

## 📊 Monitoring & Logging

The email system logs all activities:

```javascript
// Success logs
console.log('Email sent successfully:', messageId);

// Error logs
console.error('Error sending email:', error);
```

## 🚀 Production Deployment

For production:

1. **Use a reliable SMTP provider** (SendGrid, Mailgun, etc.)
2. **Set up email monitoring** and alerts
3. **Implement email queuing** for high volume
4. **Add email templates** for consistent branding
5. **Set up bounce handling** and unsubscribe functionality

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your SMTP configuration
3. Test with the provided test scripts
4. Check server logs for detailed error messages
5. Ensure your email provider allows SMTP access

---

**Happy emailing! 📧✨**
