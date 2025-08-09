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
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 