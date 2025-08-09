# Auto Registration with Email Documentation

## Overview

The auto-registration feature allows users to create accounts without providing a password. The system automatically generates a secure password and sends it to the user's email address.

## Features

- **Automatic Password Generation**: Creates secure 12-character passwords with mixed case, numbers, and special characters
- **Email Notification**: Sends a professional welcome email with login credentials
- **Secure Storage**: Passwords are hashed using bcrypt before storage
- **Error Handling**: Graceful handling of email failures without breaking registration

## API Endpoint

### POST /api/auth/register-auto

**Description**: Register a new user with auto-generated password and email notification

**Request Body**:
```json
{
  "email": "user@example.com",
  "fullname": "John Doe",
  "phone_number": "+1234567890",
  "address": "123 Main Street, City, State 12345"
}
```

**Required Fields**:
- `email` (string) - User's email address

**Optional Fields**:
- `fullname` (string) - User's full name
- `phone_number` (string) - User's phone number
- `address` (string) - User's address

**Response**:
```json
{
  "success": true,
  "message": "Registration successful. Check your email for login credentials.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullname": "John Doe",
      "phone_number": "+1234567890",
      "address": "123 Main Street, City, State 12345",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here",
    "emailSent": true
  }
}
```

## Email Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use the generated password as `SMTP_PASS`

### Other Email Providers

You can use any SMTP provider by updating the configuration:

```env
# For Outlook/Hotmail
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587

# For Yahoo
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587

# For custom SMTP server
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
```

## Password Generation

The system generates secure passwords with the following characteristics:

- **Length**: 12 characters
- **Character Types**:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special characters (!@#$%^&*)
- **Security**: At least one character from each category
- **Randomization**: Fully shuffled for maximum entropy

## Email Template

The welcome email includes:

- Professional HTML formatting
- User's name and email
- Generated password
- Security reminder to change password
- Login link to the application
- Company branding

## Error Handling

### Email Failures

If email sending fails:
- User account is still created successfully
- Warning is logged to console
- Response includes `emailSent: false`
- User can still log in with the generated password

### Common Issues

1. **SMTP Authentication Failed**
   - Check SMTP_USER and SMTP_PASS
   - Verify app password is correct
   - Ensure 2FA is enabled for Gmail

2. **Connection Timeout**
   - Check SMTP_HOST and SMTP_PORT
   - Verify network connectivity
   - Try different SMTP providers

3. **Email Not Received**
   - Check spam/junk folder
   - Verify email address is correct
   - Check SMTP configuration

## Testing

### Using the Test Script

```bash
# Run the test script
node test-auto-registration.js
```

### Using curl

```bash
curl -X POST http://localhost:3000/api/auth/register-auto \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullname": "Test User",
    "phone_number": "+1234567890",
    "address": "123 Test Street"
  }'
```

### Using Postman

1. Create a new POST request
2. URL: `http://localhost:3000/api/auth/register-auto`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "test@example.com",
  "fullname": "Test User",
  "phone_number": "+1234567890",
  "address": "123 Test Street"
}
```

## Security Considerations

1. **Password Security**: Generated passwords are cryptographically secure
2. **Email Security**: Use app passwords, not regular passwords
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Email Verification**: Consider adding email verification step

## Implementation Details

### Files Modified

1. **`src/controllers/authController.js`**
   - Added `registerAuto` function
   - Imported email utilities

2. **`src/routes/authRoutes.js`**
   - Added `/register-auto` route

3. **`src/utils/email.js`** (new file)
   - Email sending functionality
   - Password generation
   - SMTP configuration

4. **`env.example`**
   - Added email configuration variables

### Dependencies

- `nodemailer`: For email functionality
- `bcryptjs`: For password hashing (already included)
- `jsonwebtoken`: For JWT tokens (already included)

## Future Enhancements

1. **Email Templates**: Customizable email templates
2. **Password Policies**: Configurable password requirements
3. **Email Verification**: Optional email verification step
4. **Multiple Languages**: Internationalized email templates
5. **Email Queue**: Background email processing
6. **Analytics**: Track email delivery and open rates
