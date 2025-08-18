import apiService from './api.js';

class AuthService {
  // Get current user profile
  async getProfile() {
    try {
      const response = await apiService.getProfile();
      return response;
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiService.updateProfile(profileData);
      return response;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.changePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await apiService.login(email, password);
      
      // Store auth data in localStorage
      if (response.success && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await apiService.register(userData);
      
      // Store auth data in localStorage
      if (response.success && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      const response = await apiService.logout();
      
      // Clear auth data from localStorage
      apiService.clearAuth();
      
      return response;
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear auth data even if logout request fails
      apiService.clearAuth();
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return apiService.isAuthenticated();
  }

  // Get current user data from localStorage
  getCurrentUser() {
    return apiService.getCurrentUser();
  }

  // Clear authentication data
  clearAuth() {
    apiService.clearAuth();
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token
  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Set user data
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
