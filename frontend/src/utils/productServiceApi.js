import apiService from './api';

/**
 * Transform frontend form data to database format
 * @param {Object} formData - Frontend form data
 * @returns {Object} - Database formatted data
 */
const transformToDatabaseFormat = (formData) => {
  const transformed = {};

  // Map frontend field names to database column names
  const fieldMappings = {
    buildingType: 'building_type',
    productName: 'product_name',
    productDescription: 'product_description',
    wantToAttract: 'want_to_attract',
    missionStory: 'mission_story',
    desiredEmotion: 'desired_emotion',
    brandTone: 'brand_tone',
    targetAudienceProfile: 'target_audience_profile',
    reachLocations: 'reach_locations',
    brandPersonality: 'brand_personality',
    designStyle: 'design_style',
    preferredColors: 'preferred_colors',
    colorsToAvoid: 'colors_to_avoid',
    competitors: 'competitors',
    brandKitUse: 'brand_kit_use',
    brandElements: 'brand_elements',
    fileFormats: 'file_formats',
    platformSupport: 'platform_support',
    timeline: 'timeline',
    primaryLocation: 'primary_location',
    preferredContact: 'preferred_contact',
    approver: 'approver',
    specialNotes: 'special_notes',
    referenceMaterials: 'reference_materials'
  };

  // Transform each field
  Object.keys(formData).forEach(key => {
    const dbKey = fieldMappings[key] || key;
    transformed[dbKey] = formData[key];
  });

  return transformed;
};

/**
 * Transform database data to frontend format
 * @param {Object} dbData - Database data
 * @returns {Object} - Frontend formatted data
 */
const transformToFrontendFormat = (dbData) => {
  const transformed = {};

  // Map database field names to frontend field names
  const fieldMappings = {
    building_type: 'buildingType',
    product_name: 'productName',
    product_description: 'productDescription',
    want_to_attract: 'wantToAttract',
    mission_story: 'missionStory',
    desired_emotion: 'desiredEmotion',
    brand_tone: 'brandTone',
    target_audience_profile: 'targetAudienceProfile',
    reach_locations: 'reachLocations',
    brand_personality: 'brandPersonality',
    design_style: 'designStyle',
    preferred_colors: 'preferredColors',
    colors_to_avoid: 'colorsToAvoid',
    competitors: 'competitors',
    brand_kit_use: 'brandKitUse',
    brand_elements: 'brandElements',
    file_formats: 'fileFormats',
    platform_support: 'platformSupport',
    timeline: 'timeline',
    primary_location: 'primaryLocation',
    preferred_contact: 'preferredContact',
    approver: 'approver',
    special_notes: 'specialNotes',
    reference_materials: 'referenceMaterials'
  };

  // Transform each field
  Object.keys(dbData).forEach(key => {
    const frontendKey = fieldMappings[key] || key;
    
    // Special handling for reference_materials (convert comma-separated string to array)
    if (key === 'reference_materials' && typeof dbData[key] === 'string') {
      transformed[frontendKey] = dbData[key] ? dbData[key].split(',').filter(path => path.trim()) : [];
    } else {
      transformed[frontendKey] = dbData[key];
    }
  });

  return transformed;
};

/**
 * Save ProductService form data for a specific step
 * @param {number} userId - User ID
 * @param {Object} stepData - Form data for the current step
 * @param {number} currentStep - Current step number
 * @returns {Promise<Object>} - API response
 */
export const saveFormData = async (userId, stepData, currentStep) => {
  try {
    const transformedData = transformToDatabaseFormat(stepData);
    
    // Check if there are files to upload (ensure they are arrays and have files)
    const hasFiles = Array.isArray(transformedData.reference_materials) && transformedData.reference_materials.length > 0;
    
    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('currentStep', currentStep);
      
      // Add non-file data as JSON string
      const nonFileData = { ...transformedData };
      delete nonFileData.reference_materials;
      formData.append('stepData', JSON.stringify(nonFileData));
      
      // Add files
      transformedData.reference_materials.forEach(file => {
        formData.append('reference_materials', file);
      });
      
      const response = await apiService.putFormData('/productservice/save', formData);
      return response;
    } else {
      // Use regular JSON for non-file data
      const response = await apiService.put('/productservice/save', {
        userId,
        stepData: transformedData,
        currentStep
      });
      return response;
    }
  } catch (error) {
    console.error('Error saving ProductService form data:', error);
    throw error;
  }
};

/**
 * Get ProductService form data for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - API response with form data
 */
export const getFormData = async (userId) => {
  try {
    const response = await apiService.get(`/productservice/data/${userId}`);
    
    // Transform the data to frontend format if it exists
    if (response.success && response.data.formData) {
      response.data.formData = transformToFrontendFormat(response.data.formData);
    }

    return response;
  } catch (error) {
    console.error('Error fetching ProductService form data:', error);
    throw error;
  }
};

export { transformToDatabaseFormat, transformToFrontendFormat };
