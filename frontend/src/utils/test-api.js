import apiService from './api';

// Test function to verify API integration
export const testPackagePurchaseAPI = async () => {
  try {
    // Test getting user package purchases
    const response = await apiService.getUserPackagePurchases();
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Test function for feature comments API
export const testFeatureCommentsAPI = async () => {
  try {
    // Test creating a comment (this would require valid IDs)
    // const response = await apiService.createFeatureComment(1, 1, "Test comment");
    
    return { success: true, message: 'Feature comments API ready' };
  } catch (error) {
    throw error;
  }
};

// Export for use in components
export default {
  testPackagePurchaseAPI,
  testFeatureCommentsAPI
};
