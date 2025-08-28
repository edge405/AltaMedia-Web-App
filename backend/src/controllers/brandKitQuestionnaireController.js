const { executeQuery } = require('../config/mysql');
const logger = require('../utils/logger');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { v4: uuidv4 } = require('uuid');
const { extractFileUploads, cleanupOldFiles } = require('../utils/fileUploadUtils');

/**
 * Helper function to validate and clean form data for MySQL
 * @param {Object} stepData - Raw form data from frontend
 * @returns {Object} Cleaned and validated data for MySQL
 */
const validateAndCleanQuestionnaireData = (stepData) => {
  // Define all valid fields for the brandkit_questionnaire_forms table
  const validFields = [
    'brand_name', 'brand_description', 'primary_customers', 'desired_emotion',
    'unfair_advantage', 'customer_miss', 'problem_solved', 'competitors',
    'competitor_likes', 'competitor_dislikes', 'brand_differentiation',
    'brand_kit_use', 'templates', 'internal_assets', 'file_formats',
    'cultural_adaptation', 'brand_voice', 'admired_brands', 'inspiration_brand',
    'communication_perception', 'brand_logo', 'logo_redesign', 'has_existing_colors',
    'existing_colors', 'preferred_colors', 'colors_to_avoid', 'imagery_style',
    'font_types', 'font_styles', 'legal_considerations', 'source_files',
    'required_formats', 'reference_materials', 'inspiration_brands', 'brand_vibe',
    'brand_words', 'brand_avoid_words', 'tagline', 'mission', 'vision',
    'core_values', 'has_web_page', 'web_page_upload', 'want_web_page'
  ];

  // Fields that should be stored as JSON in the database
  const jsonFields = [
    'competitors', 'brand_kit_use', 'templates', 'internal_assets', 'file_formats',
    'brand_voice', 'communication_perception', 'existing_colors', 'preferred_colors',
    'colors_to_avoid', 'imagery_style', 'font_types', 'font_styles', 'source_files',
    'required_formats', 'brand_vibe', 'brand_words', 'brand_avoid_words', 'core_values'
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
        if (Array.isArray(value)) {
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
  console.log('🔍 File fields in cleaned data:', {
    brand_logo: cleanedData.brand_logo,
    reference_materials: cleanedData.reference_materials,
    web_page_upload: cleanedData.web_page_upload
  });

  return cleanedData;
};

/**
 * Save or update BrandKit Questionnaire form data for a specific step
 * @route PUT /api/brandkit-questionnaire/save
 * @access Private
 */
const saveFormData = async (req, res) => {
  try {
    console.log('📥 Received BrandKit Questionnaire request body:', req.body);
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

    logger.info(`Saving BrandKit Questionnaire form data for user ${userId}, step ${currentStep}`);

    try {
      // === FILE UPLOAD PROCESSING ===
      console.log('📁 Processing file uploads...');
      console.log('📁 req.files:', req.files);
      console.log('📁 req.body:', req.body);
      console.log('📁 stepData keys:', Object.keys(stepData));
      let processedStepData = { ...stepData };

      // Handle file uploads for brand_logo, reference_materials, and web_page_upload
      const fileFields = ['brand_logo', 'reference_materials', 'web_page_upload'];
      
      for (const fieldName of fileFields) {
        console.log(`📁 Checking for ${fieldName} files...`);
        console.log(`📁 req.files[${fieldName}]:`, req.files ? req.files[fieldName] : 'No req.files');
        
        // Only process if there are actual uploaded files
        if (req.files && req.files[fieldName] && req.files[fieldName].length > 0) {
          console.log(`📁 Processing ${fieldName} files:`, req.files[fieldName]);
          
          // Extract file paths from uploaded files
          const filePaths = extractFileUploads(processedStepData, req.files[fieldName], fieldName);
          
          // Store file paths as JSON array in the database
          processedStepData[fieldName] = JSON.stringify(filePaths);
          
          console.log(`📁 ${fieldName} file paths:`, filePaths);
          console.log(`📁 ${fieldName} JSON string:`, processedStepData[fieldName]);
        } else {
          console.log(`📁 No files uploaded for ${fieldName}, removing from processed data`);
          // Remove empty file fields from processed data to avoid storing empty objects
          delete processedStepData[fieldName];
        }
      }

             // Clean and validate the form data
       const cleanedStepData = validateAndCleanQuestionnaireData(processedStepData);
       console.log('📝 Cleaned step data:', cleanedStepData);
       console.log('🔍 Number of fields to save:', Object.keys(cleanedStepData).length);
       console.log('🔍 Fields to save:', Object.keys(cleanedStepData));

             // === MYSQL OPERATIONS ===
       console.log('🔍 Checking for existing form data in MySQL...');
       const checkSql = 'SELECT id, current_step, progress_percentage FROM brandkit_questionnaire_forms WHERE user_id = ? LIMIT 1';
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
         updateValues.push(currentStep, Math.round((currentStep / 9) * 100), existingForm[0].id);

         // Handle case where there are no fields to update (only step and progress)
         const setClause = updateFields 
           ? `${updateFields}, current_step = ?, progress_percentage = ?, updated_at = CURRENT_TIMESTAMP`
           : `current_step = ?, progress_percentage = ?, updated_at = CURRENT_TIMESTAMP`;

         const updateSql = `
           UPDATE brandkit_questionnaire_forms 
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
         const fetchSql = 'SELECT * FROM brandkit_questionnaire_forms WHERE id = ? LIMIT 1';
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
         }), currentStep, Math.round((currentStep / 9) * 100)];

         const insertSql = `
           INSERT INTO brandkit_questionnaire_forms (
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
         const fetchSql = 'SELECT * FROM brandkit_questionnaire_forms WHERE id = ? LIMIT 1';
         const createdData = await executeQuery(fetchSql, [formId]);
         result = createdData[0];

         console.log('🆕 MySQL insert result:', { result });
       }

             logger.info(`Successfully saved BrandKit Questionnaire form data for user ${userId}, step ${currentStep} (MySQL)`);

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

    } catch (dbError) {
      console.error('Database error:', dbError);
      logger.error('Database error in saveFormData:', dbError);
      res.status(500).json({
        success: false,
        message: 'Database error occurred while saving form data',
        error: dbError.message
      });
    }

  } catch (error) {
    logger.error('Unexpected error in saveFormData:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get BrandKit Questionnaire form data for a user
 * @route GET /api/brandkit-questionnaire/data/:userId
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

    logger.info(`Fetching BrandKit Questionnaire form data for user ${userId}`);

         console.log('🔍 Fetching from MySQL...');
     const sql = `
       SELECT * FROM brandkit_questionnaire_forms 
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

     logger.info(`Successfully fetched BrandKit Questionnaire form data for user ${userId} from MySQL`);

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
 * Get all BrandKit Questionnaire forms (Admin)
 * @route GET /api/brandkit-questionnaire/admin/all
 * @access Private (Admin)
 */
const getAllForms = async (req, res) => {
  try {
    logger.info('Fetching all BrandKit Questionnaire forms for admin');

    const sql = `
      SELECT 
        bqf.*,
        u.email as user_email,
        u.fullname as user_name
      FROM brandkit_questionnaire_forms bqf
      LEFT JOIN users u ON bqf.user_id = u.id
      ORDER BY bqf.created_at DESC
    `;
    
    const forms = await executeQuery(sql);

    // Parse JSON fields for each form
    const parsedForms = forms.map(form => {
      const parsed = { ...form };
      const jsonFields = [
        'competitors', 'brand_kit_use', 'templates', 'internal_assets', 'file_formats',
        'brand_voice', 'communication_perception', 'imagery_style', 'font_types',
        'font_styles', 'source_files', 'required_formats', 'brand_vibe',
        'brand_words', 'brand_avoid_words', 'core_values'
      ];

      jsonFields.forEach(field => {
        if (parsed[field] && typeof parsed[field] === 'string') {
          try {
            parsed[field] = JSON.parse(parsed[field]);
          } catch (e) {
            console.warn(`Failed to parse JSON field ${field}:`, e);
            parsed[field] = null;
          }
        }
      });

      return parsed;
    });

    logger.info(`Successfully fetched ${parsedForms.length} BrandKit Questionnaire forms`);

    res.json({
      success: true,
      message: 'All BrandKit Questionnaire forms retrieved successfully',
      data: {
        total_forms: parsedForms.length,
        forms: parsedForms
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
 * Mark BrandKit Questionnaire form as completed
 * @route PUT /api/brandkit-questionnaire/complete/:userId
 * @access Private
 */
const completeForm = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    logger.info(`Marking BrandKit Questionnaire form as completed for user ${userId}`);

    // First, let's check the current state
    const checkSql = 'SELECT current_step, progress_percentage, is_completed FROM brandkit_questionnaire_forms WHERE user_id = ?';
    const currentData = await executeQuery(checkSql, [userId]);
    
    if (currentData && currentData.length > 0) {
      console.log('📊 Current form state before completion:', currentData[0]);
    }

    const sql = `
      UPDATE brandkit_questionnaire_forms 
      SET is_completed = TRUE, current_step = 9, progress_percentage = 100, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `;
    
    console.log('🎯 Marking form as completed for user:', userId);
    
    const result = await executeQuery(sql, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'No BrandKit Questionnaire form found for this user'
      });
    }

    // Verify the update worked
    const verifySql = 'SELECT current_step, progress_percentage, is_completed FROM brandkit_questionnaire_forms WHERE user_id = ?';
    const verifyData = await executeQuery(verifySql, [userId]);
    
    if (verifyData && verifyData.length > 0) {
      console.log('✅ Form state after completion:', verifyData[0]);
    }

    logger.info(`Successfully marked BrandKit Questionnaire form as completed for user ${userId}`);

    res.json({
      success: true,
      message: 'BrandKit Questionnaire form marked as completed',
      data: {
        currentStep: 9,
        progressPercentage: 100,
        isCompleted: true
      }
    });

  } catch (error) {
    logger.error('Unexpected error in completeForm:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete BrandKit Questionnaire form (for admin purposes)
 * @route DELETE /api/brandkit-questionnaire/admin/:id
 * @access Private (Admin)
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

    logger.info(`Deleting BrandKit Questionnaire form data by ID ${id} from MySQL`);

    // Get form data for cleanup
    const formData = await executeQuery(
      'SELECT * FROM brandkit_questionnaire_forms WHERE id = ?',
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
    const fileFields = ['brand_logo', 'reference_materials', 'web_page_upload'];
    for (const fieldName of fileFields) {
      if (form[fieldName]) {
        try {
          const filePaths = JSON.parse(form[fieldName]);
          if (Array.isArray(filePaths)) {
            cleanupOldFiles(filePaths, []);
          }
        } catch (e) {
          console.warn(`Could not parse file paths for ${fieldName}:`, e);
        }
      }
    }

    // Delete the form
    await executeQuery(
      'DELETE FROM brandkit_questionnaire_forms WHERE id = ?',
      [id]
    );

    logger.info(`Successfully deleted BrandKit Questionnaire form data by ID ${id} from MySQL`);

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
  getAllForms,
  completeForm,
  deleteForm
};
