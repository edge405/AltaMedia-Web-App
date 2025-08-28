const { executeQuery } = require('../config/mysql');
const logger = require('../utils/logger');
const { extractFileUploads, cleanupOldFiles } = require('../utils/fileUploadUtils');

/**
 * Helper function to validate and clean form data for MySQL
 * @param {Object} stepData - Raw form data from frontend
 * @returns {Object} Cleaned and validated data for MySQL
 */
const validateAndCleanFormData = (stepData) => {
  // Define all valid fields for the organization_forms table
  const validFields = [
    'building_type', 'organization_name', 'social_media_goals', 'brand_uniqueness',
    'desired_emotion', 'target_platforms', 'content_types', 'deliverables',
    'timeline', 'main_contact', 'additional_info', 'reference_materials'
  ];

  const cleanedData = {};
  
  // Initialize all fields with null to ensure no undefined values
  validFields.forEach(field => {
    cleanedData[field] = null;
  });
  
  // Override with actual values from stepData
  for (const [key, value] of Object.entries(stepData)) {
    if (validFields.includes(key)) {
      if (value !== undefined && value !== null) {
        // Handle special data type conversions for MySQL
        if (Array.isArray(value) && value.length === 0) {
          // Handle empty arrays - store as null for MySQL
          cleanedData[key] = null;
        } else {
          cleanedData[key] = value;
        }
      } else {
        // Ensure undefined/null values are explicitly set to null
        cleanedData[key] = null;
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

    console.log('📋 Extracted Organization fields:', { userId, stepData, currentStep });

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
    console.log('📁 Processing file uploads for Organization...');
    console.log('📁 req.files:', req.files);
    console.log('📁 req.files keys:', req.files ? Object.keys(req.files) : 'No files');
    console.log('📁 req.body:', req.body);
    console.log('📁 Content-Type:', req.headers['content-type']);
    let processedStepData = { ...(stepData || {}) };

    // Handle file uploads for reference_materials
    if (req.files && req.files.reference_materials) {
      console.log('📁 Processing reference_materials files:', req.files.reference_materials);
      
      try {
        // Extract file paths from uploaded files
        const filePaths = extractFileUploads(processedStepData || {}, req.files.reference_materials, 'reference_materials');
        
        // Store file paths as JSON array in the database (same as brandKit)
        processedStepData.reference_materials = JSON.stringify(filePaths || []);
        
        console.log('📁 reference_materials file paths:', filePaths);
        console.log('📁 Final processedStepData.reference_materials:', processedStepData.reference_materials);
      } catch (fileError) {
        console.error('❌ Error processing files:', fileError);
        processedStepData.reference_materials = JSON.stringify([]);
      }
    } else {
      console.log('📁 No reference_materials files found in request');
      // Ensure reference_materials is set to empty array if no files
      processedStepData.reference_materials = JSON.stringify([]);
    }

    logger.info(`Saving Organization form data for user ${userId}, step ${currentStep}`);

    try {
      // Check if form data already exists for this user
      console.log('🔍 Checking for existing Organization form data...');
      const existingForms = await executeQuery(
        'SELECT id, current_step, progress_percentage FROM organization_forms WHERE user_id = ?',
        [userId]
      );

      console.log('🔍 Organization check result:', { existingForms });

      let result;

      if (existingForms.length > 0) {
        console.log('📝 Updating existing Organization form data...');
        const existingForm = existingForms[0];
        
        // Clean and validate the data
        const cleanedData = validateAndCleanFormData(processedStepData);
        console.log('🔍 Cleaned data for UPDATE:', cleanedData);
        
        // Calculate progress percentage based on current step
        const progressPercentage = Math.round((currentStep / 4) * 100); // Organization form has 4 steps
        
        // Prepare query parameters for UPDATE with explicit null checks
        const updateQueryParams = [
          cleanedData.building_type || 'organization',
          cleanedData.organization_name || null,
          cleanedData.social_media_goals || null,
          cleanedData.brand_uniqueness || null,
          cleanedData.desired_emotion || null,
          cleanedData.target_platforms ? JSON.stringify(cleanedData.target_platforms) : null,
          cleanedData.content_types ? JSON.stringify(cleanedData.content_types) : null,
          cleanedData.deliverables ? JSON.stringify(cleanedData.deliverables) : null,
          cleanedData.timeline || null,
          cleanedData.main_contact || null,
          cleanedData.additional_info || null,
          processedStepData.reference_materials || JSON.stringify([]),
          currentStep,
          progressPercentage,
          userId
        ];
        
        console.log('🔍 Query parameters for UPDATE:', updateQueryParams);
        
        // Update existing form data
        await executeQuery(`
          UPDATE organization_forms 
          SET building_type = ?, organization_name = ?, social_media_goals = ?, 
              brand_uniqueness = ?, desired_emotion = ?, target_platforms = ?, 
              content_types = ?, deliverables = ?, timeline = ?, main_contact = ?, 
              additional_info = ?, reference_materials = ?, current_step = ?, 
              progress_percentage = ?, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `, updateQueryParams);

        result = {
          id: existingForm.id,
          current_step: currentStep,
          progress_percentage: progressPercentage,
          updated: true
        };
      } else {
        console.log('📝 Creating new Organization form data...');
        
        // Clean and validate the data
        const cleanedData = validateAndCleanFormData(processedStepData);
        console.log('🔍 Cleaned data for INSERT:', cleanedData);
        
        // Calculate progress percentage based on current step
        const progressPercentage = Math.round((currentStep / 4) * 100); // Organization form has 4 steps
        
        // Generate UUID for new form
        const { v4: uuidv4 } = require('uuid');
        const formId = uuidv4();
        
        // Prepare query parameters with explicit null checks
        const queryParams = [
          formId,
          userId,
          cleanedData.building_type || 'organization',
          cleanedData.organization_name || null,
          cleanedData.social_media_goals || null,
          cleanedData.brand_uniqueness || null,
          cleanedData.desired_emotion || null,
          cleanedData.target_platforms ? JSON.stringify(cleanedData.target_platforms) : null,
          cleanedData.content_types ? JSON.stringify(cleanedData.content_types) : null,
          cleanedData.deliverables ? JSON.stringify(cleanedData.deliverables) : null,
          cleanedData.timeline || null,
          cleanedData.main_contact || null,
          cleanedData.additional_info || null,
          processedStepData.reference_materials || JSON.stringify([]),
          currentStep,
          progressPercentage
        ];
        
        console.log('🔍 Query parameters for INSERT:', queryParams);
        
        // Insert new form data
        await executeQuery(`
          INSERT INTO organization_forms (
            id, user_id, building_type, organization_name, social_media_goals, 
            brand_uniqueness, desired_emotion, target_platforms, content_types, 
            deliverables, timeline, main_contact, additional_info, reference_materials,
            current_step, progress_percentage
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, queryParams);

        result = {
          id: formId,
          current_step: currentStep,
          progress_percentage: progressPercentage,
          created: true
        };
      }

      console.log('✅ Organization form data saved successfully:', result);

      res.json({
        success: true,
        message: 'Organization form data saved successfully',
        data: result
      });

    } catch (dbError) {
      console.error('❌ Database error in Organization saveFormData:', dbError);
      logger.error('Database error in Organization saveFormData:', dbError);
      res.status(500).json({
        success: false,
        message: 'Failed to save form data',
        error: dbError.message
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error in Organization saveFormData:', error);
    logger.error('Unexpected error in Organization saveFormData:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get Organization form data for a user
 * @route GET /api/organization/data
 * @access Private
 */
const getFormData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('🔍 Fetching Organization form data for user:', userId);

    const forms = await executeQuery(
      'SELECT * FROM organization_forms WHERE user_id = ?',
      [userId]
    );

    if (forms.length === 0) {
      // Return success with empty data instead of 404 error
      console.log('📝 No Organization form data found for user, returning empty form');
      return res.json({
        success: true,
        message: 'No Organization form data found for this user',
        data: {
          formData: {
            building_type: 'organization',
            organization_name: null,
            social_media_goals: null,
            brand_uniqueness: null,
            desired_emotion: null,
            target_platforms: [],
            content_types: [],
            deliverables: [],
            timeline: null,
            main_contact: null,
            additional_info: null,
            reference_materials: [],
            current_step: 1,
            progress_percentage: 0,
            is_completed: false
          },
          currentStep: 1
        }
      });
    }

    const formData = forms[0];

    // Parse JSON fields
    const parsedFormData = {
      ...formData,
      target_platforms: formData.target_platforms ? JSON.parse(formData.target_platforms) : [],
      content_types: formData.content_types ? JSON.parse(formData.content_types) : [],
      deliverables: formData.deliverables ? JSON.parse(formData.deliverables) : [],
      reference_materials: formData.reference_materials ? JSON.parse(formData.reference_materials) : []
    };

    console.log('✅ Organization form data retrieved successfully');

    res.json({
      success: true,
      message: 'Organization form data retrieved successfully',
      data: {
        formData: parsedFormData,
        currentStep: parsedFormData.current_step || 1
      }
    });

  } catch (error) {
    console.error('❌ Error in Organization getFormData:', error);
    logger.error('Error in Organization getFormData:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve form data',
      error: error.message
    });
  }
};

/**
 * Complete Organization form
 * @route PUT /api/organization/complete
 * @access Private
 */
const completeForm = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await executeQuery(`
      UPDATE organization_forms 
      SET is_completed = TRUE, completed_at = CURRENT_TIMESTAMP, progress_percentage = 100
      WHERE user_id = ?
    `, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'No Organization form found for this user'
      });
    }

    res.json({
      success: true,
      message: 'Organization form completed successfully'
    });

  } catch (error) {
    console.error('❌ Error completing Organization form:', error);
    logger.error('Error completing Organization form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete form',
      error: error.message
    });
  }
};

/**
 * Get all Organization forms (Admin)
 * @route GET /api/organization/admin/all
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
      SELECT of.*, u.email as user_email, u.fullname as user_name
      FROM organization_forms of
      LEFT JOIN users u ON of.user_id = u.id
      ORDER BY of.created_at DESC
    `);

    // Parse JSON fields for each form
    const parsedForms = forms.map(form => ({
      ...form,
      target_platforms: form.target_platforms ? JSON.parse(form.target_platforms) : [],
      content_types: form.content_types ? JSON.parse(form.content_types) : [],
      deliverables: form.deliverables ? JSON.parse(form.deliverables) : [],
      reference_materials: form.reference_materials ? JSON.parse(form.reference_materials) : []
    }));

    res.json({
      success: true,
      message: 'All Organization forms retrieved successfully',
      data: {
        total_forms: parsedForms.length,
        forms: parsedForms
      }
    });

  } catch (error) {
    console.error('❌ Error getting all Organization forms:', error);
    logger.error('Error getting all Organization forms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve forms',
      error: error.message
    });
  }
};

/**
 * Get Organization form by ID (Admin)
 * @route GET /api/organization/admin/:id
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
      'SELECT * FROM organization_forms WHERE id = ?',
      [id]
    );

    if (forms.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Organization form not found'
      });
    }

    const formData = forms[0];

    // Parse JSON fields
    const parsedFormData = {
      ...formData,
      target_platforms: formData.target_platforms ? JSON.parse(formData.target_platforms) : [],
      content_types: formData.content_types ? JSON.parse(formData.content_types) : [],
      deliverables: formData.deliverables ? JSON.parse(formData.deliverables) : [],
      reference_materials: formData.reference_materials ? JSON.parse(formData.reference_materials) : []
    };

    res.json({
      success: true,
      message: 'Organization form retrieved successfully',
      data: parsedFormData
    });

  } catch (error) {
    console.error('❌ Error getting Organization form by ID:', error);
    logger.error('Error getting Organization form by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve form',
      error: error.message
    });
  }
};

/**
 * Delete Organization form (Admin)
 * @route DELETE /api/organization/admin/:id
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
      'SELECT reference_materials FROM organization_forms WHERE id = ?',
      [id]
    );

    if (forms.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Organization form not found'
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
      'DELETE FROM organization_forms WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Organization form deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting Organization form:', error);
    logger.error('Error deleting Organization form:', error);
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
