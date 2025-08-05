const { supabase, supabaseAdmin } = require('../config/supabase');

// Create or update brand kit form
const createOrUpdateBrandKitForm = async (req, res) => {
  try {
    const userId = req.user.id;
    const formData = req.body;

    // Check if user already has a brand kit form
    const { data: existingForm, error: checkError } = await supabase
      .from('brand_kit_forms')
      .select('id, current_step, progress_percentage')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return res.status(500).json({
        success: false,
        message: 'Error checking existing form',
        error: checkError.message
      });
    }

    let result;
    if (existingForm) {
      // Update existing form
      const { data, error } = await supabase
        .from('brand_kit_forms')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Failed to update brand kit form',
          error: error.message
        });
      }

      result = data;
    } else {
      // Create new form
      const { data, error } = await supabase
        .from('brand_kit_forms')
        .insert({
          user_id: userId,
          ...formData
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Failed to create brand kit form',
          error: error.message
        });
      }

      result = data;
    }

    res.status(existingForm ? 200 : 201).json({
      success: true,
      message: existingForm ? 'Brand kit form updated successfully' : 'Brand kit form created successfully',
      data: result
    });

  } catch (error) {
    console.error('Brand kit form error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// PUT route - Update form progress step by step
const updateFormProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      current_step, 
      progress_percentage, 
      is_completed,
      form_data 
    } = req.body;

    // Check if user already has a form
    const { data: existingForm, error: checkError } = await supabase
      .from('brand_kit_forms')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;
    if (existingForm) {
      // Update existing form with new step data
      const { data, error } = await supabase
        .from('brand_kit_forms')
        .update({
          ...form_data,
          current_step,
          progress_percentage,
          is_completed,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Failed to update form progress',
          error: error.message
        });
      }

      result = data;
    } else {
      // Create new form with initial step data
      const { data, error } = await supabase
        .from('brand_kit_forms')
        .insert({
          user_id: userId,
          ...form_data,
          current_step,
          progress_percentage,
          is_completed
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Failed to create form progress',
          error: error.message
        });
      }

      result = data;
    }

    res.json({
      success: true,
      message: 'Form progress updated successfully',
      data: result
    });

  } catch (error) {
    console.error('Update form progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET route - Retrieve form data for user
const getBrandKitForm = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('brand_kit_forms')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Brand kit form not found',
          data: null
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve brand kit form',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Get brand kit form error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all brand kit forms (Admin only)
const getAllBrandKitForms = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('brand_kit_forms')
      .select(`
        *,
        users:user_id (
          id,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve brand kit forms',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Get all brand kit forms error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get brand kit form by ID (Admin only)
const getBrandKitFormById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('brand_kit_forms')
      .select(`
        *,
        users:user_id (
          id,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Brand kit form not found'
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve brand kit form',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Get brand kit form by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete brand kit form
const deleteBrandKitForm = async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = await supabase
      .from('brand_kit_forms')
      .delete()
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete brand kit form',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Brand kit form deleted successfully'
    });

  } catch (error) {
    console.error('Delete brand kit form error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createOrUpdateBrandKitForm,
  getBrandKitForm,
  updateFormProgress,
  getAllBrandKitForms,
  getBrandKitFormById,
  deleteBrandKitForm
}; 