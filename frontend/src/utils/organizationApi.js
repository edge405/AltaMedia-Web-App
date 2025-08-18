import apiService from './api';

/**
 * Organization Form API utilities
 */
export const organizationApi = {
  /**
   * Save form data for a specific step
   * @param {number} userId - User ID
   * @param {Object} stepData - Form data for the current step
   * @param {number} currentStep - Current step number (1-4)
   * @returns {Promise<Object>} API response
   */
  saveFormData: async (userId, stepData, currentStep) => {
    try {
      console.log('🔍 Frontend API - stepData:', stepData);
      console.log('🔍 Frontend API - referenceMaterials:', stepData.referenceMaterials);
      console.log('🔍 Frontend API - referenceMaterials type:', typeof stepData.referenceMaterials);
      console.log('🔍 Frontend API - referenceMaterials is array:', Array.isArray(stepData.referenceMaterials));
      
      if (Array.isArray(stepData.referenceMaterials)) {
        stepData.referenceMaterials.forEach((file, index) => {
          console.log(`🔍 Frontend API - file ${index}:`, file);
          console.log(`🔍 Frontend API - file ${index} instanceof File:`, file instanceof File);
          console.log(`🔍 Frontend API - file ${index} constructor:`, file.constructor.name);
        });
      }
      
      // Transform frontend data to database format first
      const transformedData = transformToDatabaseFormat(stepData);
      
      // Check if there are files to upload (check for actual File objects)
      const hasReferenceFiles = Array.isArray(stepData.referenceMaterials) && 
        stepData.referenceMaterials.length > 0 && 
        stepData.referenceMaterials.some(file => file instanceof File);
      const hasFiles = hasReferenceFiles;
      
      console.log('🔍 Frontend API - hasReferenceFiles:', hasReferenceFiles);
      console.log('🔍 Frontend API - hasFiles:', hasFiles);
      
      if (hasFiles) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('currentStep', currentStep);
        
        // Add non-file data as JSON string (use transformed data)
        const nonFileData = { ...transformedData };
        delete nonFileData.reference_materials;
        formData.append('stepData', JSON.stringify(nonFileData));
        
        // Add files
        if (hasReferenceFiles) {
          stepData.referenceMaterials.forEach(file => {
            if (file instanceof File) {
              formData.append('reference_materials', file);
            }
          });
        }
        
        const response = await apiService.putFormData('/organization/save', formData);
        return response;
      } else {
        // Use regular JSON for non-file data
        const response = await apiService.put('/organization/save', {
          userId,
          stepData: transformedData,
          currentStep
        });
        return response;
      }
    } catch (error) {
      console.error('Error saving organization form data:', error);
      throw new Error(error.message || 'Failed to save organization form data');
    }
  },

  /**
   * Get form data for a user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} API response with form data
   */
  getFormData: async (userId) => {
    try {
      const response = await apiService.get(`/organization/data/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching organization form data:', error);
      throw new Error(error.message || 'Failed to fetch organization form data');
    }
  }
};

/**
 * Transform frontend form data to database format
 * @param {Object} frontendData - Frontend form data (camelCase)
 * @returns {Object} Database format data (snake_case)
 */
export const transformToDatabaseFormat = (frontendData) => {
  const transformed = {};
  
  // Map frontend field names to database field names
  const fieldMappings = {
    buildingType: 'building_type',
    organizationName: 'organization_name',
    socialMediaGoals: 'social_media_goals',
    brandUniqueness: 'brand_uniqueness',
    desiredEmotion: 'desired_emotion',
    targetPlatforms: 'target_platforms',
    contentTypes: 'content_types',
    deliverables: 'deliverables',
    timeline: 'timeline',
    mainContact: 'main_contact',
    additionalInfo: 'additional_info',
    referenceMaterials: 'reference_materials'
  };

  for (const [frontendKey, value] of Object.entries(frontendData)) {
    const dbKey = fieldMappings[frontendKey] || frontendKey;
    
    if (value !== undefined && value !== null) {
      // Handle special cases
      if (Array.isArray(value) && value.length === 0) {
        transformed[dbKey] = null;
      } else {
        transformed[dbKey] = value;
      }
    }
  }

  return transformed;
};

/**
 * Transform database format data to frontend format
 * @param {Object} dbData - Database format data (snake_case)
 * @returns {Object} Frontend format data (camelCase)
 */
export const transformToFrontendFormat = (dbData) => {
  const transformed = {};
  
  // Map database field names to frontend field names
  const fieldMappings = {
    building_type: 'buildingType',
    organization_name: 'organizationName',
    social_media_goals: 'socialMediaGoals',
    brand_uniqueness: 'brandUniqueness',
    desired_emotion: 'desiredEmotion',
    target_platforms: 'targetPlatforms',
    content_types: 'contentTypes',
    deliverables: 'deliverables',
    timeline: 'timeline',
    main_contact: 'mainContact',
    additional_info: 'additionalInfo',
    reference_materials: 'referenceMaterials'
  };

  for (const [dbKey, value] of Object.entries(dbData)) {
    const frontendKey = fieldMappings[dbKey] || dbKey;
    
    if (value !== undefined && value !== null) {
      // Handle special cases
      if (dbKey === 'reference_materials' && typeof value === 'string') {
        try {
          // Try to parse as JSON first (for new format)
          const parsed = JSON.parse(value);
          transformed[frontendKey] = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          // Fallback to comma-separated string (for old format)
          if (value.includes(',')) {
            transformed[frontendKey] = value.split(',').filter(path => path.trim());
          } else {
            transformed[frontendKey] = value ? [value] : [];
          }
        }
      } else {
        transformed[frontendKey] = value;
      }
    }
  }

  return transformed;
};
