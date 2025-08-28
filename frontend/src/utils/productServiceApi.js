import apiService from './api';

/**
 * Transform frontend form data to database format
 * @param {Object} formData - Frontend form data
 * @returns {Object} - Database formatted data
 */
const transformToDatabaseFormat = (formData) => {
  // Ensure formData is an object
  if (!formData || typeof formData !== 'object') {
    console.log('⚠️ formData is not a valid object, using empty object:', formData);
    formData = {};
  }

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
    // Ensure the value is not undefined or null
    transformed[dbKey] = formData[key] !== undefined && formData[key] !== null ? formData[key] : null;
  });

  return transformed;
};

/**
 * Transform database data to frontend format
 * @param {Object} dbData - Database data
 * @returns {Object} - Frontend formatted data
 */
const transformToFrontendFormat = (dbData) => {
  // Ensure dbData is an object
  if (!dbData || typeof dbData !== 'object') {
    console.log('⚠️ dbData is not a valid object, using empty object:', dbData);
    dbData = {};
  }

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
      // Ensure the value is not undefined or null
      transformed[frontendKey] = dbData[key] !== undefined && dbData[key] !== null ? dbData[key] : null;
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
export const saveFormData = async (stepData, currentStep) => {
  try {
    console.log('🔄 Original step data:', stepData);
    console.log('🔄 Original step data keys:', Object.keys(stepData));
    console.log('🔄 Original step data values:', Object.values(stepData));
    const transformedData = transformToDatabaseFormat(stepData);
    console.log('🔄 Transformed data:', transformedData);
    console.log('🔄 Transformed data keys:', Object.keys(transformedData));
    console.log('🔄 Transformed data values:', Object.values(transformedData));
    
    // Check if there are files to upload (ensure they are arrays and have files)
    const hasFiles = Array.isArray(transformedData.reference_materials) && transformedData.reference_materials.length > 0;
    
    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();
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
export const getFormData = async () => {
  try {
    console.log('🔄 Fetching ProductService form data...');
    const response = await apiService.get('/productservice/data');
    console.log('🔄 Raw API response:', response);
    
    // Transform the data to frontend format if it exists
    if (response.success && response.data && response.data.formData) {
      console.log('🔄 Transforming form data...');
      response.data.formData = transformToFrontendFormat(response.data.formData);
      console.log('🔄 Transformed form data:', response.data);
    }

    return response;
  } catch (error) {
    console.error('Error fetching ProductService form data:', error);
    throw error;
  }
};

/**
 * Mark ProductService form as completed
 * @returns {Promise<Object>} - API response
 */
export const completeForm = async () => {
  try {
    console.log('🔄 Marking ProductService form as completed...');
    const response = await apiService.put('/productservice/complete');
    console.log('🔄 Complete form response:', response);
    return response;
  } catch (error) {
    console.error('Error completing ProductService form:', error);
    throw error;
  }
};

export { transformToDatabaseFormat, transformToFrontendFormat };
