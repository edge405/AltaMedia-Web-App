import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        const { user: userData, token: authToken } = data.data;
        
        // Store token and user data
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(authToken);
        setUser(userData);
        
        toast.success('Login successful! Welcome to Altamedia');
        return { success: true };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.success) {
        const { user: newUser, token: authToken } = data.data;
        
        // Store token and user data
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        setToken(authToken);
        setUser(newUser);
        
        toast.success('Registration successful! Welcome to Altamedia');
        return { success: true };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if token exists
      if (token) {
        await fetch('http://localhost:3000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage and state regardless of API call result
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      if (data.success) {
        const updatedUser = data.data;
        
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast.success('Profile updated successfully');
        return { success: true };
      } else {
        throw new Error(data.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Profile update failed. Please try again.');
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      if (data.success) {
        toast.success('Password changed successfully');
        return { success: true };
      } else {
        throw new Error(data.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error.message || 'Password change failed. Please try again.');
      return { success: false, error: error.message };
    }
  };

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    getAuthHeaders,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 