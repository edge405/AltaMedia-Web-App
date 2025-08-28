class ApiService {
  constructor() {
    console.log('Environment variables:', import.meta.env);
    console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    
    // In production, API calls should be relative to the same domain
    // In development, use the environment variable
    if (import.meta.env.PROD) {
      this.baseURL = '/api';
    } else {
      // Check if VITE_API_BASE_URL already includes /api
      const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      this.baseURL = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
    }
    
    console.log('Final baseURL:', this.baseURL);
  }
  

  // Get auth headers for authenticated requests
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    console.log("API_BASE_URL: ", this.baseURL);
    console.log("Token exists: ", !!token);
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
      credentials: 'include', // Include cookies for session management
      ...options,
    };

    try {
      console.log('Making request to:', url);
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      
      // Handle 401 Unauthorized - clear auth and redirect to login
      if (response.status === 401) {
        console.log('Unauthorized request - clearing auth data');
        this.clearAuth();
        // Redirect to login page
        window.location.href = '/login';
        throw new Error('Unauthorized - please log in again');
      }

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

  // POST request with FormData (for file uploads)
  async postFormData(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    console.log('postFormData called with:', {
      url,
      hasToken: !!token,
      formDataEntries: Array.from(formData.entries()).map(([key, value]) => 
        [key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value]
      )
    });
    
    const config = {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        // Don't set Content-Type for FormData - browser will set it automatically with boundary
      },
      credentials: 'include',
      body: formData,
    };

    try {
      console.log('Making fetch request to:', url);
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.log('Unauthorized request - clearing auth data');
        this.clearAuth();
        window.location.href = '/login';
        throw new Error('Unauthorized - please log in again');
      }
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // PUT request with FormData (for file uploads)
  async putFormData(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config = {
      method: 'PUT',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        // Don't set Content-Type for FormData - browser will set it automatically with boundary
      },
      credentials: 'include',
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.log('Unauthorized request - clearing auth data');
        this.clearAuth();
        window.location.href = '/login';
        throw new Error('Unauthorized - please log in again');
      }
      
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
    try {
      const response = await this.post('/auth/logout');
      this.clearAuth();
      return response;
    } catch (error) {
      // Clear auth data even if logout request fails
      this.clearAuth();
      throw error;
    }
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
    const user = localStorage.getItem('user');
    return !!(token && user);
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

  // Package methods
  async getPackages() {
    return this.get('/packages');
  }

  async getPackageById(id) {
    return this.get(`/packages/${id}`);
  }

  async createPackage(packageData) {
    return this.post('/packages', packageData);
  }

  async updatePackage(id, packageData) {
    return this.put(`/packages/${id}`, packageData);
  }

  async deletePackage(id) {
    return this.delete(`/packages/${id}`);
  }

  // Package Purchase methods
  async getUserPackagePurchases() {
    return this.get('/package-purchases');
  }

  async getPackagePurchaseById(id) {
    return this.get(`/package-purchases/${id}`);
  }

  async getAllPackagePurchases() {
    return this.get('/package-purchases/admin/all');
  }

  // Addon methods
  async getAddons() {
    return this.get('/addons');
  }

  async getAddonById(id) {
    return this.get(`/addons/${id}`);
  }

  async getUserAddons() {
    return this.get('/addons/user');
  }

  async createAddon(addonData) {
    return this.post('/addons', addonData);
  }

  async updateAddon(id, addonData) {
    return this.put(`/addons/${id}`, addonData);
  }

  async deleteAddon(id) {
    return this.delete(`/addons/${id}`);
  }

  // Addon Purchase methods
  async getUserAddonPurchases() {
    return this.get('/addon-purchases');
  }

  async getAddonPurchaseById(id) {
    return this.get(`/addon-purchases/${id}`);
  }

  async createAddonPurchase(addonId) {
    return this.post('/addon-purchases', { addon_id: addonId });
  }

  async cancelAddonPurchase(id) {
    return this.put(`/addon-purchases/${id}/cancel`);
  }

  async getAllAddonPurchases() {
    return this.get('/addon-purchases/admin/all');
  }

  // Combined Purchase methods (for compatibility)
  async getUserPurchases() {
    return this.get('/purchases');
  }

  async getPurchaseById(id) {
    return this.get(`/purchases/${id}`);
  }

  async createPurchase(purchaseData) {
    return this.post('/purchases', purchaseData);
  }

  async getAllPurchases() {
    return this.get('/purchases/admin/all');
  }

  // Brand Kit methods
  async getBrandKitForms() {
    return this.get('/brandkit/forms');
  }

  async getBrandKitFormById(id) {
    return this.get(`/brandkit/forms/${id}`);
  }

  async createBrandKitForm(formData) {
    return this.post('/brandkit/forms', formData);
  }

  async updateBrandKitForm(id, formData) {
    return this.put(`/brandkit/forms/${id}`, formData);
  }

  async getAllBrandKitForms() {
    return this.get('/brandkit/forms/admin/all');
  }

  // Client Request methods
  async getClientRequests() {
    return this.get('/client-requests');
  }

  async getClientRequestById(id) {
    return this.get(`/client-requests/${id}`);
  }

  async createClientRequest(requestData) {
    return this.post('/client-requests', requestData);
  }

  async getAllClientRequests() {
    return this.get('/client-requests/admin');
  }

  async getClientRequestByIdAdmin(id) {
    return this.get(`/client-requests/admin/${id}`);
  }

  async updateClientRequest(id, updateData) {
    return this.put(`/client-requests/admin/${id}`, updateData);
  }

  // Organization methods
  async getOrganizationForms() {
    return this.get('/organization/data');
  }

  async getOrganizationFormById(id) {
    return this.get(`/organization/data/${id}`);
  }

  async createOrganizationForm(formData) {
    return this.post('/organization/save', formData);
  }

  async updateOrganizationForm(id, formData) {
    return this.put(`/organization/save/${id}`, formData);
  }

  async getAllOrganizationForms() {
    return this.get('/organization/admin/all');
  }

  // Export methods
  async exportBrandKitData(userId, format = 'pdf') {
    return this.get(`/brandkit/export/${userId}?format=${format}`);
  }

  async exportAllFormsData(userId, format = 'pdf') {
    return this.get(`/brandkit/consolidate/${userId}?format=${format}`);
  }

  async downloadFormData(userId, formType, format = 'pdf') {
    return this.get(`/forms/export/${formType}/${userId}?format=${format}`);
  }

  // Dashboard specific methods
  async getDashboardData() {
    try {
      const [packagePurchases, addonPurchases, packages, addons] = await Promise.all([
        this.getUserPackagePurchases(),
        this.getUserAddonPurchases(),
        this.getPackages(),
        this.getAddons()
      ]);

      return {
        success: true,
        data: {
          packagePurchases: packagePurchases.data || {},
          addonPurchases: addonPurchases.data || {},
          availablePackages: packages.data || {},
          availableAddons: addons.data || {}
        }
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }

  // Analytics methods (for future implementation)
  async getAnalytics() {
    return this.get('/analytics');
  }

  async getUserAnalytics() {
    return this.get('/analytics/user');
  }

  // Package Feature Comments methods
  async createFeatureComment(packageFeatureId, userId, commentText) {
    return this.post('/package-feature-comments', {
      package_feature_id: packageFeatureId,
      user_id: userId,
      comment_text: commentText
    });
  }

  async getCommentsByFeature(packageFeatureId) {
    return this.get(`/package-feature-comments/feature/${packageFeatureId}`);
  }

  async getCommentsByUser(userId) {
    return this.get(`/package-feature-comments/user/${userId}`);
  }

  async getCommentsByFeatureAndUser(packageFeatureId, userId) {
    return this.get(`/package-feature-comments/feature/${packageFeatureId}/user/${userId}`);
  }

  async getCommentById(commentId) {
    return this.get(`/package-feature-comments/${commentId}`);
  }

  async updateFeatureComment(commentId, commentText) {
    return this.put(`/package-feature-comments/${commentId}`, {
      comment_text: commentText
    });
  }

  async deleteFeatureComment(commentId) {
    return this.delete(`/package-feature-comments/${commentId}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 