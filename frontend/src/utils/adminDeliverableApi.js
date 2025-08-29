import apiService from './api';
import API_CONFIG from '../config/api';

const BASE_URL = '/deliverables';

export const adminDeliverableApi = {
  // Upload deliverable (Admin only)
  uploadDeliverable: async (formData) => {
    try {
      console.log('adminDeliverableApi.uploadDeliverable called with:', {
        endpoint: `${BASE_URL}/admin/upload`,
        formDataEntries: Array.from(formData.entries()).map(([key, value]) => 
          [key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value]
        )
      });
      
      const response = await apiService.postFormData(`${BASE_URL}/admin/upload`, formData);
      console.log('adminDeliverableApi.uploadDeliverable response:', response);
      return response;
    } catch (error) {
      console.error('Error uploading deliverable:', error);
      throw error;
    }
  },

  // Upload deliverable link (Admin only)
  uploadDeliverableLink: async (linkData) => {
    try {
      console.log('adminDeliverableApi.uploadDeliverableLink called with:', {
        endpoint: `${BASE_URL}/admin/upload`,
        linkData: linkData
      });
      
      const response = await apiService.post(`${BASE_URL}/admin/upload`, linkData);
      console.log('adminDeliverableApi.uploadDeliverableLink response:', response);
      return response;
    } catch (error) {
      console.error('Error uploading deliverable link:', error);
      throw error;
    }
  },

  // Upload deliverable link (Admin only)
  uploadDeliverableLink: async (linkData) => {
    try {
      console.log('adminDeliverableApi.uploadDeliverableLink called with:', {
        endpoint: `${BASE_URL}/admin/upload`,
        linkData
      });
      
      const response = await apiService.post(`${BASE_URL}/admin/upload`, linkData);
      console.log('adminDeliverableApi.uploadDeliverableLink response:', response);
      return response;
    } catch (error) {
      console.error('Error uploading deliverable link:', error);
      throw error;
    }
  },

  // Get all deliverables by purchase ID (Admin only)
  getDeliverablesByPurchase: async (purchaseId) => {
    try {
      const response = await apiService.get(`${BASE_URL}/admin/${purchaseId}`);
      return response;
    } catch (error) {
      console.error('Error fetching deliverables by purchase:', error);
      throw error;
    }
  },

  // Get latest deliverables by purchase ID (Admin only)
  getLatestDeliverablesByPurchase: async (purchaseId) => {
    try {
      const response = await apiService.get(`${BASE_URL}/admin/${purchaseId}/latest`);
      return response;
    } catch (error) {
      console.error('Error fetching latest deliverables:', error);
      throw error;
    }
  },

  // Get deliverable version history (Admin only)
  getDeliverableHistory: async (purchaseId, featureName) => {
    try {
      const response = await apiService.get(`${BASE_URL}/admin/${purchaseId}/${encodeURIComponent(featureName)}/history`);
      return response;
    } catch (error) {
      console.error('Error fetching deliverable history:', error);
      throw error;
    }
  },

  // Update deliverable (Admin only) - Creates new version
  updateDeliverable: async (deliverableId, formData) => {
    try {
      const response = await apiService.put(`${BASE_URL}/admin/${deliverableId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error updating deliverable:', error);
      throw error;
    }
  },

  // Update deliverable status (Admin only)
  updateDeliverableStatus: async (deliverableId, status) => {
    try {
      const response = await apiService.put(`${BASE_URL}/admin/${deliverableId}/status`, { status });
      return response;
    } catch (error) {
      console.error('Error updating deliverable status:', error);
      throw error;
    }
  },

  // Get pending deliverables (Admin only)
  getPendingDeliverables: async () => {
    try {
      const response = await apiService.get(`${BASE_URL}/admin/pending`);
      return response;
    } catch (error) {
      console.error('Error fetching pending deliverables:', error);
      throw error;
    }
  },

  // Get all deliverables (Admin only)
  getAllDeliverables: async () => {
    try {
      const response = await apiService.get(`${BASE_URL}/admin/all`);
      return response;
    } catch (error) {
      console.error('Error fetching all deliverables:', error);
      throw error;
    }
  },

  // Download deliverable file
  downloadFile: (filePath) => {
    const baseUrl = API_CONFIG.BASE_URL;
    
    if (!filePath) {
      console.error('No file path provided for download');
      return '';
    }
    
    // Remove any leading slashes and normalize path separators
    const cleanPath = filePath.replace(/^[\/\\]+/, '').replace(/\\/g, '/');
    
    // If the path already includes 'uploads/', use it as is
    if (cleanPath.startsWith('uploads/')) {
      return `${baseUrl}/${cleanPath}`;
    }
    
    // If it's just a filename without path, prepend 'uploads/'
    if (!cleanPath.includes('/')) {
      return `${baseUrl}/uploads/${cleanPath}`;
    }
    
    // For any other relative path, prepend 'uploads/'
    return `${baseUrl}/uploads/${cleanPath}`;
  }
};
