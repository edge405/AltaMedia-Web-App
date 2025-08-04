const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth headers for authenticated requests
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Auth-specific methods
  async login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async logout() {
    return this.post('/auth/logout');
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.put('/auth/profile', profileData);
  }

  async changePassword(currentPassword, newPassword) {
    return this.put('/auth/password', { currentPassword, newPassword });
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Get current user data
  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  // Clear authentication data
  clearAuth() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 