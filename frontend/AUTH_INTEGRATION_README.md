# Authentication Integration Documentation

This document describes the authentication integration between the frontend ClientPortal and the backend authController.

## Overview

The authentication system has been refactored to provide a clean separation of concerns with proper service layers and context management.

## Architecture

### Service Layers

1. **AuthService** (`/src/utils/authService.js`)
   - Handles all authentication-related API calls
   - Manages token storage and retrieval
   - Provides login, register, logout functionality

2. **ProfileService** (`/src/utils/profileService.js`)
   - Handles profile-specific operations
   - Provides data validation and formatting
   - Manages profile updates and password changes

3. **ApiService** (`/src/utils/api.js`)
   - Base API service with generic HTTP methods
   - Handles authentication headers
   - Provides error handling and response formatting

### Context Management

**AuthContext** (`/src/contexts/AuthContext.jsx`)
- Manages global authentication state
- Provides authentication methods to components
- Handles user session persistence

## Backend Integration

The frontend integrates with the following backend endpoints:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

## Usage Examples

### Using AuthContext in Components

```jsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user.fullname}!</div>;
}
```

### Using ProfileService

```jsx
import profileService from '@/utils/profileService';

// Update profile
const updateProfile = async () => {
  try {
    const response = await profileService.updateProfile({
      fullname: 'John Doe',
      phone_number: '+1234567890',
      address: '123 Main St'
    });
    
    if (response.success) {
      console.log('Profile updated successfully');
    }
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
};

// Change password
const changePassword = async () => {
  try {
    const response = await profileService.changePassword(
      'currentPassword',
      'newPassword'
    );
    
    if (response.success) {
      console.log('Password changed successfully');
    }
  } catch (error) {
    console.error('Failed to change password:', error);
  }
};
```

### Using AuthService

```jsx
import authService from '@/utils/authService';

// Login
const login = async () => {
  try {
    const response = await authService.login('user@example.com', 'password');
    if (response.success) {
      console.log('Login successful');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Check authentication status
const isLoggedIn = authService.isAuthenticated();
const currentUser = authService.getCurrentUser();
```

## Features Implemented

### ClientPortal Profile Management
- ✅ Real-time profile data loading from backend
- ✅ Profile editing with validation
- ✅ Password change functionality
- ✅ Authentication state management
- ✅ Automatic logout on authentication failure
- ✅ Form validation and error handling
- ✅ Loading states and user feedback

### Security Features
- ✅ JWT token management
- ✅ Automatic token inclusion in API requests
- ✅ Secure password change with current password verification
- ✅ Input validation and sanitization
- ✅ Session persistence

### User Experience
- ✅ Responsive design with modern UI
- ✅ Loading indicators and success/error messages
- ✅ Password visibility toggles
- ✅ Form validation with real-time feedback
- ✅ Smooth transitions and animations

## File Structure

```
frontend/src/
├── contexts/
│   └── AuthContext.jsx          # Authentication context
├── utils/
│   ├── api.js                   # Base API service
│   ├── authService.js           # Authentication service
│   └── profileService.js        # Profile management service
└── pages/
    └── ClientPortal.jsx         # Updated with auth integration
```

## Environment Variables

Make sure to set the following environment variables:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Testing

To test the authentication integration:

1. Start the backend server
2. Start the frontend development server
3. Navigate to the login page
4. Register a new account or login with existing credentials
5. Access the ClientPortal to test profile management features

## Error Handling

The system includes comprehensive error handling:

- Network errors are caught and displayed to users
- Validation errors are shown with specific messages
- Authentication failures redirect to login
- API errors are logged for debugging

## Future Enhancements

- [ ] Add refresh token functionality
- [ ] Implement password reset
- [ ] Add two-factor authentication
- [ ] Add session timeout handling
- [ ] Implement role-based access control
