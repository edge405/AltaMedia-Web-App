const { supabase } = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * Save or update ProductService form data for a specific step
 * @route PUT /api/productservice/save
 * @access Private
 */
const saveFormData = async (req, res) => {
  try {
    console.log('📥 Received ProductService request body:', req.body);
    const { userId, stepData, currentStep } = req.body;

    console.log('📋 Extracted ProductService fields:', { userId, stepData, currentStep });

    if (!userId || !stepData || !currentStep) {
      console.log('❌ Missing ProductService fields detected');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, stepData, currentStep',
        received: { userId, stepData: !!stepData, currentStep }
      });
    }

    logger.info(`Saving ProductService form data for user ${userId}, step ${currentStep}`);

    try {
      // Check if form data already exists for this user
      console.log('🔍 Checking for existing ProductService form data...');
      const { data: existingForm, error: checkError } = await supabase
        .from('product_service_forms')
        .select('id, current_step, progress_percentage')
        .eq('user_id', userId)
        .single();

      console.log('🔍 ProductService check result:', { existingForm, checkError });

      let result;

      if (existingForm) {
        console.log('📝 Updating existing ProductService form data...');
        // Update existing form data
        const { data, error } = await supabase
          .from('product_service_forms')
          .update({
            ...stepData,
            current_step: currentStep,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        console.log('📝 ProductService update result:', { data, error });

        if (error) {
          console.error('❌ Error updating ProductService form data:', error);
          logger.error('Error updating ProductService form data:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to update ProductService form data',
            error: error.message
          });
        }

        result = data;
      } else {
        console.log('🆕 Creating new ProductService form data...');
        // Create new form data
        const { data, error } = await supabase
          .from('product_service_forms')
          .insert({
            user_id: userId,
            ...stepData,
            current_step: currentStep,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        console.log('🆕 ProductService insert result:', { data, error });

        if (error) {
          console.error('❌ Error creating ProductService form data:', error);
          logger.error('Error creating ProductService form data:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to create ProductService form data',
            error: error.message
          });
        }

        result = data;
      }

      logger.info(`Successfully saved ProductService form data for user ${userId}, step ${currentStep}`);

      res.json({
        success: true,
        message: 'ProductService form data saved successfully',
        data: {
          formId: result.id,
          currentStep: result.current_step,
          progressPercentage: result.progress_percentage
        }
      });

    } catch (error) {
      console.error('❌ Unexpected error in ProductService saveFormData:', error);
      logger.error('Unexpected error in ProductService saveFormData:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  } catch (error) {
    console.error('❌ ProductService database operation error:', error);
    logger.error('ProductService database operation error:', error);
    res.status(500).json({
      success: false,
      message: 'Database operation failed',
      error: error.message
    });
  }
};

/**
 * Get ProductService form data for a user
 * @route GET /api/productservice/data/:userId
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

    logger.info(`Fetching ProductService form data for user ${userId}`);

    const { data: formData, error } = await supabase
      .from('product_service_forms')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found for this user
        return res.json({
          success: true,
          message: 'No ProductService form data found for this user',
          data: {
            formData: null,
            currentStep: 1,
            progressPercentage: 0,
            isCompleted: false
          }
        });
      }

      logger.error('Error fetching ProductService form data:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch ProductService form data',
        error: error.message
      });
    }

    logger.info(`Successfully fetched ProductService form data for user ${userId}`);

    res.json({
      success: true,
      message: 'ProductService form data retrieved successfully',
      data: {
        formData: formData,
        currentStep: formData.current_step || 1,
        progressPercentage: formData.progress_percentage || 0,
        isCompleted: formData.is_completed || false
      }
    });

  } catch (error) {
    logger.error('Unexpected error in ProductService getFormData:', error);
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
