const { executeQuery } = require('../config/mysql');
const logger = require('../utils/logger');

/**
 * Consolidate all BrandKit form data into a single JSON structure
 * @route GET /api/brandkit/consolidate/:userId
 * @access Private
 */
const consolidateFormData = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    logger.info(`Consolidating BrandKit form data for user ${userId}`);

    // Fetch all form data for the user
    const brandKitData = await executeQuery(
      'SELECT * FROM company_brand_kit_forms WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    const productServiceData = await executeQuery(
      'SELECT * FROM brandkit_questionnaire_forms WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    const organizationData = await executeQuery(
      'SELECT * FROM organization_forms WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    // Get user information
    const userData = await executeQuery(
      'SELECT id, email, fullname, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    // Parse JSON fields for each form type
    const parseJsonFields = (data, jsonFields) => {
      if (!data || data.length === 0) return null;
      
      const parsed = { ...data[0] };
      jsonFields.forEach(field => {
        if (parsed[field] && typeof parsed[field] === 'string') {
          try {
            parsed[field] = JSON.parse(parsed[field]);
          } catch (e) {
            parsed[field] = null;
          }
        }
      });
      return parsed;
    };

    // Consolidate all data into the required structure
    const consolidatedData = {
      // user_info: userData.length > 0 ? userData[0] : null,
      // forms_completion_status: {
      //   brand_kit: brandKitData.length > 0 ? {
      //     completed: brandKitData[0].is_completed || false,
      //     current_step: brandKitData[0].current_step || 0,
      //     progress_percentage: brandKitData[0].progress_percentage || 0,
      //     last_updated: brandKitData[0].updated_at || brandKitData[0].created_at
      //   } : { completed: false, current_step: 0, progress_percentage: 0 },
        
      //   product_service: productServiceData.length > 0 ? {
      //     completed: productServiceData[0].is_completed || false,
      //     current_step: productServiceData[0].current_step || 0,
      //     progress_percentage: productServiceData[0].progress_percentage || 0,
      //     last_updated: productServiceData[0].updated_at || productServiceData[0].created_at
      //   } : { completed: false, current_step: 0, progress_percentage: 0 },
        
      //   organization: organizationData.length > 0 ? {
      //     completed: organizationData[0].is_completed || false,
      //     current_step: organizationData[0].current_step || 0,
      //     progress_percentage: organizationData[0].progress_percentage || 0,
      //     last_updated: organizationData[0].updated_at || organizationData[0].created_at
      //   } : { completed: false, current_step: 0, progress_percentage: 0 }
      // },
      brand_kit_data: {
        business_company: brandKitData.length > 0 ? [parseJsonFields(brandKitData, [
          'industry', 'current_customers', 'target_professions', 'reach_locations', 
          'age_groups', 'spending_habits', 'interaction_methods', 'audience_behavior',
          'culture_words', 'brand_tone', 'core_values', 'brand_personality', 
          'logo_action', 'preferred_colors', 'colors_to_avoid', 'font_styles',
          'design_style', 'logo_type', 'imagery_style', 'brand_kit_use', 
          'brand_elements', 'file_formats', 'success_metrics', 'target_interests',
          'current_interests', 'social_media_platforms', 'desired_social_media_platforms',
          'primary_location', 'reference_materials', 'inspiration_links'
        ])] : [],
        
        product_service: productServiceData.length > 0 ? [parseJsonFields(productServiceData, [
          'industry', 'target_platforms', 'content_types', 'deliverables', 'reference_materials'
        ])] : [],
        
        organization: organizationData.length > 0 ? [parseJsonFields(organizationData, [
          'target_platforms', 'content_types', 'deliverables', 'reference_materials'
        ])] : []
      },
      // consolidation_timestamp: new Date().toISOString(),
      // all_forms_completed: (
      //   (brandKitData.length > 0 && brandKitData[0].is_completed) &&
      //   (productServiceData.length > 0 && productServiceData[0].is_completed) &&
      //   (organizationData.length > 0 && organizationData[0].is_completed)
      // )
    };

    logger.info(`Successfully consolidated BrandKit form data for user ${userId}`);

    res.json({
      // success: true,
      // message: 'BrandKit form data consolidated successfully',
      brand_company_data: consolidatedData.brand_kit_data.business_company,
      product_service_data: consolidatedData.brand_kit_data.product_service,
      organization_data: consolidatedData.brand_kit_data.organization
    });

  } catch (error) {
    console.error('❌ Error consolidating BrandKit form data:', error);
    logger.error('Error consolidating BrandKit form data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to consolidate form data',
      error: error.message
    });
  }
};

/**
 * Trigger webhook with consolidated BrandKit form data
 * @route POST /api/brandkit/webhook/:userId
 * @access Private
 */
const triggerWebhook = async (req, res) => {
  try {
    const { userId } = req.params;
    const { webhook_url } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (!webhook_url) {
      return res.status(400).json({
        success: false,
        message: 'Webhook URL is required'
      });
    }

    logger.info(`Triggering webhook for user ${userId} to ${webhook_url}`);

    // First, consolidate the data
    const brandKitData = await executeQuery(
      'SELECT * FROM company_brand_kit_forms WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    const productServiceData = await executeQuery(
      'SELECT * FROM brandkit_questionnaire_forms WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    const organizationData = await executeQuery(
      'SELECT * FROM organization_forms WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    const userData = await executeQuery(
      'SELECT id, email, fullname, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    // Parse JSON fields function
    const parseJsonFields = (data, jsonFields) => {
      if (!data || data.length === 0) return null;
      
      const parsed = { ...data[0] };
      jsonFields.forEach(field => {
        if (parsed[field] && typeof parsed[field] === 'string') {
          try {
            parsed[field] = JSON.parse(parsed[field]);
          } catch (e) {
            parsed[field] = null;
          }
        }
      });
      return parsed;
    };

    // Prepare webhook payload
    const webhookPayload = {
      // user_info: userData.length > 0 ? userData[0] : null,
      brand_kit_data: {
        business_company: brandKitData.length > 0 ? [parseJsonFields(brandKitData, [
          'industry', 'current_customers', 'target_professions', 'reach_locations', 
          'age_groups', 'spending_habits', 'interaction_methods', 'audience_behavior',
          'culture_words', 'brand_tone', 'core_values', 'brand_personality', 
          'logo_action', 'preferred_colors', 'colors_to_avoid', 'font_styles',
          'design_style', 'logo_type', 'imagery_style', 'brand_kit_use', 
          'brand_elements', 'file_formats', 'success_metrics', 'target_interests',
          'current_interests', 'social_media_platforms', 'desired_social_media_platforms',
          'primary_location', 'reference_materials', 'inspiration_links'
        ])] : [],
        
        product_service: productServiceData.length > 0 ? [parseJsonFields(productServiceData, [
          'industry', 'target_platforms', 'content_types', 'deliverables', 'reference_materials'
        ])] : [],
        
        organization: organizationData.length > 0 ? [parseJsonFields(organizationData, [
          'target_platforms', 'content_types', 'deliverables', 'reference_materials'
        ])] : []
      },
      // webhook_timestamp: new Date().toISOString(),
      // all_forms_completed: (
      //   (brandKitData.length > 0 && brandKitData[0].is_completed) &&
      //   (productServiceData.length > 0 && productServiceData[0].is_completed) &&
      //   (organizationData.length > 0 && organizationData[0].is_completed)
      // )
    };

    // Send webhook
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const webhookResponse = await fetch(webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Alta-Web-App/1.0'
      },
      body: JSON.stringify(webhookPayload)
    });

    const webhookResponseText = await webhookResponse.text();
    let webhookResponseData;
  
    try {
      webhookResponseData = JSON.parse(webhookResponseText);
    } catch (e) {
      webhookResponseData = webhookResponseText;
    }

    logger.info(`Webhook triggered successfully for user ${userId}. Response: ${webhookResponse.status}`);

    res.json({
      brand_company_data: webhookPayload.brand_kit_data.business_company,
      product_service_data: webhookPayload.brand_kit_data.product_service,
      organization_data: webhookPayload.brand_kit_data.organization

    });

  } catch (error) {
    console.error('❌ Error triggering webhook:', error);
    logger.error('Error triggering webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to trigger webhook',
      error: error.message
    });
  }
};

module.exports = {
  consolidateFormData,
  triggerWebhook
};
