const { supabase } = require('../config/supabase');
const logger = require('../utils/logger');
const { extractFileUploads, cleanupOldFiles } = require('../utils/fileUploadUtils');

/**
 * Helper function to validate and clean form data for Supabase
 * @param {Object} stepData - Raw form data from frontend
 * @returns {Object} Cleaned and validated data for Supabase
 */
const validateAndCleanFormData = (stepData) => {
  // Define all valid fields for the organization_forms table
  const validFields = [
    'building_type', 'organization_name', 'social_media_goals', 'brand_uniqueness',
    'desired_emotion', 'target_platforms', 'content_types', 'deliverables',
    'timeline', 'main_contact', 'additional_info', 'reference_materials'
  ];

  const cleanedData = {};
  
  for (const [key, value] of Object.entries(stepData)) {
    if (validFields.includes(key) && value !== undefined && value !== null) {
      // Handle special data type conversions for Supabase
      if (Array.isArray(value) && value.length === 0) {
        // Handle empty arrays - store as null for Supabase
        cleanedData[key] = null;
      } else {
        cleanedData[key] = value;
      }
    }
  }

  return cleanedData;
};

/**
 * Save or update Organization form data for a specific step
 * @route PUT /api/organization/save
 * @access Private
 */
const saveFormData = async (req, res) => {
  try {
    console.log('📥 Received Organization request body:', req.body);
    console.log('📁 Files in request:', req.files);
    
    let { userId, stepData, currentStep } = req.body;
    
    // Parse stepData if it's a JSON string (when files are uploaded)
    if (typeof stepData === 'string') {
      try {
        stepData = JSON.parse(stepData);
        console.log('📋 Parsed stepData from JSON string:', stepData);
      } catch (error) {
        console.error('❌ Error parsing stepData JSON:', error);
        return res.status(400).json({
          success: false,
          message: 'Invalid stepData format',
          error: error.message
        });
      }
    }

    console.log('📋 Extracted Organization fields:', { userId, stepData, currentStep });

    if (!userId || !stepData || !currentStep) {
      console.log('❌ Missing Organization fields detected');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, stepData, currentStep',
        received: { userId, stepData: !!stepData, currentStep }
      });
    }

    // === FILE UPLOAD PROCESSING ===
    console.log('📁 Processing file uploads for Organization...');
    console.log('📁 req.files:', req.files);
    console.log('📁 req.files keys:', req.files ? Object.keys(req.files) : 'No files');
    console.log('📁 req.body:', req.body);
    console.log('📁 Content-Type:', req.headers['content-type']);
    let processedStepData = { ...stepData };

    // Handle file uploads for reference_materials
    if (req.files && req.files.reference_materials) {
      console.log('📁 Processing reference_materials files:', req.files.reference_materials);
      
      // Extract file paths from uploaded files
      const filePaths = extractFileUploads(processedStepData, req.files.reference_materials, 'reference_materials');
      
      // Store file paths as JSON array in the database (same as brandKit)
      processedStepData.reference_materials = JSON.stringify(filePaths);
      
      console.log('📁 reference_materials file paths:', filePaths);
      console.log('📁 Final processedStepData.reference_materials:', processedStepData.reference_materials);
    } else {
      console.log('📁 No reference_materials files found in request');
      // Ensure reference_materials is set to empty array if no files
      if (!processedStepData.reference_materials) {
        processedStepData.reference_materials = JSON.stringify([]);
      }
    }

    logger.info(`Saving Organization form data for user ${userId}, step ${currentStep}`);

    try {
      // Check if form data already exists for this user
      console.log('🔍 Checking for existing Organization form data...');
      const { data: existingForm, error: checkError } = await supabase
        .from('organization_forms')
        .select('id, current_step, progress_percentage')
        .eq('user_id', userId)
        .single();

      console.log('🔍 Organization check result:', { existingForm, checkError });

      let result;

      if (existingForm) {
        console.log('📝 Updating existing Organization form data...');
        // Update existing form data
        const { data, error } = await supabase
          .from('organization_forms')
          .update({
            ...processedStepData,
            current_step: currentStep,
            progress_percentage: Math.round(currentStep * 25), // Calculate progress percentage (25% per step)
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        console.log('📝 Organization update result:', { data, error });

        if (error) {
          console.error('❌ Error updating Organization form data:', error);
          logger.error('Error updating Organization form data:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to update Organization form data',
            error: error.message
          });
        }

        result = data;
      } else {
        console.log('🆕 Creating new Organization form data...');
        // Create new form data
        const { data, error } = await supabase
          .from('organization_forms')
          .insert({
            user_id: userId,
            ...processedStepData,
            current_step: currentStep,
            progress_percentage: Math.round(currentStep * 25), // Calculate progress percentage (25% per step)
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        console.log('🆕 Organization insert result:', { data, error });

        if (error) {
          console.error('❌ Error creating Organization form data:', error);
          logger.error('Error creating Organization form data:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to create Organization form data',
            error: error.message
          });
        }

        result = data;
      }

      logger.info(`Successfully saved Organization form data for user ${userId}, step ${currentStep}`);

      res.json({
        success: true,
        message: 'Organization form data saved successfully',
        data: {
          formId: result.id,
          currentStep: result.current_step,
          progressPercentage: result.progress_percentage
        }
      });

    } catch (error) {
      console.error('❌ Unexpected error in Organization saveFormData:', error);
      logger.error('Unexpected error in Organization saveFormData:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  } catch (error) {
    console.error('❌ Organization database operation error:', error);
    logger.error('Organization database operation error:', error);
    res.status(500).json({
      success: false,
      message: 'Database operation failed',
      error: error.message
    });
  }
};

/**
 * Get Organization form data for a user
 * @route GET /api/organization/data/:userId
 * @access Private
 */
const getFormData = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    logger.info(`Fetching Organization form data for user ${userId}`);

    const { data: formData, error } = await supabase
      .from('organization_forms')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found for this user
        return res.json({
          success: true,
          message: 'No Organization form data found for this user',
          data: {
            formData: null,
            currentStep: 1,
            progressPercentage: 0,
            isCompleted: false
          }
        });
      }

      logger.error('Error fetching Organization form data:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch Organization form data',
        error: error.message
      });
    }

    logger.info(`Successfully fetched Organization form data for user ${userId}`);

    res.json({
      success: true,
      message: 'Organization form data retrieved successfully',
      data: {
        formData: formData,
        currentStep: formData.current_step || 1,
        progressPercentage: formData.progress_percentage || 0,
        isCompleted: formData.is_completed || false
      }
    });

  } catch (error) {
    logger.error('Unexpected error in Organization getFormData:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  saveFormData,
  getFormData
};
