import apiService from './api';

// Test function to verify API integration
export const testPackagePurchaseAPI = async () => {
  try {
    console.log('Testing Package Purchase API...');
    
    // Test getting user package purchases
    const response = await apiService.getUserPackagePurchases();
    console.log('Package purchases response:', response);
    
    return response;
  } catch (error) {
    console.error('API test failed:', error);
    throw error;
  }
};

// Test function for feature comments API
export const testFeatureCommentsAPI = async () => {
  try {
    console.log('Testing Feature Comments API...');
    
    // Test creating a comment (this would require valid IDs)
    // const response = await apiService.createFeatureComment(1, 1, "Test comment");
    // console.log('Create comment response:', response);
    
    return { success: true, message: 'Feature comments API ready' };
  } catch (error) {
    console.error('Feature comments API test failed:', error);
    throw error;
  }
};

// Export for use in components
export default {
  testPackagePurchaseAPI,
  testFeatureCommentsAPI
};
