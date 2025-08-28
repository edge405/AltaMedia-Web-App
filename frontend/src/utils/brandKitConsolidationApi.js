import apiService from './api';

/**
 * BrandKit Consolidation API utilities
 */
export const brandKitConsolidationApi = {
  /**
   * Get consolidated BrandKit form data for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} API response with consolidated data
   */
  getConsolidatedData: async (userId) => {
    try {
      const response = await apiService.get(`/brandkit/consolidate/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching consolidated BrandKit data:', error);
      throw new Error(error.message || 'Failed to fetch consolidated BrandKit data');
    }
  },

  /**
   * Trigger webhook with consolidated BrandKit form data
   * @param {string} userId - User ID
   * @param {string} webhookUrl - Webhook URL to send data to
   * @returns {Promise<Object>} API response with webhook result
   */
  triggerWebhook: async (userId, webhookUrl) => {
    try {
      const response = await apiService.post(`/brandkit/webhook/${userId}`, {
        webhook_url: webhookUrl
      });
      return response;
    } catch (error) {
      console.error('Error triggering webhook:', error);
      throw new Error(error.message || 'Failed to trigger webhook');
    }
  }
};
