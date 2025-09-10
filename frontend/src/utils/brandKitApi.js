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
      const hasWebsiteFiles = Array.isArray(stepData.website_files) && stepData.website_files.length > 0;
      const hasFiles = hasReferenceFiles || hasInspirationFiles || hasWebsiteFiles;
      
      if (hasFiles) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('currentStep', currentStep);
        
        // Add non-file data as JSON string
        const nonFileData = { ...stepData };
        delete nonFileData.reference_materials;
        delete nonFileData.inspiration_links;
        delete nonFileData.website_files;
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
        
        if (hasWebsiteFiles) {
          stepData.website_files.forEach(file => {
            formData.append('website_files', file);
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
    industry: 'industry',
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
    reason1: 'reason1',
    reason2: 'reason2',
    reason3: 'reason3',
    brandSoul: 'brand_soul',
    brandTone: 'brand_tone',
    brand1: 'brand1',
    brand2: 'brand2',
    brand3: 'brand3',
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
    timeline: 'timeline',
    approver: 'approver',
    mainContact: 'main_contact',
    referenceMaterials: 'reference_materials',
    spendingType: 'spending_type',
    secondaryAudience: 'secondary_audience',
    emotionalGoal: 'emotional_goal',
    cultureDescription: 'culture_description',
    businessStage: 'business_stage',
    purchaseMotivators: 'purchase_motivators',
    hasSocialMedia: 'has_social_media',
    socialMediaPlatforms: 'social_media_platforms',
    facebookUrl: 'facebook_url',
    instagramUrl: 'instagram_url',
    twitterUrl: 'twitter_url',
    linkedinUrl: 'linkedin_url',
    tiktokUrl: 'tiktok_url',
    youtubeUrl: 'youtube_url',
    pinterestUrl: 'pinterest_url',
    snapchatUsername: 'snapchat_username',
    otherSocialMediaUrls: 'other_social_media_urls',
    wantToCreateSocialMedia: 'want_to_create_social_media',
    desiredSocialMediaPlatforms: 'desired_social_media_platforms',
    hasWebsite: 'has_website',
    websiteFiles: 'website_files',
    websiteUrl: 'website_url',
    wantWebsite: 'want_website'
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
    industry: 'industry',
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
    reason1: 'reason1',
    reason2: 'reason2',
    reason3: 'reason3',
    brand_soul: 'brandSoul',
    brand_tone: 'brandTone',
    brand1: 'brand1',
    brand2: 'brand2',
    brand3: 'brand3',
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
    timeline: 'timeline',
    approver: 'approver',
    main_contact: 'mainContact',
    reference_materials: 'referenceMaterials',
    spending_type: 'spendingType',
    secondary_audience: 'secondaryAudience',
    emotional_goal: 'emotionalGoal',
    culture_description: 'cultureDescription',
    business_stage: 'businessStage',
    purchase_motivators: 'purchaseMotivators',
    has_social_media: 'hasSocialMedia',
    social_media_platforms: 'socialMediaPlatforms',
    facebook_url: 'facebookUrl',
    instagram_url: 'instagramUrl',
    twitter_url: 'twitterUrl',
    linkedin_url: 'linkedinUrl',
    tiktok_url: 'tiktokUrl',
    youtube_url: 'youtubeUrl',
    pinterest_url: 'pinterestUrl',
    snapchat_username: 'snapchatUsername',
    other_social_media_urls: 'otherSocialMediaUrls',
    want_to_create_social_media: 'wantToCreateSocialMedia',
    desired_social_media_platforms: 'desiredSocialMediaPlatforms',
    has_website: 'hasWebsite',
    website_files: 'websiteFiles',
    website_url: 'websiteUrl',
    want_website: 'wantWebsite'
  };

  for (const [dbKey, value] of Object.entries(dbData)) {
    const frontendKey = fieldMappings[dbKey] || dbKey;
    
    if (value !== undefined && value !== null) {
      // Handle special cases
      if (dbKey === 'primary_location') {
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            // For MapPicker, we want to display the address as a string
            transformed[frontendKey] = parsed.address || parsed.placeName || parsed.fullAddress || value;
          } catch (e) {
            transformed[frontendKey] = value;
          }
        } else if (typeof value === 'object') {
          // If it's already an object, extract the address
          transformed[frontendKey] = value.address || value.placeName || value.fullAddress || JSON.stringify(value);
        } else {
          transformed[frontendKey] = value;
        }
      } else if (dbKey === 'year_started') {
        // Convert number to string for Select component
        transformed[frontendKey] = value ? value.toString() : '';
      } else if (typeof value === 'string' && (value.startsWith('[') && value.endsWith(']'))) {
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