# Admin Login System

## Overview
The admin login system provides secure access to the administrative portal for managing clients, packages, campaigns, and other business operations.

## Features

### Admin Login (`/admin/login`)
- **Route**: `/admin/login`
- **Credentials**: 
  - Username: `admin`
  - Password: `admin123`
- **Security**: Session-based authentication with 24-hour expiration
- **Redirect**: After successful login, redirects to `/admin-portal`

### Admin Portal (`/admin-portal`)
- **Route**: `/admin-portal`
- **Protection**: Protected by `AdminProtectedRoute` component
- **Features**:
  - Dashboard with overview statistics
  - Client management
  - Activity logs monitoring
  - Package & deliverables management
  - Campaign & budget control
  - Analytics & reporting
  - BrandKit management
  - Support & communication

### Authentication Flow
1. Admin visits `/admin/login`
2. Enters credentials (admin/admin123)
3. System validates credentials
4. Stores admin session in localStorage
5. Redirects to `/admin-portal`
6. AdminProtectedRoute checks session validity
7. Session expires after 24 hours

### Logout Functionality
- **Location**: Top bar and sidebar
- **Action**: Clears admin session and redirects to login
- **Notification**: Shows success toast message

## Security Features
- Session expiration (24 hours)
- Protected routes with authentication checks
- Secure credential storage
- Automatic redirect on session expiry

## File Structure
```
frontend/src/
├── pages/
│   ├── AdminLogin.jsx          # Admin login page
│   ├── AdminPortal.jsx         # Main admin dashboard
│   └── index.jsx               # Route configuration
├── components/
│   └── AdminProtectedRoute.jsx # Route protection component
└── utils/
    └── authService.js          # Authentication utilities
```

## Usage
1. Navigate to `/admin/login`
2. Enter admin credentials
3. Access admin portal at `/admin-portal`
4. Use logout button to end session

## Demo Credentials
- **Username**: admin
- **Password**: admin123

*Note: These are demo credentials for development purposes. In production, implement proper authentication with backend validation.*
