const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * Get all active addons
 * GET /api/addons
 */
const getAllAddons = async (req, res) => {
  try {
    const { data: addons, error } = await supabase
      .from('addons')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch addons',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: addons
    });

  } catch (error) {
    console.error('Get addons error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get addon by ID
 * GET /api/addons/:id
 */
const getAddonById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: addon, error } = await supabase
      .from('addons')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !addon) {
      return res.status(404).json({
        success: false,
        message: 'Addon not found'
      });
    }

    res.json({
      success: true,
      data: addon
    });

  } catch (error) {
    console.error('Get addon error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create new addon (Admin only)
 * POST /api/addons
 */
const createAddon = async (req, res) => {
  try {
    const { name, description, price_type, base_price } = req.body;

    const { data: addon, error } = await supabaseAdmin
      .from('addons')
      .insert({
        name,
        description,
        price_type,
        base_price,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create addon',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Addon created successfully',
      data: addon
    });

  } catch (error) {
    console.error('Create addon error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update addon (Admin only)
 * PUT /api/addons/:id
 */
const updateAddon = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price_type, base_price, is_active } = req.body;

    const { data: addon, error } = await supabaseAdmin
      .from('addons')
      .update({
        name,
        description,
        price_type,
        base_price,
        is_active
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !addon) {
      return res.status(404).json({
        success: false,
        message: 'Addon not found or update failed'
      });
    }

    res.json({
      success: true,
      message: 'Addon updated successfully',
      data: addon
    });

  } catch (error) {
    console.error('Update addon error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete addon (Admin only)
 * DELETE /api/addons/:id
 */
const deleteAddon = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('addons')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete addon',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Addon deleted successfully'
    });

  } catch (error) {
    console.error('Delete addon error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get user's purchased addons
 * GET /api/addons/user
 */
const getUserAddons = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's purchased addons with detailed information
    const { data: userAddons, error } = await supabase
      .from('purchased_addons')
      .select(`
        id,
        purchase_date,
        amount_paid,
        status,
        created_at,
        addon:addons (
          id,
          name,
          description,
          price_type,
          base_price
        ),
        package_purchase:package_purchases (
          id,
          purchase_date,
          expiration_date,
          status,
          package:packages (
            id,
            name,
            description
          )
        )
      `)
      .eq('package_purchase.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user addons',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: userAddons
    });

  } catch (error) {
    console.error('Get user addons error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllAddons,
  getAddonById,
  createAddon,
  updateAddon,
  deleteAddon,
  getUserAddons
}; 