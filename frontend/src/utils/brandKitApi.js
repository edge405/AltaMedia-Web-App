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
      const response = await apiService.put('/brandkit/save', {
        userId,
        stepData,
        currentStep
      });
      return response;
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
  }
};

/**
 * Transform frontend form data to database format
 * @param {Object} frontendData - Frontend form data (camelCase)
 * @returns {Object} Database format data (snake_case)
 */
export const transformToDatabaseFormat = (frontendData) => {
  const fieldMappings = {
    // Step 1: Business Basics
    buildingType: 'building_type',
    businessEmail: 'business_email',
    hasProventousId: 'has_proventous_id',
    proventousId: 'proventous_id',
    businessName: 'business_name',

    // Step 2: About Your Business
    contactNumber: 'contact_number',
    preferredContact: 'preferred_contact',
    industry: 'industry',
    yearStarted: 'year_started',
    primaryLocation: 'primary_location',
    behindBrand: 'behind_brand',
    currentCustomers: 'current_customers',
    wantToAttract: 'want_to_attract',
    teamDescription: 'team_description',

    // Step 3: Audience Clarity
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

    // Step 4: Team & Culture
    cultureWords: 'culture_words',
    teamTraditions: 'team_traditions',
    teamHighlights: 'team_highlights',

    // Step 5: Brand Identity
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

    // Step 6: Visual Direction
    hasLogo: 'has_logo',
    logoAction: 'logo_action',
    preferredColors: 'preferred_colors',
    colorsToAvoid: 'colors_to_avoid',
    fontStyles: 'font_styles',
    designStyle: 'design_style',
    logoType: 'logo_type',
    imageryStyle: 'imagery_style',
    inspirationLinks: 'inspiration_links',

    // Step 7: Collateral Needs
    brandKitUse: 'brand_kit_use',
    brandElements: 'brand_elements',
    fileFormats: 'file_formats',

    // Step 8: Business Goals
    primaryGoal: 'primary_goal',
    shortTermGoals: 'short_term_goals',
    midTermGoals: 'mid_term_goals',
    longTermGoal: 'long_term_goal',
    bigPictureVision: 'big_picture_vision',
    successMetrics: 'success_metrics',

    // Step 9: AI-Powered Insights
    businessDescription: 'business_description',
    inspiration: 'inspiration',
    targetInterests: 'target_interests',
    currentInterests: 'current_interests',

    // Step 10: Wrap-Up
    specialNotes: 'special_notes',
    timeline: 'timeline',
    approver: 'approver',

    // Step 11: Upload References
    referenceMaterials: 'reference_materials'
  };

  const transformed = {};
  
  Object.keys(frontendData).forEach(key => {
    if (fieldMappings[key] && frontendData[key] !== undefined && frontendData[key] !== null) {
      const dbField = fieldMappings[key];
      let value = frontendData[key];

      // Handle special cases
      if (key === 'primaryLocation' && typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          console.warn('Failed to parse primaryLocation JSON:', e);
        }
      }

      // Handle year conversion
      if (key === 'yearStarted' && typeof value === 'string') {
        value = parseInt(value) || null;
      }

      transformed[dbField] = value;
    }
  });

  return transformed;
};

/**
 * Transform database data to frontend format
 * @param {Object} dbData - Database data (snake_case)
 * @returns {Object} Frontend format data (camelCase)
 */
export const transformToFrontendFormat = (dbData) => {
  const fieldMappings = {
    // Step 1: Business Basics
    building_type: 'buildingType',
    business_email: 'businessEmail',
    has_proventous_id: 'hasProventousId',
    proventous_id: 'proventousId',
    business_name: 'businessName',

    // Step 2: About Your Business
    contact_number: 'contactNumber',
    preferred_contact: 'preferredContact',
    industry: 'industry',
    year_started: 'yearStarted',
    primary_location: 'primaryLocation',
    behind_brand: 'behindBrand',
    current_customers: 'currentCustomers',
    want_to_attract: 'wantToAttract',
    team_description: 'teamDescription',

    // Step 3: Audience Clarity
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

    // Step 4: Team & Culture
    culture_words: 'cultureWords',
    team_traditions: 'teamTraditions',
    team_highlights: 'teamHighlights',

    // Step 5: Brand Identity
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

    // Step 6: Visual Direction
    has_logo: 'hasLogo',
    logo_action: 'logoAction',
    preferred_colors: 'preferredColors',
    colors_to_avoid: 'colorsToAvoid',
    font_styles: 'fontStyles',
    design_style: 'designStyle',
    logo_type: 'logoType',
    imagery_style: 'imageryStyle',
    inspiration_links: 'inspirationLinks',

    // Step 7: Collateral Needs
    brand_kit_use: 'brandKitUse',
    brand_elements: 'brandElements',
    file_formats: 'fileFormats',

    // Step 8: Business Goals
    primary_goal: 'primaryGoal',
    short_term_goals: 'shortTermGoals',
    mid_term_goals: 'midTermGoals',
    long_term_goal: 'longTermGoal',
    big_picture_vision: 'bigPictureVision',
    success_metrics: 'successMetrics',

    // Step 9: AI-Powered Insights
    business_description: 'businessDescription',
    inspiration: 'inspiration',
    target_interests: 'targetInterests',
    current_interests: 'currentInterests',

    // Step 10: Wrap-Up
    special_notes: 'specialNotes',
    timeline: 'timeline',
    approver: 'approver',

    // Step 11: Upload References
    reference_materials: 'referenceMaterials'
  };

  const transformed = {};
  
  Object.keys(dbData).forEach(key => {
    if (fieldMappings[key] && dbData[key] !== undefined && dbData[key] !== null) {
      const frontendField = fieldMappings[key];
      let value = dbData[key];

      // Handle special cases
      if (key === 'primary_location' && value && typeof value === 'object') {
        value = JSON.stringify(value);
      }

      // Handle year conversion
      if (key === 'year_started' && value) {
        value = value.toString();
      }

      transformed[frontendField] = value;
    }
  });

  return transformed;
}; 