import apiService from './api';

const BASE_URL = '/deliverables';

export const deliverableApi = {
  // Get client deliverables by purchase ID
  getClientDeliverables: async (purchaseId) => {
    try {
      console.log('Fetching deliverables for purchase ID:', purchaseId);
      console.log('API endpoint:', `${BASE_URL}/${purchaseId}`);
      const response = await apiService.get(`${BASE_URL}/${purchaseId}`);
      console.log('API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching client deliverables:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      throw error;
    }
  },

  // Get single deliverable
  getDeliverable: async (deliverableId) => {
    try {
      const response = await apiService.get(`${BASE_URL}/${deliverableId}`);
      return response;
    } catch (error) {
      console.error('Error fetching deliverable:', error);
      throw error;
    }
  },

  // Request revision for deliverable
  requestRevision: async (deliverableId, requestReason) => {
    try {
      const response = await apiService.post(`${BASE_URL}/${deliverableId}/request-revision`, {
        requestReason
      });
      return response;
    } catch (error) {
      console.error('Error requesting revision:', error);
      throw error;
    }
  },

  // Get user's revision requests
  getRevisionRequests: async () => {
    try {
      const response = await apiService.get('/revision-requests');
      return response;
    } catch (error) {
      console.error('Error fetching revision requests:', error);
      throw error;
    }
  },

  // Get single revision request
  getRevisionRequest: async (revisionRequestId) => {
    try {
      const response = await apiService.get(`/revision-requests/${revisionRequestId}`);
      return response;
    } catch (error) {
      console.error('Error fetching revision request:', error);
      throw error;
    }
  },

  // Update revision request (Client only)
  updateRevisionRequest: async (revisionRequestId, requestReason) => {
    try {
      const response = await apiService.put(`/revision-requests/${revisionRequestId}`, {
        requestReason
      });
      return response;
    } catch (error) {
      console.error('Error updating revision request:', error);
      throw error;
    }
  },

  // Download deliverable file
  downloadFile: (filePath) => {
    // Construct the full URL for file download
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    
    if (!filePath) {
      console.error('No file path provided for download');
      return '';
    }
    
    // Remove any leading slashes and normalize path separators
    const cleanPath = filePath.replace(/^[\/\\]+/, '').replace(/\\/g, '/');
    
    // If the path already includes 'uploads', use it as is
    if (cleanPath.startsWith('uploads/')) {
      return `${baseUrl}/${cleanPath}`;
    }
    
    // Otherwise, assume it's a relative path and prepend 'uploads/'
    return `${baseUrl}/uploads/${cleanPath}`;
  },

  // Approve deliverable
  approveDeliverable: async (deliverableId) => {
    try {
      const response = await apiService.put(`${BASE_URL}/${deliverableId}/approve`);
      return response;
    } catch (error) {
      console.error('Error approving deliverable:', error);
      throw error;
    }
  },

  // Get deliverable history
  getDeliverableHistory: async (purchaseId, featureName) => {
    try {
      const response = await apiService.get(`${BASE_URL}/${purchaseId}/${featureName}/history`);
      return response;
    } catch (error) {
      console.error('Error fetching deliverable history:', error);
      throw error;
    }
  }
};