import apiService from './api';
import { brandKitApi } from './brandKitApi';
import { getFormData as getProductServiceData } from './productServiceApi';
import { organizationApi } from './organizationApi';

/**
 * Form Status API utilities
 * Handles checking completion status for all form types
 */
export const formStatusApi = {
  /**
   * Check if user has completed any form
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Object with completion status for each form type
   */
  checkAllFormStatus: async (userId) => {
    try {
      const status = {
        business: { completed: false, currentStep: 0, totalSteps: 11 },
        product: { completed: false, currentStep: 0, totalSteps: 5 },
        organization: { completed: false, currentStep: 0, totalSteps: 4 }
      };

      // Check Business/Company form (KnowingYouForm)
      try {
        const businessResponse = await brandKitApi.getFormData(userId);
        if (businessResponse.success && businessResponse.data?.currentStep) {
          status.business.currentStep = businessResponse.data.currentStep;
          status.business.completed = businessResponse.data.currentStep === 11;
        }
      } catch (error) {
        console.log('No business form data found');
      }

      // Check Product/Service form
      try {
        const productResponse = await getProductServiceData(userId);
        if (productResponse.success && productResponse.data?.currentStep) {
          status.product.currentStep = productResponse.data.currentStep;
          status.product.completed = productResponse.data.currentStep === 5;
        }
      } catch (error) {
        console.log('No product service form data found');
      }

      // Check Organization form
      try {
        const organizationResponse = await organizationApi.getFormData(userId);
        if (organizationResponse.success && organizationResponse.data?.currentStep) {
          status.organization.currentStep = organizationResponse.data.currentStep;
          status.organization.completed = organizationResponse.data.currentStep === 4;
        }
      } catch (error) {
        console.log('No organization form data found');
      }

      return {
        success: true,
        data: status,
        hasAnyCompleted: Object.values(status).some(form => form.completed)
      };
    } catch (error) {
      console.error('Error checking form status:', error);
      return {
        success: false,
        error: error.message,
        data: {
          business: { completed: false, currentStep: 0, totalSteps: 11 },
          product: { completed: false, currentStep: 0, totalSteps: 5 },
          organization: { completed: false, currentStep: 0, totalSteps: 4 }
        },
        hasAnyCompleted: false
      };
    }
  },

  /**
   * Check if user has completed at least one form
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} True if any form is completed
   */
  hasAnyCompletedForm: async (userId) => {
    try {
      const status = await formStatusApi.checkAllFormStatus(userId);
      return status.hasAnyCompleted;
    } catch (error) {
      console.error('Error checking if any form is completed:', error);
      return false;
    }
  }
};
