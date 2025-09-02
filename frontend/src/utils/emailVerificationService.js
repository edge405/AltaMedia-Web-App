import API_CONFIG from '@/config/api';

/**
 * Email Verification Service
 * Handles all email verification related API calls
 */

class EmailVerificationService {
  /**
   * Send verification code to email
   * @param {string} email - Email address to verify
   * @param {string} businessName - Business name (optional)
   * @returns {Promise<Object>} API response
   */
  static async sendVerificationCode(email, businessName = '') {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/email-verification/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, businessName }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending verification code:', error);
      return {
        success: false,
        message: 'Failed to send verification code. Please try again.'
      };
    }
  }

  /**
   * Verify email with verification code
   * @param {string} email - Email address
   * @param {string} verificationCode - 6-digit verification code
   * @returns {Promise<Object>} API response
   */
  static async verifyCode(email, verificationCode) {
    try {
      console.log('🔍 Sending verification request:', { email, verificationCode });
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/email-verification/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verifying code:', error);
      return {
        success: false,
        message: 'Failed to verify code. Please try again.'
      };
    }
  }

  /**
   * Check email verification status
   * @param {string} email - Email address to check
   * @returns {Promise<Object>} API response
   */
  static async checkVerificationStatus(email) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/email-verification/check/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking verification status:', error);
      return {
        success: false,
        message: 'Failed to check verification status.'
      };
    }
  }
}

export default EmailVerificationService;
