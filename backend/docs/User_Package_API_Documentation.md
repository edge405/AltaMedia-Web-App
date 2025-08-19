# User Package API Documentation

## Create User with Package

Creates a new user account with a package purchase, generates a secure password, and sends a welcome email.

### Endpoint

```
POST /api/user-package/create-user-with-package
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User's email address (must be unique) |
| `fullname` | string | Yes | User's full name (minimum 2 characters) |
| `phone_number` | string | Yes | User's phone number (minimum 10 characters) |
| `package_name` | string | Yes | Name of the package being purchased |
| `expiration_date` | string | Yes | Package expiration date (YYYY-MM-DD format) |
| `total_amount` | number | Yes | Total amount paid for the package |
| `features` | array | No | Array of feature objects (optional) |

### Features Array Structure

Each feature object in the `features` array can contain:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `feature_id` | string | No | Auto-generated | Unique identifier for the feature |
| `feature_name` | string | No | "Feature {index}" | Name of the feature |
| `status` | string | No | "pending" | Feature status (pending, active, completed, etc.) |
| `progress` | number | No | 0 | Progress percentage (0-100) |
| `description` | string | No | "" | Feature description |

### Example Request

```json
{
  "email": "john.doe@example.com",
  "fullname": "John Doe",
  "phone_number": "1234567890",
  "package_name": "Premium Brand Kit",
  "expiration_date": "2024-12-31",
  "total_amount": 299.99,
  "features": [
    {
      "feature_name": "Logo Design",
      "description": "Custom logo creation",
      "status": "pending",
      "progress": 0
    },
    {
      "feature_name": "Brand Guidelines",
      "description": "Complete brand style guide",
      "status": "pending",
      "progress": 0
    }
  ]
}
```

### Response

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "User and package created successfully",
  "data": {
    "user_id": 123,
    "purchased_package_with_features_id": 456,
    "user": {
      "id": 123,
      "email": "john.doe@example.com",
      "fullname": "John Doe",
      "phone_number": "1234567890",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "package": {
      "id": 456,
      "package_name": "Premium Brand Kit",
      "expiration_date": "2024-12-31",
      "total_amount": 299.99,
      "status": "active",
      "purchase_date": "2024-01-15T10:30:00Z",
      "features": [
        {
          "feature_id": "feature_1705312200000_0",
          "feature_name": "Logo Design",
          "status": "pending",
          "progress": 0,
          "description": "Custom logo creation"
        },
        {
          "feature_id": "feature_1705312200000_1",
          "feature_name": "Brand Guidelines",
          "status": "pending",
          "progress": 0,
          "description": "Complete brand style guide"
        }
      ]
    },
    "email_sent": true
  }
}
```

#### Error Responses

**400 Bad Request - Missing Required Fields**
```json
{
  "success": false,
  "message": "Missing required fields: email, fullname, phone_number, package_name, expiration_date, total_amount"
}
```

**400 Bad Request - Invalid Email Format**
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

**400 Bad Request - User Already Exists**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**400 Bad Request - Validation Error**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Please provide a valid email address",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

### Features

1. **Secure Password Generation**: Automatically generates a cryptographically secure random password
2. **Password Hashing**: Uses bcrypt with salt rounds of 10 for secure password storage
3. **Email Notification**: Sends a comprehensive welcome email with:
   - Login credentials (email and generated password)
   - Package details (name, amount, expiration date)
   - Feature list with status and progress
   - Login link to https://altamedia-web-app.onrender.com
4. **Transaction Safety**: Implements rollback mechanism - if package creation fails, the user is automatically deleted
5. **Input Validation**: Comprehensive validation for all required fields
6. **Feature Processing**: Automatically assigns unique IDs and default values to features
7. **Error Handling**: Graceful error handling with detailed error messages

### Database Operations

1. **User Creation**: Inserts new user into `users` table with hashed password
2. **Package Purchase**: Inserts package purchase into `purchased_package_with_features` table
3. **Rollback**: If package creation fails, automatically deletes the created user

### Email Template

The welcome email includes:
- Professional HTML formatting
- User's login credentials
- Package details section
- Features list (if provided)
- Security reminder about password change
- Direct login link
- AltaMedia branding

### Security Considerations

- Passwords are hashed using bcrypt with 10 salt rounds
- Email addresses are validated and normalized
- All inputs are validated and sanitized
- Database operations include proper error handling
- Rollback mechanism prevents orphaned user records

### Usage Notes

- The generated password is only sent via email and not stored in plain text
- Users should be advised to change their password after first login
- The API is designed to be idempotent - duplicate requests with the same email will fail
- Feature IDs are auto-generated if not provided
- All dates should be in ISO 8601 format (YYYY-MM-DD)
