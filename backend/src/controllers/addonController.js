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

    // Get features for all addons
    const addonIds = addons.map(addon => addon.id);
    const { data: allFeatures, error: featuresError } = await supabase
      .from('addon_features')
      .select('*')
      .in('addon_id', addonIds)
      .eq('is_active', true);

    if (featuresError) {
      console.error('Features fetch error:', featuresError);
    }

    // Organize addons with clear labeling and features
    const labeledAddons = addons.map(addon => {
      // Get features for this addon
      const addonFeatures = allFeatures ? allFeatures.filter(feature => feature.addon_id === addon.id) : [];
      
      // Organize features with clear labeling
      const labeledFeatures = addonFeatures.map(feature => ({
        feature_id: feature.id,
        feature_info: {
          feature_name: feature.feature_name,
          feature_description: feature.feature_description,
          is_active: feature.is_active,
          created_at: feature.created_at
        }
      }));

      return {
        addon_id: addon.id,
        addon_info: {
          name: addon.name,
          description: addon.description,
          price_type: addon.price_type,
          base_price: addon.base_price,
          is_active: addon.is_active,
          created_at: addon.created_at,
          updated_at: addon.updated_at
        },
        features: labeledFeatures
      };
    });

    res.json({
      success: true,
      message: 'Addons retrieved successfully',
      data: {
        total_addons: labeledAddons.length,
        addons: labeledAddons
      }
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
 * Get addon by ID with features
 * GET /api/addons/:id
 */
const getAddonById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get addon details
    const { data: addon, error: addonError } = await supabase
      .from('addons')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (addonError || !addon) {
      return res.status(404).json({
        success: false,
        message: 'Addon not found'
      });
    }

    // Get addon features
    const { data: features, error: featuresError } = await supabase
      .from('addon_features')
      .select('*')
      .eq('addon_id', id)
      .eq('is_active', true);

    if (featuresError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch addon features'
      });
    }

    // Organize features with clear labeling
    const labeledFeatures = (features || []).map(feature => ({
      feature_id: feature.id,
      feature_info: {
        feature_name: feature.feature_name,
        feature_description: feature.feature_description,
        is_active: feature.is_active,
        created_at: feature.created_at
      }
    }));

    res.json({
      success: true,
      message: 'Addon retrieved successfully',
      data: {
        addon_id: addon.id,
        addon_info: {
          name: addon.name,
          description: addon.description,
          price_type: addon.price_type,
          base_price: addon.base_price,
          is_active: addon.is_active,
          created_at: addon.created_at,
          updated_at: addon.updated_at
        },
        features: labeledFeatures
      }
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
    const { name, description, price_type, base_price, features } = req.body;

    // Create addon
    const { data: addon, error: addonError } = await supabaseAdmin
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

    if (addonError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create addon',
        error: addonError.message
      });
    }

    // Create features if provided
    if (features && features.length > 0) {
      const featuresData = features.map(feature => ({
        addon_id: addon.id,
        feature_name: feature.name,
        feature_description: feature.description,
        is_active: true
      }));

      const { error: featuresError } = await supabaseAdmin
        .from('addon_features')
        .insert(featuresData);

      if (featuresError) {
        console.error('Features creation error:', featuresError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Addon created successfully',
      data: {
        addon_id: addon.id,
        addon_info: {
          name: addon.name,
          description: addon.description,
          price_type: addon.price_type,
          base_price: addon.base_price,
          is_active: addon.is_active,
          created_at: addon.created_at,
          updated_at: addon.updated_at
        },
        features: features ? features.map(feature => ({
          feature_name: feature.name,
          feature_description: feature.description,
          status: 'active'
        })) : []
      }
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