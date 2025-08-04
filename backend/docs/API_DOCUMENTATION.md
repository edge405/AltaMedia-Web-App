# AltaMedia Client Dashboard API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

**Note:** This API uses custom authentication with a local users table. Users are stored in the database with hashed passwords using bcrypt. JWT tokens are used for session management.

---

## 🔐 Authentication Endpoints

### 1. User Registration

**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullname": "John Doe",
  "phone_number": "+1234567890",
  "address": "123 Main St, City, State 12345"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullname": "John Doe",
      "phone_number": "+1234567890",
      "address": "123 Main St, City, State 12345",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**Note:** This endpoint does not include input validation. All fields are accepted as provided. The registration process creates a user in the custom users table with a bcrypt-hashed password.

**Postman Example:**
```
Method: POST
URL: http://localhost:3000/api/auth/register
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 2. User Login

**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullname": "John Doe",
      "phone_number": "+1234567890",
      "address": "123 Main St, City, State 12345",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Note:** This endpoint authenticates users against the custom users table and verifies passwords using bcrypt.

**Postman Example:**
```
Method: POST
URL: http://localhost:3000/api/auth/login
Headers: 
  Content-Type: application/json
Body (raw JSON):
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. User Logout

**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Note:** This endpoint currently returns a success message. Token blacklisting is not implemented in this version.

**Postman Example:**
```
Method: POST
URL: http://localhost:3000/api/auth/logout
Headers: 
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Get User Profile

**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullname": "John Doe",
    "phone_number": "+1234567890",
    "address": "123 Main St, City, State 12345",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Postman Example:**
```
Method: GET
URL: http://localhost:3000/api/auth/profile
Headers: 
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Edit User Profile

**PUT** `/auth/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullname": "John Smith",
  "phone_number": "+1987654321",
  "address": "456 Oak Ave, City, State 54321"
}
```

**Note:** All fields are optional. At least one field must be provided.

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullname": "John Smith",
    "phone_number": "+1987654321",
    "address": "456 Oak Ave, City, State 54321",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "At least one field (fullname, phone_number, or address) must be provided"
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "User not found or update failed"
}
```

**Postman Example:**
```
Method: PUT
URL: http://localhost:3000/api/auth/profile
Headers: 
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
Body (raw JSON):
{
  "fullname": "John Smith",
  "phone_number": "+1987654321",
  "address": "456 Oak Ave, City, State 54321"
}
```

### 6. Edit Password

**PUT** `/auth/password`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Note:** New password must be at least 6 characters long.

**Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Both currentPassword and newPassword are required"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "New password must be at least 6 characters long"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Postman Example:**
```
Method: PUT
URL: http://localhost:3000/api/auth/password
Headers: 
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
Body (raw JSON):
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### 7. Refresh Token

**POST** `/auth/refresh`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** This endpoint validates the current token and issues a new one with extended expiration.

---

## 🔧 Authentication Middleware

The API uses custom authentication middleware that:

1. **Validates JWT tokens** against the custom users table
2. **Temporarily disables role-based access control** (all authenticated users have access)
3. **Uses simplified user data** (id, email only)

**Future Implementation:** Role-based access control will be implemented when roles are added to the database schema.

---

## 🗄️ Database Schema Changes

The API has been updated to align with the custom database schema:

### Users Table
- **ID**: `BIGSERIAL` (auto-incrementing integer)
- **Fields**: `email`, `password` (bcrypt-hashed), `email_verified_at`, `created_at`, `updated_at`

### Package Purchases Table
- **Foreign Keys**: `user_id` (INTEGER), `package_id` (INTEGER)

### Purchased Addons Table
- **Foreign Keys**: `package_purchase_id` (INTEGER), `addon_id` (INTEGER)

---

## 📦 Package Management Endpoints

### 1. Get All Packages

**GET** `/packages`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Basic Package",
      "description": "Essential features for small businesses",
      "price": 99.99,
      "duration_days": 30,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Postman Example:**
```
Method: GET
URL: http://localhost:3000/api/packages
```

### 2. Get Package by ID

**GET** `/packages/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Basic Package",
    "description": "Essential features for small businesses",
    "price": 99.99,
    "duration_days": 30,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "features": [
      {
        "id": 1,
        "package_id": 1,
        "feature_name": "Basic Analytics",
        "feature_description": "Simple analytics dashboard",
        "is_active": true,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

**Postman Example:**
```
Method: GET
URL: http://localhost:3000/api/packages/1
```

### 3. Create Package (Admin Only)

**POST** `/packages`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Premium Package",
  "description": "Advanced features for growing businesses",
  "price": 199.99,
  "duration_days": 30,
  "features": [
    {
      "name": "Advanced Analytics",
      "description": "Comprehensive analytics dashboard"
    },
    {
      "name": "Priority Support",
      "description": "24/7 priority customer support"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Package created successfully",
  "data": {
    "id": 2,
    "name": "Premium Package",
    "description": "Advanced features for growing businesses",
    "price": 199.99,
    "duration_days": 30,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Postman Example:**
```
Method: POST
URL: http://localhost:3000/api/packages
Headers: 
  Authorization: Bearer <admin_token>
  Content-Type: application/json
Body (raw JSON):
{
  "name": "Premium Package",
  "description": "Advanced features for growing businesses",
  "price": 199.99,
  "duration_days": 30,
  "features": [
    {
      "name": "Advanced Analytics",
      "description": "Comprehensive analytics dashboard"
    }
  ]
}
```

### 4. Update Package (Admin Only)

**PUT** `/packages/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Premium Package",
  "description": "Updated description",
  "price": 249.99,
  "duration_days": 30,
  "is_active": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Package updated successfully",
  "data": {
    "id": 2,
    "name": "Updated Premium Package",
    "description": "Updated description",
    "price": 249.99,
    "duration_days": 30,
    "is_active": true,
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Postman Example:**
```
Method: PUT
URL: http://localhost:3000/api/packages/2
Headers: 
  Authorization: Bearer <admin_token>
  Content-Type: application/json
Body (raw JSON):
{
  "name": "Updated Premium Package",
  "description": "Updated description",
  "price": 249.99,
  "duration_days": 30,
  "is_active": true
}
```

### 5. Delete Package (Admin Only)

**DELETE** `/packages/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Package deleted successfully"
}
```

**Postman Example:**
```
Method: DELETE
URL: http://localhost:3000/api/packages/2
Headers: 
  Authorization: Bearer <admin_token>
```

---

## 🎯 Addon Management Endpoints

### 1. Get All Addons

**GET** `/addons`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Priority Support",
      "description": "24/7 priority customer support",
      "price_type": "recurring",
      "base_price": 29.99,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Postman Example:**
```
Method: GET
URL: http://localhost:3000/api/addons
```

### 2. Get Addon by ID

**GET** `/addons/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Priority Support",
    "description": "24/7 priority customer support",
    "price_type": "recurring",
    "base_price": 29.99,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Postman Example:**
```
Method: GET
URL: http://localhost:3000/api/addons/1
```

### 3. Get User Addons

**GET** `/addons/user`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "purchase_date": "2024-01-01T00:00:00.000Z",
      "amount_paid": 29.99,
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z",
      "addon": {
        "id": 1,
        "name": "Priority Support",
        "description": "24/7 priority customer support",
        "price_type": "recurring",
        "base_price": 29.99
      },
      "package_purchase": {
        "id": 1,
        "purchase_date": "2024-01-01T00:00:00.000Z",
        "expiration_date": "2024-02-01",
        "status": "active",
        "package": {
          "id": 1,
          "name": "Basic Package",
          "description": "Essential features for small businesses"
        }
      }
    }
  ]
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Access denied"
}
```

**Postman Example:**
```
Method: GET
URL: http://localhost:3000/api/addons/user
Headers: 
  Authorization: Bearer <user_token>
```

### 4. Create Addon (Admin Only)

**POST** `/addons`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Custom Domain",
  "description": "Use your own domain name",
  "price_type": "one-time",
  "base_price": 49.99
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Addon created successfully",
  "data": {
    "id": 2,
    "name": "Custom Domain",
    "description": "Use your own domain name",
    "price_type": "one-time",
    "base_price": 49.99,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Postman Example:**
```
Method: POST
URL: http://localhost:3000/api/addons
Headers: 
  Authorization: Bearer <admin_token>
  Content-Type: application/json
Body (raw JSON):
{
  "name": "Custom Domain",
  "description": "Use your own domain name",
  "price_type": "one-time",
  "base_price": 49.99
}
```

### 5. Update Addon (Admin Only)

**PUT** `/addons/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Custom Domain",
  "description": "Updated description",
  "price_type": "one-time",
  "base_price": 59.99,
  "is_active": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Addon updated successfully",
  "data": {
    "id": 2,
    "name": "Updated Custom Domain",
    "description": "Updated description",
    "price_type": "one-time",
    "base_price": 59.99,
    "is_active": true,
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Postman Example:**
```
Method: PUT
URL: http://localhost:3000/api/addons/2
Headers: 
  Authorization: Bearer <admin_token>
  Content-Type: application/json
Body (raw JSON):
{
  "name": "Updated Custom Domain",
  "description": "Updated description",
  "price_type": "one-time",
  "base_price": 59.99,
  "is_active": true
}
```

### 6. Delete Addon (Admin Only)

**DELETE** `/addons/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Addon deleted successfully"
}
```

**Postman Example:**
```
Method: DELETE
URL: http://localhost:3000/api/addons/2
Headers: 
  Authorization: Bearer <admin_token>
```

---

## 🛒 Purchase Management Endpoints

### 1. Get User Purchases

**GET** `/purchases`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "package_id": 1,
      "purchase_date": "2024-01-01T00:00:00.000Z",
      "expiration_date": "2024-02-01",
      "status": "active",
      "total_amount": 129.98,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "packages": {
        "id": 1,
        "name": "Basic Package",
        "description": "Essential features for small businesses",
        "price": 99.99,
        "duration_days": 30
      },
      "addons": [
        {
          "id": 1,
          "purchase_date": "2024-01-01T00:00:00.000Z",
          "amount_paid": 29.99,
          "status": "active",
          "created_at": "2024-01-01T00:00:00.000Z",
          "addons": {
            "id": 1,
            "name": "Priority Support",
            "description": "24/7 priority customer support",
            "price_type": "recurring",
            "base_price": 29.99
          }
        }
      ]
    }
  ]
}
```

**Postman Example:**
```
Method: GET
URL: http://localhost:3000/api/purchases
Headers: 
  Authorization: Bearer <user_token>
```

### 2. Get Purchase by ID

**GET** `/purchases/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "package_id": 1,
    "purchase_date": "2024-01-01T00:00:00.000Z",
    "expiration_date": "2024-02-01",
    "status": "active",
    "total_amount": 129.98,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "packages": {
      "id": 1,
      "name": "Basic Package",
      "description": "Essential features for small businesses",
      "price": 99.99,
      "duration_days": 30
    },
    "purchased_addons": [
      {
        "id": 1,
        "package_purchase_id": 1,
        "addon_id": 1,
        "purchase_date": "2024-01-01T00:00:00.000Z",
        "amount_paid": 29.99,
        "status": "active",
        "created_at": "2024-01-01T00:00:00.000Z",
        "addons": {
          "id": 1,
          "name": "Priority Support",
          "description": "24/7 priority customer support",
          "price_type": "recurring",
          "base_price": 29.99
        }
      }
    ]
  }
}
```

**Postman Example:**
```
Method: GET
URL: http://localhost:3000/api/purchases/1
Headers: 
  Authorization: Bearer <user_token>
```

### 3. Create Purchase

**POST** `/purchases`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "package_id": 1,
  "addons": [1, 2]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Purchase created successfully",
  "data": {
    "id": 2,
    "user_id": 1,
    "package_id": 1,
    "purchase_date": "2024-01-01T00:00:00.000Z",
    "expiration_date": "2024-02-01",
    "status": "active",
    "total_amount": 179.97,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Postman Example:**
```
Method: POST
URL: http://localhost:3000/api/purchases
Headers: 
  Authorization: Bearer <user_token>
  Content-Type: application/json
Body (raw JSON):
{
  "package_id": 1,
  "addons": [1, 2]
}
```

### 4. Cancel Purchase

**PUT** `/purchases/:id/cancel`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Purchase cancelled successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "package_id": 1,
    "purchase_date": "2024-01-01T00:00:00.000Z",
    "expiration_date": "2024-02-01",
    "status": "cancelled",
    "total_amount": 129.98,
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Postman Example:**
```
Method: PUT
URL: http://localhost:3000/api/purchases/1/cancel
Headers: 
  Authorization: Bearer <user_token>
```

### 5. Get All Purchases (Admin Only)

**GET** `/purchases/admin/all`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "package_id": 1,
      "purchase_date": "2024-01-01T00:00:00.000Z",
      "expiration_date": "2024-02-01",
      "status": "active",
      "total_amount": 129.98,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "packages": {
        "id": 1,
        "name": "Basic Package",
        "description": "Essential features for small businesses"
      },
      "users": {
        "id": 1,
        "email": "user@example.com"
      },
      "addons": [
        {
          "id": 1,
          "purchase_date": "2024-01-01T00:00:00.000Z",
          "amount_paid": 29.99,
          "status": "active",
          "created_at": "2024-01-01T00:00:00.000Z",
          "addons": {
            "id": 1,
            "name": "Priority Support",
            "description": "24/7 priority customer support",
            "price_type": "recurring",
            "base_price": 29.99
          }
        }
      ]
    }
  ]
}
```

**Postman Example:**
```
Method: GET
URL: http://localhost:3000/api/purchases/admin/all
Headers: 
  Authorization: Bearer <admin_token>
```

---

## 🧪 Testing and Troubleshooting

### Quick Test Script
Use the provided `test-api.js` script to test all endpoints:

```bash
node test-api.js
```

### Common Issues

1. **Registration Fails**: 
   - Check if user already exists
   - Verify database connection
   - Ensure bcrypt is properly hashing passwords

2. **Login Fails**:
   - Verify email exists in users table
   - Check password hashing/verification
   - Ensure JWT secret is set in environment

3. **Authentication Errors**:
   - Verify token format: `Bearer <token>`
   - Check token expiration
   - Ensure user exists in database

4. **Database Connection**:
   - Verify Supabase credentials in `.env`
   - Check network connectivity
   - Ensure database schema is properly set up

### Environment Variables Required
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
PORT=3000
```

---

## 🔍 Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Please provide a valid email address",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Package not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 📊 Health Check

**GET** `/health`

**Response (200):**
```json
{
  "success": true,
  "message": "AltaMedia Client Dashboard Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

**Postman Example:**
```
Method: GET
URL: http://localhost:3000/health
```

---

## 🧪 Testing with Postman

### Setup Instructions:

1. **Import the collection** into Postman
2. **Set up environment variables:**
   - `base_url`: `http://localhost:3000/api`
   - `token`: Your JWT token after login
   - `admin_token`: Admin JWT token

3. **Test flow:**
   1. Login to get token
   2. Use token for authenticated requests
   3. Test all endpoints with sample data

### Sample Test Data:

**Package Creation:**
```json
{
  "name": "Starter Package",
  "description": "Perfect for new businesses",
  "price": 49.99,
  "duration_days": 30,
  "features": [
    {
      "name": "Basic Dashboard",
      "description": "Simple dashboard interface"
    }
  ]
}
```

**Addon Creation:**
```json
{
  "name": "Email Support",
  "description": "Email support for your business",
  "price_type": "recurring",
  "base_price": 19.99
}
```

**Purchase Creation:**
```json
{
  "package_id": 1,
  "addons": [1]
}
```

---

## 🎨 Brand Kit Form Endpoints

### 1. Create or Update Brand Kit Form

**POST** `/brandkit`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "business_type": "SaaS",
  "business_email": "contact@example.com",
  "has_proventous_id": "yes",
  "proventous_id": "PROV123",
  "business_name": "Example Corp",
  "phone_number": "+1234567890",
  "preferred_contact_method": "email",
  "industry": ["Technology", "SaaS"],
  "year_started": 2020,
  "main_location": "San Francisco, CA",
  "mission_statement": "To revolutionize the industry",
  "vision_statement": "Leading the future of technology",
  "core_values": ["Innovation", "Quality", "Customer Focus"],
  "business_stage": "growth",
  "brand_description": "A modern tech company focused on innovation",
  "buyer_type": ["B2B", "Enterprise"],
  "target_audience": "Tech-savvy professionals",
  "spending_type": "premium",
  "secondary_audience": "Small businesses",
  "desired_feeling": "Professional and trustworthy",
  "audience_interests": ["Technology", "Innovation"],
  "professions": ["Developers", "Managers"],
  "preferred_platforms": ["LinkedIn", "Twitter"],
  "age_groups": ["25-34", "35-44"],
  "current_audience_interests": ["Tech news", "Productivity"],
  "spending_habits": ["Premium products", "Quality over price"],
  "audience_behaviors": ["Research-driven", "Early adopters"],
  "interaction_modes": ["Digital", "Social media"],
  "customer_pain_points": "Complex onboarding process",
  "purchase_motivators": "Time savings and efficiency",
  "emotional_goal": "Confidence and trust",
  "brand_owner": "John Doe",
  "why_started": "To solve a market gap",
  "reasons_exist1": "Innovation in the industry",
  "reasons_exist2": "Customer satisfaction",
  "reasons_exist3": "Market leadership",
  "brand_soul": "Innovation meets reliability",
  "brand_personality": ["Professional", "Innovative", "Friendly"],
  "brand_voice": ["Clear", "Confident", "Approachable"],
  "admire_brand1": "Apple",
  "admire_brand2": "Tesla",
  "admire_brand3": "Stripe",
  "styles_to_avoid": "Overly casual or unprofessional",
  "existing_logo": "Basic text logo",
  "logo_action": ["Redesign", "Modernize"],
  "brand_colors": ["Blue", "White", "Gray"],
  "colors_to_avoid": ["Bright pink", "Neon green"],
  "font_preferences": ["Sans-serif", "Clean"],
  "design_style": ["Minimalist", "Modern"],
  "logo_style": ["Wordmark", "Simple"],
  "imagery_style": ["Professional", "Clean"],
  "design_inspiration": "Apple's minimalist approach",
  "usage_channels": ["Website", "Social media", "Print"],
  "brand_elements_needed": ["Logo", "Business cards", "Website"],
  "file_formats_needed": ["SVG", "PNG", "PDF"],
  "goal_this_year": "Increase market share by 50%",
  "other_short_term_goals": "Launch new product line",
  "three_to_five_year_vision": "Become industry leader",
  "additional_mid_term_goals": "Expand to international markets",
  "long_term_vision": "Global technology leader",
  "key_metrics": ["Revenue growth", "Customer satisfaction"],
  "company_culture": ["Innovation", "Collaboration", "Excellence"],
  "culture_description": "Fast-paced, innovative environment",
  "internal_rituals": "Weekly team meetings",
  "additional_notes": "Focus on premium positioning",
  "timeline": "3 months for complete brand kit",
  "decision_makers": "CEO and Marketing Director",
  "reference_materials": "Competitor analysis and market research"
}
```

**Response (201/200):**
```json
{
  "success": true,
  "message": "Brand kit form created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "business_type": "SaaS",
    "business_email": "contact@example.com",
    "business_name": "Example Corp",
    "current_step": 1,
    "progress_percentage": 8.33,
    "is_completed": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Postman Example:**
```
Method: POST
URL: http://localhost:3000/api/brandkit
Headers: 
  Authorization: Bearer <user_token>
  Content-Type: application/json
```

### 2. Get Brand Kit Form

**GET** `/brandkit`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "business_type": "SaaS",
    "business_email": "contact@example.com",
    "business_name": "Example Corp",
    "current_step": 1,
    "progress_percentage": 8.33,
    "is_completed": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Postman Example:**
```
Method: GET
URL: http://localhost:3000/api/brandkit
Headers: 
  Authorization: Bearer <user_token>
```

### 3. Update Form

**PUT** `/brandkit`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "current_step": 2,
  "progress_percentage": 16.67,
  "is_completed": false
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Form progress updated successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "current_step": 2,
    "progress_percentage": 16.67,
    "is_completed": false,
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Delete Brand Kit Form

**DELETE** `/brandkit`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Brand kit form deleted successfully"
}
```

### 5. Get All Brand Kit Forms (Admin Only)

**GET** `/brandkit/admin/all`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "business_name": "Example Corp",
      "business_email": "contact@example.com",
      "current_step": 2,
      "progress_percentage": 16.67,
      "is_completed": false,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "users": {
        "id": 1,
        "email": "user@example.com"
      }
    }
  ]
}
```

### 6. Get Brand Kit Form by ID (Admin Only)

**GET** `/brandkit/admin/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "business_type": "SaaS",
    "business_email": "contact@example.com",
    "business_name": "Example Corp",
    "current_step": 2,
    "progress_percentage": 16.67,
    "is_completed": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "users": {
      "id": 1,
      "email": "user@example.com"
    }
  }
}
```

---

## 🔒 Security Notes

- All admin endpoints require admin role
- User purchases are restricted to their own data
- Rate limiting is applied to all endpoints
- Input validation is enforced on all requests
- JWT tokens expire after 24 hours by default 