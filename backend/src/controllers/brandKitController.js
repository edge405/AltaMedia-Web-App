const { executeQuery, executeTransaction } = require('../config/mysql');
const logger = require('../utils/logger');
const { extractFileUploads, cleanupOldFiles } = require('../utils/fileUploadUtils');
const { v4: uuidv4 } = require('uuid');

/**
 * Helper function to validate and clean form data for MySQL
 * @param {Object} stepData - Raw form data from frontend
 * @returns {Object} Cleaned and validated data for MySQL
 */
const validateAndCleanFormData = (stepData) => {
  // Define all valid fields for the company_brand_kit_forms table
  const validFields = [
    'building_type', 'business_email', 'has_proventous_id', 'proventous_id', 'business_name',
    'contact_number', 'preferred_contact', 'industry', 'year_started', 'primary_location',
    'behind_brand', 'current_customers', 'want_to_attract', 'team_description',
    'desired_emotion', 'target_professions', 'reach_locations', 'age_groups',
    'spending_habits', 'interaction_methods', 'customer_challenges', 'customer_motivation',
    'audience_behavior', 'customer_choice', 'culture_words', 'team_traditions',
    'team_highlights', 'reason1', 'reason2', 'reason3', 'brand_soul', 'brand_tone',
    'brand1', 'brand2', 'brand3', 'brand_avoid', 'mission_statement', 'long_term_vision',
    'core_values', 'brand_personality', 'has_logo', 'logo_action', 'preferred_colors',
    'colors_to_avoid', 'font_styles', 'design_style', 'logo_type', 'imagery_style',
    'inspiration_links', 'brand_kit_use', 'brand_elements', 'file_formats',
    'primary_goal', 'short_term_goals', 'mid_term_goals', 'long_term_goal',
    'big_picture_vision', 'success_metrics', 'business_description', 'inspiration',
    'target_interests', 'current_interests', 'special_notes', 'timeline', 'approver',
    'reference_materials', 'spending_type', 'secondary_audience', 'emotional_goal',
    'culture_description', 'business_stage', 'purchase_motivators', 
    'has_social_media', 'social_media_platforms', 'facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url',
    'tiktok_url', 'youtube_url', 'pinterest_url', 'snapchat_username', 'other_social_media_urls',
    'want_to_create_social_media', 'desired_social_media_platforms'
  ];

  // Fields that should be stored as JSON in the database
  const jsonFields = [
    'industry', 'current_customers', 'target_professions', 'reach_locations', 
    'age_groups', 'spending_habits', 'interaction_methods', 'audience_behavior',
    'culture_words', 'brand_tone', 'core_values', 'brand_personality', 
    'logo_action', 'preferred_colors', 'colors_to_avoid', 'font_styles',
    'design_style', 'logo_type', 'imagery_style', 'brand_kit_use', 
    'brand_elements', 'file_formats', 'success_metrics', 'target_interests',
    'current_interests', 'social_media_platforms', 'desired_social_media_platforms',
    'primary_location'
  ];

  const cleanedData = {};
  
  // Process only valid fields from the stepData
  for (const [key, value] of Object.entries(stepData)) {
    if (validFields.includes(key)) {
      // Convert undefined to null for MySQL
      if (value === undefined) {
        cleanedData[key] = null;
      } else if (value === null) {
        cleanedData[key] = null;
      } else {
        // Handle special data type conversions for MySQL
        if (key === 'year_started' && typeof value === 'string') {
          cleanedData[key] = parseInt(value) || null;
        } else if (Array.isArray(value)) {
          // Convert arrays to JSON strings for MySQL
          if (value.length === 0) {
            cleanedData[key] = null;
          } else {
            cleanedData[key] = JSON.stringify(value);
          }
        } else if (jsonFields.includes(key)) {
          // Handle JSON fields - convert objects/arrays to JSON strings
          if (typeof value === 'string') {
            // For JSON fields that are already strings, validate they are valid JSON
            try {
              JSON.parse(value);
              cleanedData[key] = value;
            } catch (e) {
              console.warn(`Invalid JSON for field ${key}:`, e);
              cleanedData[key] = null;
            }
          } else if (typeof value === 'object' && value !== null) {
            // Convert objects to JSON strings for MySQL
            cleanedData[key] = JSON.stringify(value);
          } else {
            cleanedData[key] = value;
          }
        } else {
          cleanedData[key] = value;
        }
      }
    }
  }

  console.log('🔍 Cleaned data before return:', cleanedData);
  console.log('🔍 Number of fields in cleaned data:', Object.keys(cleanedData).length);

  return cleanedData;
};

/**
 * Save or update BrandKit form data for a specific step (MySQL)
 * @route PUT /api/brandkit/save
 * @access Private
 */
const saveFormData = async (req, res) => {
  try {
    console.log('📥 Received request body:', req.body);
    let { userId, stepData, currentStep } = req.body;

    // Parse stepData if it's a string (from FormData)
    if (typeof stepData === 'string') {
      try {
        stepData = JSON.parse(stepData);
        console.log('📋 Parsed stepData from JSON string');
      } catch (e) {
        console.error('❌ Failed to parse stepData JSON:', e);
        return res.status(400).json({
          success: false,
          message: 'Invalid stepData format',
          error: e.message
        });
      }
    }

    console.log('📋 Extracted fields:', { userId, stepData, currentStep });

    if (!userId || !stepData || !currentStep) {
      console.log('❌ Missing fields detected');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, stepData, currentStep',
        received: { userId, stepData: !!stepData, currentStep }
      });
    }

    logger.info(`Saving BrandKit form data for user ${userId}, step ${currentStep} (MySQL)`);

    try {
      // === FILE UPLOAD PROCESSING ===
      console.log('📁 Processing file uploads...');
      let processedStepData = { ...stepData };

      // Handle file uploads for reference_materials and inspiration_links
      const fileFields = ['reference_materials', 'inspiration_links'];
      
      for (const fieldName of fileFields) {
        if (req.files && req.files[fieldName]) {
          console.log(`📁 Processing ${fieldName} files:`, req.files[fieldName]);
          
          // Extract file paths from uploaded files
          const filePaths = extractFileUploads(processedStepData, req.files[fieldName], fieldName);
          
          // Store file paths as JSON array in the database
          processedStepData[fieldName] = JSON.stringify(filePaths);
          
          console.log(`📁 ${fieldName} file paths:`, filePaths);
        }
      }

      // Clean and validate the form data
      const cleanedStepData = validateAndCleanFormData(processedStepData);
      console.log('📝 Cleaned step data for MySQL:', cleanedStepData);
      console.log('🔍 Number of fields to save:', Object.keys(cleanedStepData).length);
      console.log('🔍 Fields to save:', Object.keys(cleanedStepData));

      // === MYSQL OPERATIONS ===
      console.log('🔍 Checking for existing form data in MySQL...');
      const checkSql = 'SELECT id, current_step, progress_percentage FROM company_brand_kit_forms WHERE user_id = ? LIMIT 1';
      console.log('🔍 Executing check query:', checkSql, 'with params:', [userId]);
      const existingForm = await executeQuery(checkSql, [userId]);

      console.log('🔍 MySQL check result:', { existingForm });

      let result;

      if (existingForm && existingForm.length > 0) {
        console.log('📝 Updating existing form data in MySQL...');
        
        // Build dynamic UPDATE query
        const updateFields = Object.keys(cleanedStepData).map(key => `${key} = ?`).join(', ');
        const updateValues = Object.values(cleanedStepData).map(value => {
          if (value === undefined) {
            console.warn('⚠️ Found undefined value, converting to null');
            return null;
          }
          return value;
        });
        updateValues.push(currentStep, Math.round((currentStep / 11) * 100), existingForm[0].id);

        // Handle case where there are no fields to update (only step and progress)
        const setClause = updateFields 
          ? `${updateFields}, current_step = ?, progress_percentage = ?, updated_at = CURRENT_TIMESTAMP`
          : `current_step = ?, progress_percentage = ?, updated_at = CURRENT_TIMESTAMP`;

        const updateSql = `
          UPDATE company_brand_kit_forms 
          SET 
            ${setClause}
          WHERE id = ?
        `;

        console.log('📝 Executing update query:', updateSql);
        console.log('📝 Update values:', updateValues);
        console.log('📝 Number of placeholders in SQL:', (updateSql.match(/\?/g) || []).length);
        console.log('📝 Number of values provided:', updateValues.length);
        console.log('📝 Field names:', Object.keys(cleanedStepData));
        console.log('📝 Field values:', Object.values(cleanedStepData));
        
        await executeQuery(updateSql, updateValues);

        // Fetch updated data
        const fetchSql = 'SELECT * FROM company_brand_kit_forms WHERE id = ? LIMIT 1';
        const updatedData = await executeQuery(fetchSql, [existingForm[0].id]);
        result = updatedData[0];

        console.log('📝 MySQL update result:', { result });
      } else {
        console.log('🆕 Creating new form data in MySQL...');
        
        // Generate UUID for new form
        const formId = uuidv4();
        
        // Build dynamic INSERT query
        const insertFields = ['id', 'user_id', ...Object.keys(cleanedStepData), 'current_step', 'progress_percentage'];
        const insertPlaceholders = ['?', '?', ...Object.keys(cleanedStepData).map(() => '?'), '?', '?'];
        const insertValues = [formId, userId, ...Object.values(cleanedStepData).map(value => {
          if (value === undefined) {
            console.warn('⚠️ Found undefined value in INSERT, converting to null');
            return null;
          }
          return value;
        }), currentStep, Math.round((currentStep / 11) * 100)];

        const insertSql = `
          INSERT INTO company_brand_kit_forms (
            ${insertFields.join(', ')}
          ) VALUES (${insertPlaceholders.join(', ')})
        `;

        console.log('🆕 Executing insert query:', insertSql);
        console.log('🆕 Insert values:', insertValues);
        console.log('🆕 Number of placeholders in SQL:', (insertSql.match(/\?/g) || []).length);
        console.log('🆕 Number of values provided:', insertValues.length);
        console.log('🆕 Field names:', insertFields);
        console.log('🆕 Field values:', insertValues);
        
        await executeQuery(insertSql, insertValues);

        // Fetch created data
        const fetchSql = 'SELECT * FROM company_brand_kit_forms WHERE id = ? LIMIT 1';
        const createdData = await executeQuery(fetchSql, [formId]);
        result = createdData[0];

        console.log('🆕 MySQL insert result:', { result });
      }

      logger.info(`Successfully saved BrandKit form data for user ${userId}, step ${currentStep} (MySQL)`);

      res.json({
        success: true,
        message: 'Form data saved successfully to MySQL',
        data: {
          formId: result.id,
          currentStep: result.current_step,
          progressPercentage: result.progress_percentage,
          isCompleted: result.is_completed || false,
          updatedAt: result.updated_at
        }
      });

    } catch (error) {
      console.error('❌ Unexpected error in saveFormData:', error);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error errno:', error.errno);
      console.error('❌ Error sqlMessage:', error.sqlMessage);
      logger.error('Unexpected error in saveFormData:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
        details: {
          code: error.code,
          errno: error.errno,
          sqlMessage: error.sqlMessage
        }
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
 * Get BrandKit form data for a user (MySQL)
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

    logger.info(`Fetching BrandKit form data for user ${userId} (MySQL)`);

    console.log('🔍 Fetching from MySQL...');
    const sql = `
      SELECT * FROM company_brand_kit_forms 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    const formData = await executeQuery(sql, [userId]);

    // If no data found
    if (!formData || formData.length === 0) {
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

    const data = formData[0];
    console.log('✅ Data found in MySQL');

    logger.info(`Successfully fetched BrandKit form data for user ${userId} from MySQL`);

    res.json({
      success: true,
      message: 'Form data retrieved successfully from MySQL',
      data: {
        formData: data,
        currentStep: data.current_step || 1,
        progressPercentage: data.progress_percentage || 0,
        isCompleted: data.is_completed || false
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

/**
 * Mark BrandKit form as completed
 * @route PUT /api/brandkit/complete/:userId
 * @access Private
 */
const completeForm = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await executeQuery(
      'UPDATE company_brand_kit_forms SET is_completed = TRUE, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'BrandKit form not found for this user'
      });
    }

    // Get the updated form
    const [form] = await executeQuery(
      'SELECT * FROM company_brand_kit_forms WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'BrandKit form marked as completed',
      data: {
        form_id: form.id,
        is_completed: form.is_completed,
        completed_at: form.completed_at
      }
    });

  } catch (error) {
    console.error('❌ Error completing BrandKit form:', error);
    logger.error('BrandKit form completion error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to complete BrandKit form',
      error: error.message
    });
  }
};

/**
 * Get all BrandKit form data (for admin purposes)
 * @route GET /api/brandkit/admin/all
 * @access Private
 */
const getAllForms = async (req, res) => {
  try {
    logger.info('Fetching all BrandKit form data from MySQL');

    const sql = `
      SELECT 
        cbf.*,
        u.email as user_email, 
        u.fullname as user_fullname,
        u.phone_number as user_phone,
        u.address as user_address,
        u.role as user_role,
        u.created_at as user_created_at
      FROM company_brand_kit_forms cbf
      LEFT JOIN users u ON cbf.user_id = u.id
      ORDER BY cbf.created_at DESC
    `;

    const formData = await executeQuery(sql);

    logger.info(`Successfully fetched ${formData.length} BrandKit form records from MySQL`);

    // Transform the data to include calculated fields for better display
    const transformedForms = formData.map(form => {
      // Calculate progress percentage based on completed fields
      const totalFields = 50; // Approximate total fields in BrandKit form
      const completedFields = Object.values(form).filter(value => 
        value !== null && value !== undefined && value !== ''
      ).length;
      const progressPercentage = Math.round((completedFields / totalFields) * 100);

      return {
        ...form,
        progress_percentage: progressPercentage,
        is_completed: progressPercentage >= 80, // Consider 80%+ as completed
        user_fullname: form.user_fullname || 'Unknown User',
        user_email: form.user_email || 'No email provided',
        business_name: form.business_name || 'No business name',
        contact_number: form.contact_number || form.user_phone || 'No contact number',
        primary_location: form.primary_location || form.user_address || 'No location specified'
      };
    });

    res.json({
      success: true,
      message: 'All form data retrieved successfully from MySQL',
      data: {
        totalRecords: transformedForms.length,
        forms: transformedForms
      }
    });

  } catch (error) {
    logger.error('Unexpected error in getAllForms:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get BrandKit form by ID (for admin purposes)
 * @route GET /api/brandkit/admin/:id
 * @access Private
 */
const getFormById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Form ID is required'
      });
    }

    logger.info(`Fetching BrandKit form data by ID ${id} from MySQL`);

    const sql = `
      SELECT cbf.*, u.email as user_email, u.fullname as user_fullname
      FROM company_brand_kit_forms cbf
      LEFT JOIN users u ON cbf.user_id = u.id
      WHERE cbf.id = ?
    `;

    const formData = await executeQuery(sql, [id]);

    if (!formData || formData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    const data = formData[0];

    logger.info(`Successfully fetched BrandKit form data by ID ${id} from MySQL`);

    res.json({
      success: true,
      message: 'Form data retrieved successfully from MySQL',
      data: {
        form: data
      }
    });

  } catch (error) {
    logger.error('Unexpected error in getFormById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete BrandKit form (for admin purposes)
 * @route DELETE /api/brandkit/admin/:id
 * @access Private
 */
const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Form ID is required'
      });
    }

    logger.info(`Deleting BrandKit form data by ID ${id} from MySQL`);

    // Get form data for cleanup
    const formData = await executeQuery(
      'SELECT * FROM company_brand_kit_forms WHERE id = ?',
      [id]
    );

    if (!formData || formData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    const form = formData[0];

    // Clean up uploaded files
    await cleanupOldFiles(form);

    // Delete the form
    await executeQuery(
      'DELETE FROM company_brand_kit_forms WHERE id = ?',
      [id]
    );

    logger.info(`Successfully deleted BrandKit form data by ID ${id} from MySQL`);

    res.json({
      success: true,
      message: 'Form deleted successfully from MySQL'
    });

  } catch (error) {
    logger.error('Unexpected error in deleteForm:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  saveFormData,
  getFormData,
  getAllForms
}; 