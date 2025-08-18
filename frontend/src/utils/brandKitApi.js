import apiService from './api';

/**
 * BrandKit Form API utilities
 */
export const brandKitApi = {
  /**
   * Save form data for a specific step
   * @param {number} userId - User ID
   * @param {Object} stepData - Form data for the current step
   * @param {number} currentStep - Current step number (1-11)
   * @returns {Promise<Object>} API response
   */
  saveFormData: async (userId, stepData, currentStep) => {
    try {
      // Check if there are files to upload (ensure they are arrays and have files)
      const hasReferenceFiles = Array.isArray(stepData.reference_materials) && stepData.reference_materials.length > 0;
      const hasInspirationFiles = Array.isArray(stepData.inspiration_links) && stepData.inspiration_links.length > 0;
      const hasFiles = hasReferenceFiles || hasInspirationFiles;
      
      if (hasFiles) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('currentStep', currentStep);
        
        // Add non-file data as JSON string
        const nonFileData = { ...stepData };
        delete nonFileData.reference_materials;
        delete nonFileData.inspiration_links;
        formData.append('stepData', JSON.stringify(nonFileData));
        
        // Add files
        if (hasReferenceFiles) {
          stepData.reference_materials.forEach(file => {
            formData.append('reference_materials', file);
          });
        }
        
        if (hasInspirationFiles) {
          stepData.inspiration_links.forEach(file => {
            formData.append('inspiration_links', file);
          });
        }
        
        const response = await apiService.putFormData('/brandkit/save', formData);
        return response;
      } else {
        // Use regular JSON for non-file data
        const response = await apiService.put('/brandkit/save', {
          userId,
          stepData,
          currentStep
        });
        return response;
      }
    } catch (error) {
      console.error('Error saving form data:', error);
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
      const response = await apiService.get(`/brandkit/data/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching form data:', error);
      throw new Error(error.message || 'Failed to fetch form data');
    }
  },

  /**
   * Check if user has completed the form
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} True if form is completed (step 11), false otherwise
   */
  isFormCompleted: async (userId) => {
    try {
      const response = await apiService.get(`/brandkit/data/${userId}`);
      if (response.success && response.data?.currentStep) {
        return response.data.currentStep === 11;
      }
      return false;
    } catch (error) {
      console.error('Error checking form completion:', error);
      return false;
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
    businessEmail: 'business_email',
    hasProventousId: 'has_proventous_id',
    proventousId: 'proventous_id',
    businessName: 'business_name',
    contactNumber: 'contact_number',
    preferredContact: 'preferred_contact',
    yearStarted: 'year_started',
    primaryLocation: 'primary_location',
    behindBrand: 'behind_brand',
    currentCustomers: 'current_customers',
    wantToAttract: 'want_to_attract',
    teamDescription: 'team_description',
    desiredEmotion: 'desired_emotion',
    targetProfessions: 'target_professions',
    reachLocations: 'reach_locations',
    ageGroups: 'age_groups',
    spendingHabits: 'spending_habits',
    interactionMethods: 'interaction_methods',
    customerChallenges: 'customer_challenges',
    customerMotivation: 'customer_motivation',
    audienceBehavior: 'audience_behavior',
    customerChoice: 'customer_choice',
    cultureWords: 'culture_words',
    teamTraditions: 'team_traditions',
    teamHighlights: 'team_highlights',
    brandSoul: 'brand_soul',
    brandTone: 'brand_tone',
    brandAvoid: 'brand_avoid',
    missionStatement: 'mission_statement',
    longTermVision: 'long_term_vision',
    coreValues: 'core_values',
    brandPersonality: 'brand_personality',
    hasLogo: 'has_logo',
    logoAction: 'logo_action',
    preferredColors: 'preferred_colors',
    colorsToAvoid: 'colors_to_avoid',
    fontStyles: 'font_styles',
    designStyle: 'design_style',
    logoType: 'logo_type',
    imageryStyle: 'imagery_style',
    inspirationLinks: 'inspiration_links',
    brandKitUse: 'brand_kit_use',
    brandElements: 'brand_elements',
    fileFormats: 'file_formats',
    primaryGoal: 'primary_goal',
    shortTermGoals: 'short_term_goals',
    midTermGoals: 'mid_term_goals',
    longTermGoal: 'long_term_goal',
    bigPictureVision: 'big_picture_vision',
    successMetrics: 'success_metrics',
    businessDescription: 'business_description',
    inspiration: 'inspiration',
    targetInterests: 'target_interests',
    currentInterests: 'current_interests',
    specialNotes: 'special_notes',
    approver: 'approver',
    referenceMaterials: 'reference_materials',
    spendingType: 'spending_type',
    secondaryAudience: 'secondary_audience',
    emotionalGoal: 'emotional_goal',
    cultureDescription: 'culture_description',
    businessStage: 'business_stage'
  };

  for (const [frontendKey, value] of Object.entries(frontendData)) {
    const dbKey = fieldMappings[frontendKey] || frontendKey;
    
    if (value !== undefined && value !== null) {
      // Handle special cases
      if (dbKey === 'primary_location' && typeof value === 'string') {
        try {
          transformed[dbKey] = JSON.parse(value);
        } catch (e) {
          transformed[dbKey] = value;
        }
      } else if (dbKey === 'year_started' && typeof value === 'string') {
        transformed[dbKey] = parseInt(value) || null;
      } else if (Array.isArray(value) && value.length === 0) {
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
    business_email: 'businessEmail',
    has_proventous_id: 'hasProventousId',
    proventous_id: 'proventousId',
    business_name: 'businessName',
    contact_number: 'contactNumber',
    preferred_contact: 'preferredContact',
    year_started: 'yearStarted',
    primary_location: 'primaryLocation',
    behind_brand: 'behindBrand',
    current_customers: 'currentCustomers',
    want_to_attract: 'wantToAttract',
    team_description: 'teamDescription',
    desired_emotion: 'desiredEmotion',
    target_professions: 'targetProfessions',
    reach_locations: 'reachLocations',
    age_groups: 'ageGroups',
    spending_habits: 'spendingHabits',
    interaction_methods: 'interactionMethods',
    customer_challenges: 'customerChallenges',
    customer_motivation: 'customerMotivation',
    audience_behavior: 'audienceBehavior',
    customer_choice: 'customerChoice',
    culture_words: 'cultureWords',
    team_traditions: 'teamTraditions',
    team_highlights: 'teamHighlights',
    brand_soul: 'brandSoul',
    brand_tone: 'brandTone',
    brand_avoid: 'brandAvoid',
    mission_statement: 'missionStatement',
    long_term_vision: 'longTermVision',
    core_values: 'coreValues',
    brand_personality: 'brandPersonality',
    has_logo: 'hasLogo',
    logo_action: 'logoAction',
    preferred_colors: 'preferredColors',
    colors_to_avoid: 'colorsToAvoid',
    font_styles: 'fontStyles',
    design_style: 'designStyle',
    logo_type: 'logoType',
    imagery_style: 'imageryStyle',
    inspiration_links: 'inspirationLinks',
    brand_kit_use: 'brandKitUse',
    brand_elements: 'brandElements',
    file_formats: 'fileFormats',
    primary_goal: 'primaryGoal',
    short_term_goals: 'shortTermGoals',
    mid_term_goals: 'midTermGoals',
    long_term_goal: 'longTermGoal',
    big_picture_vision: 'bigPictureVision',
    success_metrics: 'successMetrics',
    business_description: 'businessDescription',
    inspiration: 'inspiration',
    target_interests: 'targetInterests',
    current_interests: 'currentInterests',
    special_notes: 'specialNotes',
    approver: 'approver',
    reference_materials: 'referenceMaterials',
    spending_type: 'spendingType',
    secondary_audience: 'secondaryAudience',
    emotional_goal: 'emotionalGoal',
    culture_description: 'cultureDescription',
    business_stage: 'businessStage'
  };

  for (const [dbKey, value] of Object.entries(dbData)) {
    const frontendKey = fieldMappings[dbKey] || dbKey;
    
    if (value !== undefined && value !== null) {
      // Handle special cases
      if (dbKey === 'primary_location' && typeof value === 'string') {
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