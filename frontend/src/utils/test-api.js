import apiService from './api';

// Test function to verify API integration
export const testPackagePurchaseAPI = async () => {
  try {
    // Package purchase API has been removed
    return { success: false, message: 'Package purchase API has been removed' };
  } catch (error) {
    throw error;
  }
};

// Test function for feature comments API
export const testFeatureCommentsAPI = async () => {
  try {
    // Feature comments API has been removed
    return { success: false, message: 'Feature comments API has been removed' };
  } catch (error) {
    throw error;
  }
};

// Export for use in components
export default {
  testPackagePurchaseAPI,
  testFeatureCommentsAPI
};
