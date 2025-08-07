# Auth API Documentation

## 📋 Overview

The Auth API provides comprehensive user authentication and profile management functionality. This system handles user registration, login, logout, profile management, password updates, and token refresh with secure JWT authentication and bcrypt password hashing.

## 🗄️ Database Schema

### Table: `users`

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(255),
    phone_number VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Database Features

#### Indexes for Performance
```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### Constraints and Validation
```sql
-- Unique constraints
UNIQUE(email)

-- Not null constraints
NOT NULL(email, password)
```

## 🔐 Authentication

### Public Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Private Endpoints (JWT Required)
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Edit user profile
- `PUT /api/auth/password` - Change user password

## 📡 API Endpoints

### 1. User Registration

**POST** `/api/auth/register`

Creates a new user account with secure password hashing.

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "fullname": "John Doe",
  "phone_number": "+1234567890",
  "address": "123 Main St, City, State 12345"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 123,
      "email": "user@example.com",
      "fullname": "John Doe",
      "phone_number": "+1234567890",
      "address": "123 Main St, City, State 12345",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Response (400 Bad Request)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 2. User Login

**POST** `/api/auth/login`

Authenticates user credentials and returns JWT token.

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 123,
      "email": "user@example.com",
      "fullname": "John Doe",
      "phone_number": "+1234567890",
      "address": "123 Main St, City, State 12345",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Response (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 3. User Logout

**POST** `/api/auth/logout`

Logs out the current user (token invalidation handled client-side).

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 4. Get User Profile

**GET** `/api/auth/profile`

Retrieves the current authenticated user's profile information.

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "fullname": "John Doe",
    "phone_number": "+1234567890",
    "address": "123 Main St, City, State 12345",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "User not found"
}
```

### 5. Refresh JWT Token

**POST** `/api/auth/refresh`

Refreshes the JWT token using a valid refresh token.

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Response (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid refresh token"
}
```

### 6. Edit User Profile

**PUT** `/api/auth/profile`

Updates the current user's profile information.

#### Request Body
```json
{
  "fullname": "John Smith",
  "phone_number": "+1987654321",
  "address": "456 Oak Ave, New City, State 54321"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 123,
    "email": "user@example.com",
    "fullname": "John Smith",
    "phone_number": "+1987654321",
    "address": "456 Oak Ave, New City, State 54321",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### Response (400 Bad Request)
```json
{
  "success": false,
  "message": "At least one field (fullname, phone_number, or address) must be provided"
}
```

### 7. Change User Password

**PUT** `/api/auth/password`

Changes the current user's password with validation.

#### Request Body
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newsecurepassword456"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

#### Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

#### Response (400 Bad Request)
```json
{
  "success": false,
  "message": "New password must be at least 6 characters long"
}
```

## 🔧 Implementation Details

### File Structure
```
backend/
├── src/
│   ├── controllers/
│   │   └── authController.js
│   ├── routes/
│   │   └── authRoutes.js
│   └── server.js
├── docs/
│   └── Auth_API_Documentation.md
└── database/
    └── schema.sql
```

### Key Features

1. **Secure Authentication**
   - JWT token-based authentication
   - bcrypt password hashing (salt rounds: 10)
   - Token expiration management
   - Refresh token functionality

2. **User Management**
   - Complete user registration
   - Profile information management
   - Password change with validation
   - Email uniqueness validation

3. **Security Features**
   - Password strength validation
   - Current password verification
   - Secure token generation
   - Input validation and sanitization

4. **Profile Management**
   - Full profile CRUD operations
   - Partial profile updates
   - Timestamp tracking
   - Data integrity validation

### Security Features

1. **Password Security**
   - bcrypt hashing with salt rounds
   - Minimum password length validation
   - Current password verification
   - Secure password storage

2. **Token Management**
   - JWT token generation
   - Configurable expiration times
   - Refresh token functionality
   - Secure token storage

3. **Data Validation**
   - Email format validation
   - Required field validation
   - Input sanitization
   - Error handling

## 🎨 Frontend Integration

### API Integration Examples

#### User Registration
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123',
    fullname: 'John Doe',
    phone_number: '+1234567890',
    address: '123 Main St, City, State 12345'
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.data.token);
  console.log('Registration successful:', data.data.user);
} else {
  console.error('Registration failed:', data.message);
}
```

#### User Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123'
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.data.token);
  console.log('Login successful:', data.data.user);
} else {
  console.error('Login failed:', data.message);
}
```

#### Get User Profile
```javascript
const response = await fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
if (data.success) {
  console.log('User profile:', data.data);
} else {
  console.error('Failed to get profile:', data.message);
}
```

#### Update Profile
```javascript
const response = await fetch('/api/auth/profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    fullname: 'John Smith',
    phone_number: '+1987654321'
  })
});

const data = await response.json();
if (data.success) {
  console.log('Profile updated:', data.data);
} else {
  console.error('Update failed:', data.message);
}
```

#### Change Password
```javascript
const response = await fetch('/api/auth/password', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    currentPassword: 'oldpassword123',
    newPassword: 'newsecurepassword456'
  })
});

const data = await response.json();
if (data.success) {
  console.log('Password changed successfully');
} else {
  console.error('Password change failed:', data.message);
}
```

## 🧪 Testing

### Test Scenarios

1. **Registration Flow**
   - Register new user with valid data
   - Attempt registration with existing email
   - Validate required fields
   - Test password strength requirements

2. **Login Flow**
   - Login with valid credentials
   - Login with invalid email
   - Login with invalid password
   - Test token generation

3. **Profile Management**
   - Get user profile
   - Update profile information
   - Partial profile updates
   - Profile validation

4. **Password Management**
   - Change password with valid current password
   - Change password with invalid current password
   - Test password length validation
   - Verify password hashing

5. **Token Management**
   - Refresh JWT token
   - Test token expiration
   - Validate token structure
   - Test logout functionality

### Test Data Examples

#### Register User
```json
{
  "email": "test@example.com",
  "password": "securepassword123",
  "fullname": "Test User",
  "phone_number": "+1234567890",
  "address": "123 Test St, Test City, TS 12345"
}
```

#### Login User
```json
{
  "email": "test@example.com",
  "password": "securepassword123"
}
```

#### Update Profile
```json
{
  "fullname": "Updated Test User",
  "phone_number": "+1987654321",
  "address": "456 Updated Ave, New City, NC 54321"
}
```

#### Change Password
```json
{
  "currentPassword": "securepassword123",
  "newPassword": "newsecurepassword456"
}
```

## 📊 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 🚀 Usage Examples

### cURL Examples

#### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "fullname": "John Doe",
    "phone_number": "+1234567890",
    "address": "123 Main St, City, State 12345"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

#### Get Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Profile
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "fullname": "John Smith",
    "phone_number": "+1987654321"
  }'
```

#### Change Password
```bash
curl -X PUT http://localhost:3000/api/auth/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "currentPassword": "oldpassword123",
    "newPassword": "newsecurepassword456"
  }'
```

### JavaScript/Fetch Examples

#### Register User
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123',
    fullname: 'John Doe',
    phone_number: '+1234567890',
    address: '123 Main St, City, State 12345'
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.data.token);
  console.log('Registration successful:', data.data.user);
} else {
  console.error('Registration failed:', data.message);
}
```

#### Login User
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123'
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.data.token);
  console.log('Login successful:', data.data.user);
} else {
  console.error('Login failed:', data.message);
}
```

## 🔄 Recent Updates

### Version 1.0.0 (Latest)
- ✅ **Secure Authentication System**
  - JWT token-based authentication
  - bcrypt password hashing
  - Token expiration management
  - Refresh token functionality

- ✅ **User Management**
  - Complete user registration
  - Profile information management
  - Password change with validation
  - Email uniqueness validation

- ✅ **Security Features**
  - Password strength validation
  - Current password verification
  - Secure token generation
  - Input validation and sanitization

- ✅ **Profile Management**
  - Full profile CRUD operations
  - Partial profile updates
  - Timestamp tracking
  - Data integrity validation

- ✅ **Error Handling**
  - Comprehensive error responses
  - Input validation
  - Database error handling
  - Security error handling

## 📝 Notes

1. **Password Security**: All passwords are hashed using bcrypt with 10 salt rounds for maximum security.

2. **Token Management**: JWT tokens are used for authentication with configurable expiration times.

3. **Email Validation**: Email addresses must be unique and are validated during registration.

4. **Profile Updates**: Users can update their profile information partially or completely.

5. **Password Changes**: Password changes require current password verification for security.

6. **Error Handling**: Comprehensive error handling for all authentication scenarios.

7. **Data Integrity**: All user data is validated and sanitized before storage.

8. **Security**: The system implements industry-standard security practices for user authentication.

---

**Last Updated**: August 2025  
**API Version**: 1.0.0  
**Maintainer**: Edjay Lindayao
