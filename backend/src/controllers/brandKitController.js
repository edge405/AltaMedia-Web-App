const { supabase } = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * Save or update BrandKit form data for a specific step
 * @route PUT /api/brandkit/save
 * @access Private
 */
const saveFormData = async (req, res) => {
  try {
    console.log('📥 Received request body:', req.body);
    const { userId, stepData, currentStep } = req.body;

    console.log('📋 Extracted fields:', { userId, stepData, currentStep });

    if (!userId || !stepData || !currentStep) {
      console.log('❌ Missing fields detected');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, stepData, currentStep',
        received: { userId, stepData: !!stepData, currentStep }
      });
    }

    logger.info(`Saving BrandKit form data for user ${userId}, step ${currentStep}`);

    try {
      // Check if form data already exists for this user
      console.log('🔍 Checking for existing form data...');
      const { data: existingForm, error: checkError } = await supabase
        .from('brand_kit_forms')
        .select('id, current_step, progress_percentage')
        .eq('user_id', userId)
        .single();

      console.log('🔍 Check result:', { existingForm, checkError });

      let result;

      if (existingForm) {
        console.log('📝 Updating existing form data...');
        // Update existing form data
        const { data, error } = await supabase
          .from('brand_kit_forms')
          .update({
            ...stepData,
            current_step: currentStep,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        console.log('📝 Update result:', { data, error });

        if (error) {
          console.error('❌ Error updating BrandKit form data:', error);
          logger.error('Error updating BrandKit form data:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to update form data',
            error: error.message
          });
        }

        result = data;
      } else {
        console.log('🆕 Creating new form data...');
        // Create new form data
        const { data, error } = await supabase
          .from('brand_kit_forms')
          .insert({
            user_id: userId,
            ...stepData,
            current_step: currentStep,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        console.log('🆕 Insert result:', { data, error });

        if (error) {
          console.error('❌ Error creating BrandKit form data:', error);
          logger.error('Error creating BrandKit form data:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to create form data',
            error: error.message
          });
        }

              result = data;
    }

    logger.info(`Successfully saved BrandKit form data for user ${userId}, step ${currentStep}`);

    res.json({
      success: true,
      message: 'Form data saved successfully',
      data: {
        formId: result.id,
        currentStep: result.current_step,
        progressPercentage: result.progress_percentage
      }
    });

    } catch (error) {
      console.error('❌ Unexpected error in saveFormData:', error);
      logger.error('Unexpected error in saveFormData:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  } catch (error) {
    console.error('❌ Database operation error:', error);
    logger.error('Database operation error:', error);
    res.status(500).json({
      success: false,
      message: 'Database operation failed',
      error: error.message
    });
  }
};

/**
 * Get BrandKit form data for a user
 * @route GET /api/brandkit/data/:userId
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

    logger.info(`Fetching BrandKit form data for user ${userId}`);

    const { data: formData, error } = await supabase
      .from('brand_kit_forms')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found for this user
        return res.json({
          success: true,
          message: 'No form data found for this user',
          data: {
            formData: null,
            currentStep: 1,
            progressPercentage: 0,
            isCompleted: false
          }
        });
      }

      logger.error('Error fetching BrandKit form data:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch form data',
        error: error.message
      });
    }

    logger.info(`Successfully fetched BrandKit form data for user ${userId}`);

    res.json({
      success: true,
      message: 'Form data retrieved successfully',
      data: {
        formData: formData,
        currentStep: formData.current_step || 1,
        progressPercentage: formData.progress_percentage || 0,
        isCompleted: formData.is_completed || false
      }
    });

  } catch (error) {
    logger.error('Unexpected error in getFormData:', error);
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