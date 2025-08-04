# Authentication System Documentation

This document describes the authentication system implemented for the AltaMedia frontend application.

## Environment Configuration

The application uses environment variables for configuration. Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Overview

The authentication system provides a complete login/logout functionality with user registration, profile management, and secure token-based authentication using JWT tokens.

## Features

- ✅ User registration with validation
- ✅ User login with email/password
- ✅ JWT token-based authentication
- ✅ Automatic token storage and retrieval
- ✅ User profile management
- ✅ Password change functionality
- ✅ Secure logout
- ✅ Protected routes
- ✅ Dark mode support
- ✅ Responsive design

## Architecture

### Components

1. **AuthContext** (`src/contexts/AuthContext.jsx`)
   - Manages authentication state
   - Provides login, register, logout functions
   - Handles token storage and retrieval
   - Exposes user data and authentication status

2. **API Service** (`src/utils/api.js`)
   - Centralized API communication
   - Handles authenticated requests
   - Provides utility functions for auth operations

3. **Login Page** (`src/pages/Login.jsx`)
   - User login interface
   - Registration form toggle
   - Demo credentials support
   - Dark mode support

4. **Register Page** (`src/pages/Register.jsx`)
   - Dedicated registration interface
   - Form validation
   - Password confirmation

5. **Protected Route** (`src/components/ProtectedRoute.jsx`)
   - Route protection middleware
   - Automatic redirect to login
   - Loading states

6. **Profile Page** (`src/pages/Profile.jsx`)
   - User profile management
   - Password change functionality
   - Profile information updates

## API Endpoints

The frontend communicates with the backend using these endpoints:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

## Usage

### Setting up Authentication

1. Wrap your app with `AuthProvider`:

```jsx
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

2. Use the `useAuth` hook in your components:

```jsx
import { useAuth } from "../contexts/AuthContext.jsx";

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Use authentication functions
}
```

### Login Flow

1. User visits `/login`
2. Enters email and password
3. System validates credentials with backend
4. On success, JWT token is stored in localStorage
5. User is redirected to dashboard

### Registration Flow

1. User visits `/register` or clicks "Register" on login page
2. Fills out registration form with validation
3. System creates new user account
4. User is automatically logged in and redirected to dashboard

### Protected Routes

Routes that require authentication are wrapped with `ProtectedRoute`:

```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## Token Management

- **Storage**: JWT tokens are stored in localStorage as `authToken`
- **User Data**: User information is stored in localStorage as `user`
- **Automatic Retrieval**: Tokens are automatically retrieved on app startup
- **Cleanup**: Tokens are removed on logout or token expiration

## Security Features

- JWT token-based authentication
- Password hashing (handled by backend)
- Secure token storage
- Automatic token validation
- Protected route middleware
- Form validation
- Error handling

## Styling

The authentication system supports:
- Dark mode toggle
- Responsive design
- Modern UI components
- Loading states
- Error messages
- Success notifications

## File Structure

```
frontend/src/
├── contexts/
│   └── AuthContext.jsx          # Authentication context provider
├── utils/
│   └── api.js                   # API service utilities
├── components/
│   └── ProtectedRoute.jsx       # Route protection component
├── pages/
│   ├── Login.jsx               # Login page
│   ├── Register.jsx            # Registration page
│   └── Profile.jsx             # Profile management page
└── App.jsx                     # Main app with AuthProvider
```

## Backend Integration

The authentication system integrates with the backend API running on `http://localhost:3000`. The backend provides:

- User registration and login endpoints
- JWT token generation and validation
- Password hashing and verification
- User profile management
- Token-based authentication middleware

## Demo Credentials

For testing purposes, you can use these demo credentials:
- **Email**: demo@altamedia.com
- **Password**: demo123

## Error Handling

The system includes comprehensive error handling:
- Network errors
- Authentication failures
- Validation errors
- Token expiration
- User feedback through toast notifications

## Future Enhancements

Potential improvements for the authentication system:
- [ ] Refresh token implementation
- [ ] Two-factor authentication
- [ ] Social login integration
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Session management
- [ ] Rate limiting
- [ ] Audit logging

## Troubleshooting

### Common Issues

1. **Login not working**
   - Ensure backend is running on port 3000
   - Check network connectivity
   - Verify API endpoints are correct

2. **Token not persisting**
   - Check localStorage is enabled
   - Verify token format
   - Check for JavaScript errors

3. **Protected routes not working**
   - Ensure AuthProvider is wrapping the app
   - Check token is valid
   - Verify route configuration

### Debug Mode

Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'auth');
```

## API Response Format

The backend returns responses in this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullname": "User Name",
      "phone_number": "+1234567890",
      "address": "User Address"
    },
    "token": "jwt_token_here"
  }
}
```

## Environment Variables

The frontend uses these environment variables:
- `VITE_API_URL` (optional) - Backend API URL (defaults to http://localhost:3000)

## Testing

To test the authentication system:

1. Start the backend server
2. Start the frontend development server
3. Navigate to `/login`
4. Use demo credentials or register a new account
5. Test protected routes and logout functionality

## Support

For issues or questions about the authentication system, please refer to:
- Backend API documentation
- React Router documentation
- JWT token documentation 