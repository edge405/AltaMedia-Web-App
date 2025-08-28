import apiService from './api';

/**
 * BrandKit Questionnaire Form API utilities
 */
export const brandKitQuestionnaireApi = {
  /**
   * Save form data for a specific step
   * @param {number} userId - User ID
   * @param {Object} stepData - Form data for the current step
   * @param {number} currentStep - Current step number
   * @returns {Promise<Object>} API response
   */
  saveFormData: async (userId, stepData, currentStep) => {
    try {
      // Check if there are files to upload (check original frontend format - camelCase)
      const hasBrandLogo = Array.isArray(stepData.brandLogo) && stepData.brandLogo.length > 0;
      const hasReferenceFiles = Array.isArray(stepData.referenceMaterials) && stepData.referenceMaterials.length > 0;
      const hasWebPageFiles = Array.isArray(stepData.webPageUpload) && stepData.webPageUpload.length > 0;
      const hasFiles = hasBrandLogo || hasReferenceFiles || hasWebPageFiles;

      console.log('📁 File upload check:', {
        hasBrandLogo,
        hasReferenceFiles,
        hasWebPageFiles,
        hasFiles,
        brandLogo: stepData.brandLogo,
        referenceMaterials: stepData.referenceMaterials,
        webPageUpload: stepData.webPageUpload
      });

      if (hasFiles) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('currentStep', currentStep);
        
        // Transform frontend data to database format
        const transformedStepData = transformToDatabaseFormat(stepData);
        
        // Add non-file data as JSON string (already transformed)
        const nonFileData = { ...transformedStepData };
        delete nonFileData.brand_logo;
        delete nonFileData.reference_materials;
        delete nonFileData.web_page_upload;
        formData.append('stepData', JSON.stringify(nonFileData));
        
        // Add files (use original stepData, not transformed)
        if (hasBrandLogo) {
          stepData.brandLogo.forEach(file => {
            formData.append('brand_logo', file);
          });
        }
        
        if (hasReferenceFiles) {
          stepData.referenceMaterials.forEach(file => {
            formData.append('reference_materials', file);
          });
        }
        
        if (hasWebPageFiles) {
          stepData.webPageUpload.forEach(file => {
            formData.append('web_page_upload', file);
          });
        }
        
        console.log('📁 Sending FormData with files:', {
          userId,
          currentStep,
          nonFileDataKeys: Object.keys(nonFileData),
          brandLogoFiles: hasBrandLogo ? stepData.brandLogo.length : 0,
          referenceFiles: hasReferenceFiles ? stepData.referenceMaterials.length : 0,
          webPageFiles: hasWebPageFiles ? stepData.webPageUpload.length : 0
        });
        
        const response = await apiService.putFormData('/brandkit-questionnaire/save', formData);
        return response;
      } else {
        // Transform frontend data to database format for non-file data
        const transformedStepData = transformToDatabaseFormat(stepData);
        
        console.log('📁 Sending JSON data (no files):', {
          userId,
          currentStep,
          dataKeys: Object.keys(transformedStepData)
        });
        
        // Use regular JSON for non-file data (already transformed)
        const response = await apiService.put('/brandkit-questionnaire/save', {
          userId,
          stepData: transformedStepData,
          currentStep
        });
        return response;
      }
    } catch (error) {
      console.error('Error saving BrandKit Questionnaire form data:', error);
      throw new Error(error.message || 'Failed to save form data');
    }
  },

  /**
   * Get form data for a user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} API response with form data
   */
     getFormData: async (userId) => {
     try {
       const response = await apiService.get(`/brandkit-questionnaire/data/${userId}`);
       
       // Transform database data to frontend format if data exists
       if (response.success && response.data?.formData) {
         response.data.formData = transformToFrontendFormat(response.data.formData);
       }
       
       return response;
     } catch (error) {
       console.error('Error fetching BrandKit Questionnaire form data:', error);
       throw new Error(error.message || 'Failed to fetch form data');
     }
   },

  /**
   * Check if user has completed the form
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} True if form is completed (step 9), false otherwise
   */
  isFormCompleted: async (userId) => {
    try {
      const response = await apiService.get(`/brandkit-questionnaire/data/${userId}`);
      if (response.success && response.data?.currentStep) {
        return response.data.currentStep === 9;
      }
      return false;
    } catch (error) {
      console.error('Error checking BrandKit Questionnaire form completion:', error);
      return false;
    }
  },

  /**
   * Mark form as completed
   * @param {number} userId - User ID
   * @returns {Promise<Object>} API response
   */
  completeForm: async (userId) => {
    try {
      const response = await apiService.put(`/brandkit-questionnaire/complete/${userId}`);
      return response;
    } catch (error) {
      console.error('Error completing BrandKit Questionnaire form:', error);
      throw new Error(error.message || 'Failed to complete form');
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
    // Step 1: Brand Identity
    brandName: 'brand_name',
    brandDescription: 'brand_description',
    
    // Step 2: Target Audience & Positioning
    primaryCustomers: 'primary_customers',
    desiredEmotion: 'desired_emotion',
    unfairAdvantage: 'unfair_advantage',
    customerMiss: 'customer_miss',
    problemSolved: 'problem_solved',
    
    // Step 3: Competitive Landscape
    competitors: 'competitors',
    competitorLikes: 'competitor_likes',
    competitorDislikes: 'competitor_dislikes',
    brandDifferentiation: 'brand_differentiation',
    
    // Step 4: Applications & Use Cases
    brandKitUse: 'brand_kit_use',
    templates: 'templates',
    internalAssets: 'internal_assets',
    fileFormats: 'file_formats',
    culturalAdaptation: 'cultural_adaptation',
    
    // Step 5: Brand Voice & Personality
    brandVoice: 'brand_voice',
    admiredBrands: 'admired_brands',
    inspirationBrand: 'inspiration_brand',
    communicationPerception: 'communication_perception',
    
    // Step 6: Visual Preferences
    brandLogo: 'brand_logo',
    logoRedesign: 'logo_redesign',
    hasExistingColors: 'has_existing_colors',
    existingColors: 'existing_colors',
    preferredColors: 'preferred_colors',
    colorsToAvoid: 'colors_to_avoid',
    imageryStyle: 'imagery_style',
    fontTypes: 'font_types',
    fontStyles: 'font_styles',
    legalConsiderations: 'legal_considerations',
    
    // Step 7: Technical Deliverables
    sourceFiles: 'source_files',
    requiredFormats: 'required_formats',
    
    // Step 8: Inspiration & References
    referenceMaterials: 'reference_materials',
    inspirationBrands: 'inspiration_brands',
    brandVibe: 'brand_vibe',
    
    // Step 9: Closing Information
    brandWords: 'brand_words',
    brandAvoidWords: 'brand_avoid_words',
    tagline: 'tagline',
    mission: 'mission',
    vision: 'vision',
    coreValues: 'core_values',
    hasWebPage: 'has_web_page',
    webPageUpload: 'web_page_upload',
    wantWebPage: 'want_web_page'
  };

  // List of metadata fields to exclude from transformation
  const metadataFields = [
    'id', 'user_id', 'current_step', 'progress_percentage', 'is_completed', 
    'created_at', 'updated_at', 'user_id'
  ];

  for (const [frontendKey, value] of Object.entries(frontendData)) {
    const dbKey = fieldMappings[frontendKey] || frontendKey;
    
    // Skip metadata fields and only include actual form fields
    if (metadataFields.includes(dbKey)) {
      continue;
    }
    
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
    // Step 1: Brand Identity
    brand_name: 'brandName',
    brand_description: 'brandDescription',
    
    // Step 2: Target Audience & Positioning
    primary_customers: 'primaryCustomers',
    desired_emotion: 'desiredEmotion',
    unfair_advantage: 'unfairAdvantage',
    customer_miss: 'customerMiss',
    problem_solved: 'problemSolved',
    
    // Step 3: Competitive Landscape
    competitors: 'competitors',
    competitor_likes: 'competitorLikes',
    competitor_dislikes: 'competitorDislikes',
    brand_differentiation: 'brandDifferentiation',
    
    // Step 4: Applications & Use Cases
    brand_kit_use: 'brandKitUse',
    templates: 'templates',
    internal_assets: 'internalAssets',
    file_formats: 'fileFormats',
    cultural_adaptation: 'culturalAdaptation',
    
    // Step 5: Brand Voice & Personality
    brand_voice: 'brandVoice',
    admired_brands: 'admiredBrands',
    inspiration_brand: 'inspirationBrand',
    communication_perception: 'communicationPerception',
    
    // Step 6: Visual Preferences
    brand_logo: 'brandLogo',
    logo_redesign: 'logoRedesign',
    has_existing_colors: 'hasExistingColors',
    existing_colors: 'existingColors',
    preferred_colors: 'preferredColors',
    colors_to_avoid: 'colorsToAvoid',
    imagery_style: 'imageryStyle',
    font_types: 'fontTypes',
    font_styles: 'fontStyles',
    legal_considerations: 'legalConsiderations',
    
    // Step 7: Technical Deliverables
    source_files: 'sourceFiles',
    required_formats: 'requiredFormats',
    
    // Step 8: Inspiration & References
    reference_materials: 'referenceMaterials',
    inspiration_brands: 'inspirationBrands',
    brand_vibe: 'brandVibe',
    
    // Step 9: Closing Information
    brand_words: 'brandWords',
    brand_avoid_words: 'brandAvoidWords',
    tagline: 'tagline',
    mission: 'mission',
    vision: 'vision',
    core_values: 'coreValues',
    has_web_page: 'hasWebPage',
    web_page_upload: 'webPageUpload',
    want_web_page: 'wantWebPage'
  };

  // List of metadata fields to exclude from transformation
  const metadataFields = [
    'id', 'user_id', 'current_step', 'progress_percentage', 'is_completed', 
    'created_at', 'updated_at'
  ];

  for (const [dbKey, value] of Object.entries(dbData)) {
    // Skip metadata fields and only include actual form fields
    if (metadataFields.includes(dbKey)) {
      continue;
    }
    
    const frontendKey = fieldMappings[dbKey] || dbKey;
    
    if (value !== undefined && value !== null) {
      // Handle special cases
      if (typeof value === 'string' && (value.startsWith('[') && value.endsWith(']'))) {
        // Try to parse JSON strings back to arrays
        try {
          transformed[frontendKey] = JSON.parse(value);
        } catch (e) {
          transformed[frontendKey] = value;
        }
      } else if (typeof value === 'string' && (value.startsWith('{') && value.endsWith('}'))) {
        // Try to parse JSON objects
        try {
          transformed[frontendKey] = JSON.parse(value);
        } catch (e) {
          transformed[frontendKey] = value;
        }
      } else {
        transformed[frontendKey] = value;
      }
    }
  }

  return transformed;
};
