/**
 * Form Validation Utility
 * Contains validation functions for all forms to ensure required fields are filled
 */

// Validation functions for each form step
export const validateBrandKitFormStep = (step, formData) => {
  const errors = [];

  switch (step) {
    case 1:
      if (!formData.buildingType) {
        errors.push('Please select what you are building');
      }
      if (!formData.businessEmail) {
        errors.push('Business email is required');
      } else if (!isValidEmail(formData.businessEmail)) {
        errors.push('Please enter a valid email address');
      }
      if (!formData.businessName) {
        errors.push('Business name is required');
      }
      break;

    case 2:
      if (!formData.industry || formData.industry.length === 0) {
        errors.push('Please select at least one industry or niche');
      }
      if (!formData.yearStarted) {
        errors.push('Please select the year your business started');
      }
      if (!formData.primaryLocation) {
        errors.push('Primary location is required');
      }
      if (!formData.wantToAttract) {
        errors.push('Please describe who you want to attract');
      }
      break;

    case 3:
      if (!formData.desiredEmotion) {
        errors.push('Please select the desired emotion for your audience');
      }
      break;

    case 4:
      // Step 4 has no required fields
      break;

    case 5:
      if (!formData.reason1) {
        errors.push('Please provide at least one reason for your brand');
      }
      if (!formData.brandSoul) {
        errors.push('Brand soul is required');
      }
      break;

    case 6:
      if (!formData.hasLogo) {
        errors.push('Please indicate if you have a logo');
      }
      break;

    case 7:
      if (!formData.brandKitUse || formData.brandKitUse.length === 0) {
        errors.push('Please select how you will use your brand kit');
      }
      break;

    case 8:
      if (!formData.primaryGoal) {
        errors.push('Primary goal is required');
      }
      break;

    case 9:
      if (!formData.businessDescription) {
        errors.push('Business description is required');
      }
      break;

    case 10:
      if (!formData.timeline) {
        errors.push('Timeline is required');
      }
      break;

    case 11:
      // Step 11 has no required fields (upload references is optional)
      break;

    default:
      break;
  }

  return errors;
};

export const validateBrandKitQuestionnaireStep = (step, formData) => {
  // Temporarily disabled validation - return empty array
  return [];
};

export const validateOrganizationFormStep = (step, formData) => {
  const errors = [];

  switch (step) {
    case 1:
      if (!formData.organizationName) {
        errors.push('Organization name is required');
      }
      if (!formData.socialMediaGoals) {
        errors.push('Social media goals are required');
      }
      if (!formData.brandUniqueness) {
        errors.push('Please describe what makes your brand unique');
      }
      break;

    case 2:
      if (!formData.desiredEmotion) {
        errors.push('Please select the desired emotion');
      }
      if (!formData.targetPlatforms || formData.targetPlatforms.length === 0) {
        errors.push('Please select at least one target platform');
      }
      if (!formData.contentTypes || formData.contentTypes.length === 0) {
        errors.push('Please select at least one content type');
      }
      break;

    case 3:
      if (!formData.deliverables || formData.deliverables.length === 0) {
        errors.push('Please select at least one deliverable');
      }
      if (!formData.timeline) {
        errors.push('Timeline is required');
      }
      break;

    case 4:
      if (!formData.mainContact) {
        errors.push('Main contact person is required');
      }
      break;

    default:
      break;
  }

  return errors;
};

// Helper function to validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate required text fields
export const isRequiredFieldFilled = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return !!value;
};

// Helper function to validate required array fields
export const isRequiredArrayFilled = (array) => {
  return Array.isArray(array) && array.length > 0;
};

// Generic validation function that can be used across all forms
export const validateFormStep = (formType, step, formData) => {
  switch (formType) {
    case 'brandKit':
      return validateBrandKitFormStep(step, formData);
    case 'brandKitQuestionnaire':
      return validateBrandKitQuestionnaireStep(step, formData);
    case 'organization':
      return validateOrganizationFormStep(step, formData);
    default:
      return [];
  }
};

// Function to check if a step can be proceeded to next
export const canProceedToNext = (formType, step, formData) => {
  const errors = validateFormStep(formType, step, formData);
  return errors.length === 0;
};

// Function to get validation error messages
export const getValidationErrors = (formType, step, formData) => {
  return validateFormStep(formType, step, formData);
};
