import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/utils/authService';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = authService.getToken();
        const currentUser = authService.getCurrentUser();

        console.log('Checking authentication:', { hasToken: !!token, hasUser: !!currentUser });

        if (token && currentUser) {
          // Verify token is still valid by making a profile request
          try {
            const profileResponse = await authService.getProfile();
            if (profileResponse.success && profileResponse.data) {
              setUser(profileResponse.data);
              setIsAuthenticated(true);
              console.log('Authentication verified successfully');
            } else {
              // Token is invalid, clear auth data
              console.log('Token verification failed, clearing auth data');
              authService.clearAuth();
              setUser(null);
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.log('Profile request failed, clearing auth data:', error);
            authService.clearAuth();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log('No token or user data found');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        authService.clearAuth();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);

      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return { success: true };
      } else {
        toast.error(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);

      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success('Registration successful!');
        return { success: true };
      } else {
        toast.error(response.message || 'Registration failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear auth data even if logout request fails
      authService.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    authService.setUser(userData);
  };

  // Refresh user data from API
  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        authService.setUser(response.data);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // If refresh fails, user might be logged out
      authService.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 