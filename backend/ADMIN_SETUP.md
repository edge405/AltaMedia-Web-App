# Admin User Setup

## Overview
This guide explains how to set up an admin user for the Alta Media admin panel.

## Prerequisites
- Backend server is running
- Database is properly configured
- Environment variables are set up

## Setup Instructions

### 1. Create Admin User
Run the admin user creation script:

```bash
cd backend
node create-admin-user.js
```

This script will:
- Create an admin user with email: `admin@altamedia.com`
- Set password: `admin123`
- Assign admin role
- Set user status to active

### 2. Admin Login Credentials
After running the script, you can use these credentials:

- **Email**: `admin@altamedia.com`
- **Password**: `admin123`

### 3. Access Admin Panel
1. Navigate to `/admin/login` in your frontend
2. Enter the admin credentials
3. You'll be redirected to `/admin-portal` upon successful login

## Database Schema
The admin user is stored in the `users` table with:
- `role` field set to `'admin'`
- `status` field set to `'active'`
- Password is hashed using bcrypt

## Security Features
- Role-based authentication
- Session expiration (24 hours)
- Protected admin routes
- Secure password hashing

## Troubleshooting

### If admin user already exists:
The script will update the password if the user already exists.

### If login fails:
1. Check if the backend server is running
2. Verify database connection
3. Ensure environment variables are set correctly
4. Check if the user has admin role in the database

### If you need to change admin credentials:
1. Update the email and password in `create-admin-user.js`
2. Run the script again
3. The existing user will be updated with new credentials

## API Integration
The admin login uses the existing `/api/auth/login` endpoint and checks for:
- Valid email/password combination
- User role = 'admin'
- Active user status

The system stores both admin session data and regular auth token for API calls.
