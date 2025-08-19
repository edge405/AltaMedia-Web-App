import authService from './authService.js';

class ProfileService {
  // Get user profile data
  async getProfile() {
    try {
      const response = await authService.getProfile();
      return response;
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      // Validate required fields
      const { fullname, phone_number, address } = profileData;
      
      if (!fullname && !phone_number && !address) {
        throw new Error('At least one field (fullname, phone_number, or address) must be provided');
      }

      // Prepare update data - only include fields that are provided
      const updateData = {};
      if (fullname !== undefined) updateData.fullname = fullname;
      if (phone_number !== undefined) updateData.phone_number = phone_number;
      if (address !== undefined) updateData.address = address;

      const response = await authService.updateProfile(updateData);
      
      // Update localStorage with new user data
      if (response.success && response.data) {
        const currentUser = authService.getCurrentUser();
        const updatedUser = { ...currentUser, ...response.data };
        authService.setUser(updatedUser);
      }
      
      return response;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  // Change user password
  async changePassword(currentPassword, newPassword) {
    try {
      // Validate password requirements
      if (!currentPassword || !newPassword) {
        throw new Error('Both currentPassword and newPassword are required');
      }

      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }

      const response = await authService.changePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }

  // Get current user data from localStorage
  getCurrentUser() {
    return authService.getCurrentUser();
  }

  // Check if user is authenticated
  isAuthenticated() {
    return authService.isAuthenticated();
  }

  // Format profile data for display
  formatProfileData(userData) {
    return {
      fullname: userData?.fullname || '',
      email: userData?.email || '',
      phone_number: userData?.phone_number || '',
      address: userData?.address || '',
      company: userData?.company || '',
      avatar: null // No avatar needed since we use dummy placeholders
    };
  }

  // Validate profile data
  validateProfileData(profileData) {
    const errors = [];

    if (profileData.email && !this.isValidEmail(profileData.email)) {
      errors.push('Invalid email format');
    }

    if (profileData.phone_number && !this.isValidPhone(profileData.phone_number)) {
      errors.push('Invalid phone number format');
    }

    if (profileData.fullname && profileData.fullname.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }

    return errors;
  }

  // Email validation helper
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation helper
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Load profile data from API or localStorage
  async loadProfileData() {
    try {
      // First try to get from API
      const response = await this.getProfile();
      if (response.success && response.data) {
        return this.formatProfileData(response.data);
      }
    } catch (error) {
      console.warn('Failed to load profile from API, using localStorage data:', error);
    }

    // Fallback to localStorage
    const currentUser = this.getCurrentUser();
    return this.formatProfileData(currentUser);
  }
}

// Create and export a singleton instance
const profileService = new ProfileService();
export default profileService;
