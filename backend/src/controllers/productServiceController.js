const { executeQuery } = require('../config/mysql');
const logger = require('../utils/logger');
const { extractFileUploads, cleanupOldFiles } = require('../utils/fileUploadUtils');

/**
 * Save or update ProductService form data for a specific step
 * @route PUT /api/productservice/save
 * @access Private
 */
const saveFormData = async (req, res) => {
  try {
    console.log('📥 Received ProductService request body:', req.body);
    console.log('📁 Files in request:', req.files);
    
    const userId = req.user.id; // Get userId from authenticated user
    let { stepData, currentStep } = req.body;
    
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

    // Ensure stepData is an object
    if (!stepData || typeof stepData !== 'object') {
      console.log('❌ stepData is not a valid object:', stepData);
      stepData = {};
    }

    console.log('📋 Extracted ProductService fields:', { userId, stepData, currentStep });

    if (!stepData) {
      console.log('❌ Missing stepData field');
      return res.status(400).json({
        success: false,
        message: 'Missing required field: stepData',
        received: { stepData: !!stepData, currentStep }
      });
    }

    if (!currentStep) {
      console.log('❌ Missing currentStep field');
      return res.status(400).json({
        success: false,
        message: 'Missing required field: currentStep',
        received: { stepData: !!stepData, currentStep }
      });
    }

    // === FILE UPLOAD PROCESSING ===
    console.log('📁 Processing file uploads for ProductService...');
    console.log('📁 req.files:', req.files);
    console.log('📁 req.files.reference_materials:', req.files?.reference_materials);
    
    let processedStepData = { ...(stepData || {}) };

    // Handle file uploads for reference_materials
    if (req.files && req.files.reference_materials) {
      console.log('📁 Processing reference_materials files:', req.files.reference_materials);
      
      try {
        // Extract file paths from uploaded files
        const filePaths = extractFileUploads(processedStepData || {}, req.files.reference_materials, 'reference_materials');
        
        // Store file paths as JSON array in the database
        processedStepData.reference_materials = JSON.stringify(filePaths || []);
        
        console.log('📁 File paths array:', filePaths);
        console.log('📁 JSON string:', processedStepData.reference_materials);
      } catch (fileError) {
        console.error('❌ Error processing files:', fileError);
        processedStepData.reference_materials = JSON.stringify([]);
      }
    } else {
      console.log('📁 No reference_materials files found in request');
      // Ensure reference_materials is set to empty array if no files
      processedStepData.reference_materials = JSON.stringify([]);
    }

    logger.info(`Saving ProductService form data for user ${userId}, step ${currentStep}`);

    try {
      // Check if form data already exists for this user
      console.log('🔍 Checking for existing ProductService form data for user:', userId);
      const existingForms = await executeQuery(
        'SELECT id, current_step, progress_percentage FROM product_service_forms WHERE user_id = ?',
        [userId]
      );

      console.log('🔍 ProductService check result:', { existingForms, userId });

      let result;

      if (existingForms.length > 0) {
        console.log('📝 Updating existing ProductService form data...');
        const existingForm = existingForms[0];
        
        // Calculate progress percentage based on current step
        const progressPercentage = Math.round((currentStep / 5) * 100); // Assuming 5 steps total
        
        // Update existing form data
        await executeQuery(`
          UPDATE product_service_forms 
          SET building_type = ?, product_name = ?, product_description = ?, industry = ?,
              want_to_attract = ?, mission_story = ?, desired_emotion = ?, brand_tone = ?,
              target_audience_profile = ?, reach_locations = ?, brand_personality = ?,
              design_style = ?, preferred_colors = ?, colors_to_avoid = ?, competitors = ?,
              brand_kit_use = ?, brand_elements = ?, file_formats = ?, platform_support = ?,
              timeline = ?, primary_location = ?, preferred_contact = ?, approver = ?,
              special_notes = ?, reference_materials = ?, current_step = ?, 
              progress_percentage = ?, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `, [
          (processedStepData.building_type || 'product'),
          (processedStepData.product_name || null),
          (processedStepData.product_description || null),
          (processedStepData.industry && Array.isArray(processedStepData.industry)) ? JSON.stringify(processedStepData.industry) : null,
          (processedStepData.want_to_attract || null),
          (processedStepData.mission_story || null),
          (processedStepData.desired_emotion || null),
          (processedStepData.brand_tone || null),
          (processedStepData.target_audience_profile || null),
          (processedStepData.reach_locations && Array.isArray(processedStepData.reach_locations)) ? JSON.stringify(processedStepData.reach_locations) : null,
          (processedStepData.brand_personality && Array.isArray(processedStepData.brand_personality)) ? JSON.stringify(processedStepData.brand_personality) : null,
          (processedStepData.design_style && Array.isArray(processedStepData.design_style)) ? JSON.stringify(processedStepData.design_style) : null,
          (processedStepData.preferred_colors && Array.isArray(processedStepData.preferred_colors)) ? JSON.stringify(processedStepData.preferred_colors) : null,
          (processedStepData.colors_to_avoid && Array.isArray(processedStepData.colors_to_avoid)) ? JSON.stringify(processedStepData.colors_to_avoid) : null,
          (processedStepData.competitors || null),
          (processedStepData.brand_kit_use && Array.isArray(processedStepData.brand_kit_use)) ? JSON.stringify(processedStepData.brand_kit_use) : null,
          (processedStepData.brand_elements && Array.isArray(processedStepData.brand_elements)) ? JSON.stringify(processedStepData.brand_elements) : null,
          (processedStepData.file_formats && Array.isArray(processedStepData.file_formats)) ? JSON.stringify(processedStepData.file_formats) : null,
          (processedStepData.platform_support && Array.isArray(processedStepData.platform_support)) ? JSON.stringify(processedStepData.platform_support) : null,
          (processedStepData.timeline || null),
          (processedStepData.primary_location || null),
          (processedStepData.preferred_contact || null),
          (processedStepData.approver || null),
          (processedStepData.special_notes || null),
          (processedStepData.reference_materials || JSON.stringify([])),
          (currentStep || 1),
          (progressPercentage || 0),
          (userId || null)
        ]);

        result = {
          id: existingForm.id,
          current_step: currentStep,
          progress_percentage: progressPercentage,
          updated: true
        };
      } else {
        console.log('📝 Creating new ProductService form data...');
        
        // Calculate progress percentage based on current step
        const progressPercentage = Math.round((currentStep / 5) * 100); // Assuming 5 steps total
        
        // Generate UUID for new form
        const { v4: uuidv4 } = require('uuid');
        const formId = uuidv4();
        
        // Insert new form data
        await executeQuery(`
          INSERT INTO product_service_forms (
            id, user_id, building_type, product_name, product_description, industry,
            want_to_attract, mission_story, desired_emotion, brand_tone, target_audience_profile,
            reach_locations, brand_personality, design_style, preferred_colors, colors_to_avoid,
            competitors, brand_kit_use, brand_elements, file_formats, platform_support,
            timeline, primary_location, preferred_contact, approver, special_notes,
            reference_materials, current_step, progress_percentage
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          formId,
          userId,
          (processedStepData.building_type || 'product'),
          (processedStepData.product_name || null),
          (processedStepData.product_description || null),
          (processedStepData.industry && Array.isArray(processedStepData.industry)) ? JSON.stringify(processedStepData.industry) : null,
          (processedStepData.want_to_attract || null),
          (processedStepData.mission_story || null),
          (processedStepData.desired_emotion || null),
          (processedStepData.brand_tone || null),
          (processedStepData.target_audience_profile || null),
          (processedStepData.reach_locations && Array.isArray(processedStepData.reach_locations)) ? JSON.stringify(processedStepData.reach_locations) : null,
          (processedStepData.brand_personality && Array.isArray(processedStepData.brand_personality)) ? JSON.stringify(processedStepData.brand_personality) : null,
          (processedStepData.design_style && Array.isArray(processedStepData.design_style)) ? JSON.stringify(processedStepData.design_style) : null,
          (processedStepData.preferred_colors && Array.isArray(processedStepData.preferred_colors)) ? JSON.stringify(processedStepData.preferred_colors) : null,
          (processedStepData.colors_to_avoid && Array.isArray(processedStepData.colors_to_avoid)) ? JSON.stringify(processedStepData.colors_to_avoid) : null,
          (processedStepData.competitors || null),
          (processedStepData.brand_kit_use && Array.isArray(processedStepData.brand_kit_use)) ? JSON.stringify(processedStepData.brand_kit_use) : null,
          (processedStepData.brand_elements && Array.isArray(processedStepData.brand_elements)) ? JSON.stringify(processedStepData.brand_elements) : null,
          (processedStepData.file_formats && Array.isArray(processedStepData.file_formats)) ? JSON.stringify(processedStepData.file_formats) : null,
          (processedStepData.platform_support && Array.isArray(processedStepData.platform_support)) ? JSON.stringify(processedStepData.platform_support) : null,
          (processedStepData.timeline || null),
          (processedStepData.primary_location || null),
          (processedStepData.preferred_contact || null),
          (processedStepData.approver || null),
          (processedStepData.special_notes || null),
          (processedStepData.reference_materials || JSON.stringify([])),
          (currentStep || 1),
          (progressPercentage || 0)
        ]);

        result = {
          id: formId,
          current_step: currentStep,
          progress_percentage: progressPercentage,
          created: true
        };
      }

      console.log('✅ ProductService form data saved successfully:', result);

      res.json({
        success: true,
        message: 'ProductService form data saved successfully',
        data: result
      });

    } catch (dbError) {
      console.error('❌ Database error in ProductService saveFormData:', dbError);
      logger.error('Database error in ProductService saveFormData:', dbError);
      res.status(500).json({
        success: false,
        message: 'Failed to save form data',
        error: dbError.message
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error in ProductService saveFormData:', error);
    logger.error('Unexpected error in ProductService saveFormData:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get ProductService form data for a user
 * @route GET /api/productservice/data
 * @access Private
 */
const getFormData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('🔍 Fetching ProductService form data for user:', userId);

    const forms = await executeQuery(
      'SELECT * FROM product_service_forms WHERE user_id = ?',
      [userId]
    );

    // If no data found, return success with null data (like BrandKit controller)
    if (forms.length === 0) {
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

    const formData = forms[0];

    // Parse JSON fields
    const parsedFormData = {
      ...formData,
      industry: formData.industry ? JSON.parse(formData.industry) : [],
      reach_locations: formData.reach_locations ? JSON.parse(formData.reach_locations) : [],
      brand_personality: formData.brand_personality ? JSON.parse(formData.brand_personality) : [],
      design_style: formData.design_style ? JSON.parse(formData.design_style) : [],
      preferred_colors: formData.preferred_colors ? JSON.parse(formData.preferred_colors) : [],
      colors_to_avoid: formData.colors_to_avoid ? JSON.parse(formData.colors_to_avoid) : [],
      brand_kit_use: formData.brand_kit_use ? JSON.parse(formData.brand_kit_use) : [],
      brand_elements: formData.brand_elements ? JSON.parse(formData.brand_elements) : [],
      file_formats: formData.file_formats ? JSON.parse(formData.file_formats) : [],
      platform_support: formData.platform_support ? JSON.parse(formData.platform_support) : [],
      reference_materials: formData.reference_materials ? JSON.parse(formData.reference_materials) : []
    };

    console.log('✅ ProductService form data retrieved successfully');

    res.json({
      success: true,
      message: 'ProductService form data retrieved successfully',
      data: {
        formData: parsedFormData,
        currentStep: parsedFormData.current_step || 1
      }
    });

  } catch (error) {
    console.error('❌ Error in ProductService getFormData:', error);
    logger.error('Error in ProductService getFormData:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve form data',
      error: error.message
    });
  }
};

/**
 * Complete ProductService form
 * @route PUT /api/productservice/complete
 * @access Private
 */
const completeForm = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await executeQuery(`
      UPDATE product_service_forms 
      SET is_completed = TRUE, completed_at = CURRENT_TIMESTAMP, progress_percentage = 100
      WHERE user_id = ?
    `, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'No ProductService form found for this user'
      });
    }

    res.json({
      success: true,
      message: 'ProductService form completed successfully'
    });

  } catch (error) {
    console.error('❌ Error completing ProductService form:', error);
    logger.error('Error completing ProductService form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete form',
      error: error.message
    });
  }
};

/**
 * Get all ProductService forms (Admin)
 * @route GET /api/productservice/admin/all
 * @access Private (Admin)
 */
const getAllForms = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const forms = await executeQuery(`
      SELECT psf.*, u.email as user_email, u.fullname as user_name
      FROM product_service_forms psf
      LEFT JOIN users u ON psf.user_id = u.id
      ORDER BY psf.created_at DESC
    `);

    // Parse JSON fields for each form
    const parsedForms = forms.map(form => ({
      ...form,
      industry: form.industry ? JSON.parse(form.industry) : [],
      reach_locations: form.reach_locations ? JSON.parse(form.reach_locations) : [],
      brand_personality: form.brand_personality ? JSON.parse(form.brand_personality) : [],
      design_style: form.design_style ? JSON.parse(form.design_style) : [],
      preferred_colors: form.preferred_colors ? JSON.parse(form.preferred_colors) : [],
      colors_to_avoid: form.colors_to_avoid ? JSON.parse(form.colors_to_avoid) : [],
      brand_kit_use: form.brand_kit_use ? JSON.parse(form.brand_kit_use) : [],
      brand_elements: form.brand_elements ? JSON.parse(form.brand_elements) : [],
      file_formats: form.file_formats ? JSON.parse(form.file_formats) : [],
      platform_support: form.platform_support ? JSON.parse(form.platform_support) : [],
      reference_materials: form.reference_materials ? JSON.parse(form.reference_materials) : []
    }));

    res.json({
      success: true,
      message: 'All ProductService forms retrieved successfully',
      data: {
        total_forms: parsedForms.length,
        forms: parsedForms
      }
    });

  } catch (error) {
    console.error('❌ Error getting all ProductService forms:', error);
    logger.error('Error getting all ProductService forms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve forms',
      error: error.message
    });
  }
};

/**
 * Get ProductService form by ID (Admin)
 * @route GET /api/productservice/admin/:id
 * @access Private (Admin)
 */
const getFormById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const forms = await executeQuery(
      'SELECT * FROM product_service_forms WHERE id = ?',
      [id]
    );

    if (forms.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ProductService form not found'
      });
    }

    const formData = forms[0];

    // Parse JSON fields
    const parsedFormData = {
      ...formData,
      industry: formData.industry ? JSON.parse(formData.industry) : [],
      reach_locations: formData.reach_locations ? JSON.parse(formData.reach_locations) : [],
      brand_personality: formData.brand_personality ? JSON.parse(formData.brand_personality) : [],
      design_style: formData.design_style ? JSON.parse(formData.design_style) : [],
      preferred_colors: formData.preferred_colors ? JSON.parse(formData.preferred_colors) : [],
      colors_to_avoid: formData.colors_to_avoid ? JSON.parse(formData.colors_to_avoid) : [],
      brand_kit_use: formData.brand_kit_use ? JSON.parse(formData.brand_kit_use) : [],
      brand_elements: formData.brand_elements ? JSON.parse(formData.brand_elements) : [],
      file_formats: formData.file_formats ? JSON.parse(formData.file_formats) : [],
      platform_support: formData.platform_support ? JSON.parse(formData.platform_support) : [],
      reference_materials: formData.reference_materials ? JSON.parse(formData.reference_materials) : []
    };

    res.json({
      success: true,
      message: 'ProductService form retrieved successfully',
      data: parsedFormData
    });

  } catch (error) {
    console.error('❌ Error getting ProductService form by ID:', error);
    logger.error('Error getting ProductService form by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve form',
      error: error.message
    });
  }
};

/**
 * Delete ProductService form (Admin)
 * @route DELETE /api/productservice/admin/:id
 * @access Private (Admin)
 */
const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Get form data to clean up files
    const forms = await executeQuery(
      'SELECT reference_materials FROM product_service_forms WHERE id = ?',
      [id]
    );

    if (forms.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ProductService form not found'
      });
    }

    const formData = forms[0];

    // Clean up uploaded files
    if (formData.reference_materials) {
      try {
        const filePaths = JSON.parse(formData.reference_materials);
        await cleanupOldFiles(filePaths);
      } catch (cleanupError) {
        console.error('Error cleaning up files:', cleanupError);
        // Continue with deletion even if cleanup fails
      }
    }

    // Delete the form
    const result = await executeQuery(
      'DELETE FROM product_service_forms WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'ProductService form deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting ProductService form:', error);
    logger.error('Error deleting ProductService form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete form',
      error: error.message
    });
  }
};

module.exports = {
  saveFormData,
  getFormData,
  completeForm,
  getAllForms,
  getFormById,
  deleteForm
};
