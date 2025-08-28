import apiService from './api';

/**
 * User Package API utilities
 */
export const userPackageApi = {
  /**
   * Get user's purchased packages
   * @returns {Promise<Object>} API response with user packages
   */
  getUserPackages: async () => {
    try {
      const response = await apiService.get('/user-package/packages');
      return response;
    } catch (error) {
      console.error('Error fetching user packages:', error);
      throw new Error(error.message || 'Failed to fetch user packages');
    }
  },

  /**
   * Get user's purchased package by ID
   * @param {number} packageId - Package ID
   * @returns {Promise<Object>} API response with package details
   */
  getUserPackageById: async (packageId) => {
    try {
      const response = await apiService.get(`/user-package/packages/${packageId}`);
      return response;
    } catch (error) {
      console.error('Error fetching package details:', error);
      throw new Error(error.message || 'Failed to fetch package details');
    }
  },

  /**
   * Get user's detailed packages with statistics
   * @returns {Promise<Object>} API response with detailed package information
   */
  getUserPackagesDetailed: async () => {
    try {
      const response = await apiService.get('/user-package/user-packages-detailed');
      return response;
    } catch (error) {
      console.error('Error fetching detailed packages:', error);
      throw new Error(error.message || 'Failed to fetch detailed packages');
    }
  },

  /**
   * Get user's active packages only
   * @returns {Promise<Object>} API response with active packages
   */
  getUserActivePackages: async () => {
    try {
      const response = await apiService.get('/user-package/active-packages');
      return response;
    } catch (error) {
      console.error('Error fetching active packages:', error);
      throw new Error(error.message || 'Failed to fetch active packages');
    }
  },

  /**
   * Get all user packages (Admin only)
   * @returns {Promise<Object>} API response with all user packages
   */
  getAllUserPackages: async () => {
    try {
      const response = await apiService.get('/user-package/admin/all');
      return response;
    } catch (error) {
      console.error('Error fetching all user packages:', error);
      throw new Error(error.message || 'Failed to fetch all user packages');
    }
  },

  /**
   * Get admin dashboard statistics (Admin only)
   * @returns {Promise<Object>} API response with dashboard statistics
   */
  getAdminDashboardStats: async () => {
    try {
      const response = await apiService.get('/user-package/admin/dashboard-stats');
      return response;
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      throw new Error(error.message || 'Failed to fetch admin dashboard stats');
    }
  },

  /**
   * Update feature status in user's package
   * @param {number} packageId - Package ID
   * @param {number} featureId - Feature ID
   * @param {string} status - New status (pending, in_progress, completed, cancelled)
   * @param {number} progress - Progress percentage (0-100)
   * @returns {Promise<Object>} API response
   */
  updateFeatureStatus: async (packageId, featureId, status, progress) => {
    try {
      const response = await apiService.put(`/user-package/packages/${packageId}/features/${featureId}/status`, {
        status,
        progress
      });
      return response;
    } catch (error) {
      console.error('Error updating feature status:', error);
      throw new Error(error.message || 'Failed to update feature status');
    }
  }
};
