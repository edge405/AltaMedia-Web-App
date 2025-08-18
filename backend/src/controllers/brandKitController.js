const { supabase } = require('../config/supabase');
const { executeQuery, executeTransaction } = require('../config/mariadb');
const logger = require('../utils/logger');
const { extractFileUploads, cleanupOldFiles } = require('../utils/fileUploadUtils');

/**
 * Helper function to validate and clean form data for Supabase
 * @param {Object} stepData - Raw form data from frontend
 * @returns {Object} Cleaned and validated data for Supabase
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
    'culture_description', 'business_stage'
  ];

  const cleanedData = {};
  
  for (const [key, value] of Object.entries(stepData)) {
    if (validFields.includes(key) && value !== undefined && value !== null) {
      // Handle special data type conversions for Supabase
      if (key === 'primary_location' && typeof value === 'string') {
        try {
          cleanedData[key] = JSON.parse(value);
        } catch (e) {
          console.warn('Failed to parse primary_location JSON:', e);
          cleanedData[key] = value;
        }
      } else if (key === 'year_started' && typeof value === 'string') {
        cleanedData[key] = parseInt(value) || null;
      } else if (Array.isArray(value) && value.length === 0) {
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
 * Save or update BrandKit form data for a specific step (Supabase + MariaDB)
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

    logger.info(`Saving BrandKit form data for user ${userId}, step ${currentStep} (Supabase + MariaDB)`);

    try {
      // === SUPABASE OPERATIONS ===
      console.log('🔍 Checking for existing form data in Supabase...');
      const { data: existingForm, error: checkError } = await supabase
        .from('company_brand_kit_forms')
        .select('id, current_step, progress_percentage')
        .eq('user_id', userId)
        .single();

      console.log('🔍 Supabase check result:', { existingForm, checkError });

      let supabaseResult;
      let supabaseSuccess = false;

      // Clean and validate the form data
      const cleanedStepData = validateAndCleanFormData(processedStepData);
      console.log('📝 Cleaned step data for Supabase:', cleanedStepData);

      if (existingForm) {
        console.log('📝 Updating existing form data in Supabase...');
        // Update existing form data in Supabase
        const { data, error } = await supabase
          .from('company_brand_kit_forms')
          .update({
            ...cleanedStepData,
            current_step: currentStep,
            progress_percentage: Math.round(currentStep * 8.33), // Calculate progress percentage
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        console.log('📝 Supabase update result:', { data, error });

        if (error) {
          console.error('❌ Error updating BrandKit form data in Supabase:', error);
          logger.error('Error updating BrandKit form data in Supabase:', error);
        } else {
          supabaseResult = data;
          supabaseSuccess = true;
        }
      } else {
        console.log('🆕 Creating new form data in Supabase...');
        // Create new form data in Supabase
        const { data, error } = await supabase
          .from('company_brand_kit_forms')
          .insert({
            user_id: userId,
            ...cleanedStepData,
            current_step: currentStep,
            progress_percentage: Math.round(currentStep * 8.33), // Calculate progress percentage
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        console.log('🆕 Supabase insert result:', { data, error });

        if (error) {
          console.error('❌ Error creating BrandKit form data in Supabase:', error);
          logger.error('Error creating BrandKit form data in Supabase:', error);
        } else {
          supabaseResult = data;
          supabaseSuccess = true;
        }
      }

      // === MARIADB OPERATIONS ===
      console.log('🔍 Checking for existing form data in MariaDB...');
      let mariaDbResult;
      let mariaDbSuccess = false;
      let mariaDbError = null;

      try {
        // First, check if the table exists
        console.log('🔍 Checking if company_brand_kit_forms table exists...');
        const tableCheck = await executeQuery(`
          SELECT COUNT(*) as count 
          FROM information_schema.tables 
          WHERE table_schema = DATABASE() 
          AND table_name = 'company_brand_kit_forms'
        `);
        
        if (tableCheck[0].count === 0) {
          console.log('❌ company_brand_kit_forms table does not exist in MariaDB');
          mariaDbError = 'Table company_brand_kit_forms does not exist';
          throw new Error('Table company_brand_kit_forms does not exist');
        }
        
        console.log('✅ company_brand_kit_forms table exists');

        const checkSql = 'SELECT id, current_step, progress_percentage FROM company_brand_kit_forms WHERE user_id = ? LIMIT 1';
        console.log('🔍 Executing check query:', checkSql, 'with params:', [userId]);
        const existingFormMariaDb = await executeQuery(checkSql, [userId]);

        console.log('🔍 MariaDB check result:', { existingFormMariaDb });

        if (existingFormMariaDb && existingFormMariaDb.length > 0) {
          console.log('📝 Updating existing form data in MariaDB...');
          
          // Filter out undefined/null values and prepare data
          const filteredStepData = {};
          const filteredValues = [];
          
          for (const [key, value] of Object.entries(processedStepData)) {
            if (value !== undefined && value !== null) {
              filteredStepData[key] = value;
              filteredValues.push(value);
            }
          }
          
          console.log('📝 Filtered step data for update:', filteredStepData);
          console.log('📝 Filtered values for update:', filteredValues);
          
          // Update existing form data in MariaDB
          const updateSql = `
            UPDATE company_brand_kit_forms 
            SET 
              current_step = ?,
              progress_percentage = ?,
              updated_at = NOW(),
              ${Object.keys(filteredStepData).map(key => `${key} = ?`).join(', ')}
            WHERE user_id = ?
          `;
          
          const updateParams = [
            currentStep,
            Math.round(currentStep * 8.33), // Calculate progress percentage (8.33% per step)
            ...filteredValues,
            userId
          ];

          console.log('📝 Executing update query:', updateSql);
          console.log('📝 Update params:', updateParams);
          await executeQuery(updateSql, updateParams);

          // Fetch updated data
          const fetchSql = 'SELECT * FROM company_brand_kit_forms WHERE user_id = ? LIMIT 1';
          const updatedData = await executeQuery(fetchSql, [userId]);
          mariaDbResult = updatedData[0];
          mariaDbSuccess = true;

          console.log('📝 MariaDB update result:', { mariaDbResult });
        } else {
          console.log('🆕 Creating new form data in MariaDB...');
          
          // Filter out undefined/null values and prepare data
          const filteredStepData = {};
          const filteredValues = [];
          
          for (const [key, value] of Object.entries(processedStepData)) {
            if (value !== undefined && value !== null) {
              filteredStepData[key] = value;
              filteredValues.push(value);
            }
          }
          
          console.log('🆕 Filtered step data:', filteredStepData);
          console.log('🆕 Filtered values:', filteredValues);
          
          // Create new form data in MariaDB
          const insertSql = `
            INSERT INTO company_brand_kit_forms (
              user_id, 
              current_step, 
              progress_percentage,
              created_at,
              updated_at,
              ${Object.keys(filteredStepData).join(', ')}
            ) VALUES (?, ?, ?, NOW(), NOW(), ${Object.keys(filteredStepData).map(() => '?').join(', ')})
          `;
          
          const insertParams = [
            userId,
            currentStep,
            Math.round(currentStep * 8.33), // Calculate progress percentage (8.33% per step)
            ...filteredValues
          ];

          console.log('🆕 Executing insert query:', insertSql);
          console.log('🆕 Insert params:', insertParams);
          
          await executeQuery(insertSql, insertParams);

          // Fetch created data
          const fetchSql = 'SELECT * FROM company_brand_kit_forms WHERE user_id = ? ORDER BY created_at DESC LIMIT 1';
          const createdData = await executeQuery(fetchSql, [userId]);
          mariaDbResult = createdData[0];
          mariaDbSuccess = true;

          console.log('🆕 MariaDB insert result:', { mariaDbResult });
        }
        
        console.log('✅ MariaDB operations completed. Success:', mariaDbSuccess);
      } catch (error) {
        console.error('❌ Error in MariaDB operations:', error);
        console.error('❌ Error details:', {
          message: error.message,
          code: error.code,
          errno: error.errno,
          sqlState: error.sqlState,
          sqlMessage: error.sqlMessage
        });
        logger.error('Error in MariaDB operations:', error);
        mariaDbError = error.message;
      }

      // === RESPONSE HANDLING ===
      console.log('🔄 Preparing response...');
      console.log('📊 Results summary:', {
        supabaseSuccess,
        mariaDbSuccess,
        supabaseResult: !!supabaseResult,
        mariaDbResult: !!mariaDbResult
      });
      
      const result = supabaseResult || mariaDbResult;
      const successCount = [supabaseSuccess, mariaDbSuccess].filter(Boolean).length;

      if (successCount === 0) {
        return res.status(500).json({
          success: false,
          message: 'Failed to save form data to both databases',
          errors: {
            supabase: !supabaseSuccess ? 'Supabase operation failed' : null,
            mariaDb: !mariaDbSuccess ? 'MariaDB operation failed' : null
          }
        });
      }

      logger.info(`Successfully saved BrandKit form data for user ${userId}, step ${currentStep} (${successCount}/2 databases)`);

      res.json({
        success: true,
        message: `Form data saved successfully to ${successCount}/2 databases`,
        data: {
          formId: result.id,
          currentStep: result.current_step,
          progressPercentage: result.progress_percentage,
          databases: {
            supabase: supabaseSuccess,
            mariaDb: mariaDbSuccess
          },
          errors: {
            supabase: !supabaseSuccess ? 'Supabase operation failed' : null,
            mariaDb: !mariaDbSuccess ? mariaDbError : null
          }
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
 * Get BrandKit form data for a user (Supabase + MariaDB)
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

    logger.info(`Fetching BrandKit form data for user ${userId} (Supabase + MariaDB)`);

    let formData = null;
    let dataSource = null;

    // Try Supabase first
    try {
      console.log('🔍 Fetching from Supabase...');
      const { data: supabaseData, error } = await supabase
        .from('company_brand_kit_forms')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error && supabaseData) {
        formData = supabaseData;
        dataSource = 'supabase';
        console.log('✅ Data found in Supabase');
      } else if (error && error.code !== 'PGRST116') {
        console.error('❌ Supabase error:', error);
      }
    } catch (supabaseError) {
      console.error('❌ Supabase fetch error:', supabaseError);
    }

    // If Supabase failed, try MariaDB
    if (!formData) {
      try {
        console.log('🔍 Fetching from MariaDB...');
        const sql = `
          SELECT * FROM company_brand_kit_forms 
          WHERE user_id = ? 
          ORDER BY created_at DESC 
          LIMIT 1
        `;
        const mariaDbData = await executeQuery(sql, [userId]);

        if (mariaDbData && mariaDbData.length > 0) {
          formData = mariaDbData[0];
          dataSource = 'mariadb';
          console.log('✅ Data found in MariaDB');
        }
      } catch (mariaDbError) {
        console.error('❌ MariaDB fetch error:', mariaDbError);
      }
    }

    // If no data found in either database
    if (!formData) {
      return res.json({
        success: true,
        message: 'No form data found for this user',
        data: {
          formData: null,
          currentStep: 1,
          progressPercentage: 0,
          isCompleted: false,
          dataSource: null
        }
      });
    }

    logger.info(`Successfully fetched BrandKit form data for user ${userId} from ${dataSource}`);

    res.json({
      success: true,
      message: `Form data retrieved successfully from ${dataSource}`,
      data: {
        formData: formData,
        currentStep: formData.current_step || 1,
        progressPercentage: formData.progress_percentage || 0,
        isCompleted: formData.is_completed || false,
        dataSource: dataSource
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
 * Get BrandKit form data for a user from MariaDB
 * @route GET /api/brandkit/data/mariadb/:userId
 * @access Private
 */
const getFormDataFromMariaDB = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    logger.info(`Fetching BrandKit form data from MariaDB for user ${userId}`);

    const sql = `
      SELECT * FROM company_brand_kit_forms 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    const formData = await executeQuery(sql, [userId]);

    if (!formData || formData.length === 0) {
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

    const data = formData[0];

    logger.info(`Successfully fetched BrandKit form data from MariaDB for user ${userId}`);

    res.json({
      success: true,
      message: 'Form data retrieved successfully from MariaDB',
      data: {
        formData: data,
        currentStep: data.current_step || 1,
        progressPercentage: data.progress_percentage || 0,
        isCompleted: data.is_completed || false
      }
    });

  } catch (error) {
    logger.error('Unexpected error in getFormDataFromMariaDB:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Save or update BrandKit form data for a specific step in MariaDB
 * @route PUT /api/brandkit/save/mariadb
 * @access Private
 */
const saveFormDataToMariaDB = async (req, res) => {
  try {
    console.log('📥 Received request body for MariaDB:', req.body);
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

    logger.info(`Saving BrandKit form data to MariaDB for user ${userId}, step ${currentStep}`);

    try {
      // Clean and validate the form data
      const cleanedStepData = validateAndCleanFormData(stepData);
      console.log('📝 Cleaned step data for MariaDB:', cleanedStepData);

      // Check if form data already exists for this user
      console.log('🔍 Checking for existing form data in MariaDB...');
      const checkSql = 'SELECT id, current_step, progress_percentage FROM company_brand_kit_forms WHERE user_id = ? LIMIT 1';
      const existingForm = await executeQuery(checkSql, [userId]);

      console.log('🔍 Check result:', { existingForm });

      let result;

      if (existingForm && existingForm.length > 0) {
        console.log('📝 Updating existing form data in MariaDB...');
        // Update existing form data
        const updateSql = `
          UPDATE company_brand_kit_forms 
          SET 
            current_step = ?,
            progress_percentage = ?,
            updated_at = NOW(),
            ${Object.keys(cleanedStepData).map(key => `${key} = ?`).join(', ')}
          WHERE user_id = ?
        `;
        
        const updateParams = [
          currentStep,
          Math.round(currentStep * 8.33), // Calculate progress percentage (8.33% per step)
          ...Object.values(cleanedStepData),
          userId
        ];

        await executeQuery(updateSql, updateParams);

        // Fetch updated data
        const fetchSql = 'SELECT * FROM company_brand_kit_forms WHERE user_id = ? LIMIT 1';
        const updatedData = await executeQuery(fetchSql, [userId]);
        result = updatedData[0];

        console.log('📝 Update result:', { result });
      } else {
        console.log('🆕 Creating new form data in MariaDB...');
        // Create new form data
        const insertSql = `
          INSERT INTO company_brand_kit_forms (
            user_id, 
            current_step, 
            progress_percentage,
            created_at,
            updated_at,
            ${Object.keys(cleanedStepData).join(', ')}
          ) VALUES (?, ?, ?, NOW(), NOW(), ${Object.keys(cleanedStepData).map(() => '?').join(', ')})
        `;
        
        const insertParams = [
          userId,
          currentStep,
          Math.round(currentStep * 8.33), // Calculate progress percentage (8.33% per step)
          ...Object.values(cleanedStepData)
        ];

        await executeQuery(insertSql, insertParams);

        // Fetch created data
        const fetchSql = 'SELECT * FROM company_brand_kit_forms WHERE user_id = ? ORDER BY created_at DESC LIMIT 1';
        const createdData = await executeQuery(fetchSql, [userId]);
        result = createdData[0];

        console.log('🆕 Insert result:', { result });
      }

      logger.info(`Successfully saved BrandKit form data to MariaDB for user ${userId}, step ${currentStep}`);

      res.json({
        success: true,
        message: 'Form data saved successfully to MariaDB',
        data: {
          formId: result.id,
          currentStep: result.current_step,
          progressPercentage: result.progress_percentage
        }
      });

    } catch (error) {
      console.error('❌ Unexpected error in saveFormDataToMariaDB:', error);
      logger.error('Unexpected error in saveFormDataToMariaDB:', error);
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
 * Get all BrandKit form data from MariaDB (for admin purposes)
 * @route GET /api/brandkit/all/mariadb
 * @access Private
 */
const getAllFormDataFromMariaDB = async (req, res) => {
  try {
    logger.info('Fetching all BrandKit form data from MariaDB');

    const sql = `
      SELECT * FROM company_brand_kit_forms 
      ORDER BY created_at DESC
    `;

    const formData = await executeQuery(sql);

    logger.info(`Successfully fetched ${formData.length} BrandKit form records from MariaDB`);

    res.json({
      success: true,
      message: 'All form data retrieved successfully from MariaDB',
      data: {
        totalRecords: formData.length,
        forms: formData
      }
    });

  } catch (error) {
    logger.error('Unexpected error in getAllFormDataFromMariaDB:', error);
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
  getAllFormDataFromMariaDB
}; 