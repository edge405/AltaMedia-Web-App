const { executeQuery } = require('../config/mysql');

/**
 * Get all active addons
 * GET /api/addons
 */
const getAllAddons = async (req, res) => {
  try {
    const addons = await executeQuery(`
      SELECT * FROM addons 
      WHERE is_active = TRUE 
      ORDER BY created_at DESC
    `);

    if (!addons) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch addons'
      });
    }

    // Get features for all addons
    const addonIds = addons.map(addon => addon.id);
    let allFeatures = [];
    
    if (addonIds.length > 0) {
      const placeholders = addonIds.map(() => '?').join(',');
      allFeatures = await executeQuery(`
        SELECT * FROM addon_features 
        WHERE addon_id IN (${placeholders}) AND is_active = TRUE
      `, addonIds);
    }

    // Organize addons with clear labeling and features
    const labeledAddons = addons.map(addon => {
      // Get features for this addon
      const addonFeatures = allFeatures.filter(feature => feature.addon_id === addon.id);
      
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
    const addons = await executeQuery(`
      SELECT * FROM addons 
      WHERE id = ? AND is_active = TRUE
    `, [id]);

    if (!addons || addons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Addon not found'
      });
    }

    const addon = addons[0];

    // Get features for this addon
    const features = await executeQuery(`
      SELECT * FROM addon_features 
      WHERE addon_id = ? AND is_active = TRUE
      ORDER BY created_at ASC
    `, [id]);

    // Organize features with clear labeling
    const labeledFeatures = features.map(feature => ({
      feature_id: feature.id,
      feature_info: {
        feature_name: feature.feature_name,
        feature_description: feature.feature_description,
        is_active: feature.is_active,
        created_at: feature.created_at
      }
    }));

    const addonWithFeatures = {
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

    res.json({
      success: true,
      message: 'Addon retrieved successfully',
      data: addonWithFeatures
    });

  } catch (error) {
    console.error('Get addon by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create a new addon
 * POST /api/addons
 */
const createAddon = async (req, res) => {
  try {
    const { name, description, price_type, base_price, features = [] } = req.body;

    if (!name || !price_type || !base_price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, price_type, base_price'
      });
    }

    // Validate price_type
    const validPriceTypes = ['one-time', 'subscription', 'usage-based'];
    if (!validPriceTypes.includes(price_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid price_type. Must be one of: one-time, subscription, usage-based'
      });
    }

    // Validate base_price
    if (base_price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Base price must be non-negative'
      });
    }

    // Create addon
    const addonResult = await executeQuery(`
      INSERT INTO addons (name, description, price_type, base_price, is_active)
      VALUES (?, ?, ?, ?, TRUE)
    `, [name, description, price_type, base_price]);

    const addonId = addonResult.insertId;

    // Create features if provided
    if (features && features.length > 0) {
      for (const feature of features) {
        await executeQuery(`
          INSERT INTO addon_features (addon_id, feature_name, feature_description, is_active)
          VALUES (?, ?, ?, TRUE)
        `, [addonId, feature.feature_name, feature.feature_description]);
      }
    }

    // Get the created addon with features
    const createdAddons = await executeQuery(`
      SELECT * FROM addons WHERE id = ?
    `, [addonId]);

    const createdAddon = createdAddons[0];

    const createdFeatures = await executeQuery(`
      SELECT * FROM addon_features WHERE addon_id = ?
    `, [addonId]);

    const addonWithFeatures = {
      addon_id: createdAddon.id,
      addon_info: {
        name: createdAddon.name,
        description: createdAddon.description,
        price_type: createdAddon.price_type,
        base_price: createdAddon.base_price,
        is_active: createdAddon.is_active,
        created_at: createdAddon.created_at,
        updated_at: createdAddon.updated_at
      },
      features: createdFeatures.map(feature => ({
        feature_id: feature.id,
        feature_info: {
          feature_name: feature.feature_name,
          feature_description: feature.feature_description,
          is_active: feature.is_active,
          created_at: feature.created_at
        }
      }))
    };

    res.status(201).json({
      success: true,
      message: 'Addon created successfully',
      data: addonWithFeatures
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
 * Update addon
 * PUT /api/addons/:id
 */
const updateAddon = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price_type, base_price, is_active } = req.body;

    // Check if addon exists
    const existingAddons = await executeQuery(`
      SELECT * FROM addons WHERE id = ?
    `, [id]);

    if (!existingAddons || existingAddons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Addon not found'
      });
    }

    // Validate price_type if provided
    if (price_type) {
      const validPriceTypes = ['one-time', 'subscription', 'usage-based'];
      if (!validPriceTypes.includes(price_type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid price_type. Must be one of: one-time, subscription, usage-based'
        });
      }
    }

    // Validate base_price if provided
    if (base_price !== undefined && base_price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Base price must be non-negative'
      });
    }

    // Update addon
    await executeQuery(`
      UPDATE addons 
      SET name = ?, description = ?, price_type = ?, base_price = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name || existingAddons[0].name,
      description !== undefined ? description : existingAddons[0].description,
      price_type || existingAddons[0].price_type,
      base_price !== undefined ? base_price : existingAddons[0].base_price,
      is_active !== undefined ? is_active : existingAddons[0].is_active,
      id
    ]);

    // Get the updated addon
    const updatedAddons = await executeQuery(`
      SELECT * FROM addons WHERE id = ?
    `, [id]);

    const updatedAddon = updatedAddons[0];

    res.json({
      success: true,
      message: 'Addon updated successfully',
      data: {
        addon_id: updatedAddon.id,
        addon_info: {
          name: updatedAddon.name,
          description: updatedAddon.description,
          price_type: updatedAddon.price_type,
          base_price: updatedAddon.base_price,
          is_active: updatedAddon.is_active,
          created_at: updatedAddon.created_at,
          updated_at: updatedAddon.updated_at
        }
      }
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
 * Delete addon (soft delete)
 * DELETE /api/addons/:id
 */
const deleteAddon = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if addon exists
    const existingAddons = await executeQuery(`
      SELECT * FROM addons WHERE id = ?
    `, [id]);

    if (!existingAddons || existingAddons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Addon not found'
      });
    }

    // Soft delete by setting is_active to false
    await executeQuery(`
      UPDATE addons 
      SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);

    // Also deactivate all features for this addon
    await executeQuery(`
      UPDATE addon_features 
      SET is_active = FALSE
      WHERE addon_id = ?
    `, [id]);

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
 * Add feature to addon
 * POST /api/addons/:id/features
 */
const addFeatureToAddon = async (req, res) => {
  try {
    const { id } = req.params;
    const { feature_name, feature_description } = req.body;

    if (!feature_name) {
      return res.status(400).json({
        success: false,
        message: 'Feature name is required'
      });
    }

    // Check if addon exists and is active
    const addons = await executeQuery(`
      SELECT * FROM addons WHERE id = ? AND is_active = TRUE
    `, [id]);

    if (!addons || addons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Addon not found or inactive'
      });
    }

    // Create feature
    const featureResult = await executeQuery(`
      INSERT INTO addon_features (addon_id, feature_name, feature_description, is_active)
      VALUES (?, ?, ?, TRUE)
    `, [id, feature_name, feature_description]);

    const featureId = featureResult.insertId;

    // Get the created feature
    const features = await executeQuery(`
      SELECT * FROM addon_features WHERE id = ?
    `, [featureId]);

    const feature = features[0];

    res.status(201).json({
      success: true,
      message: 'Feature added successfully',
      data: {
        feature_id: feature.id,
        feature_info: {
          feature_name: feature.feature_name,
          feature_description: feature.feature_description,
          is_active: feature.is_active,
          created_at: feature.created_at
        }
      }
    });

  } catch (error) {
    console.error('Add feature to addon error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update addon feature
 * PUT /api/addons/:addonId/features/:featureId
 */
const updateAddonFeature = async (req, res) => {
  try {
    const { addonId, featureId } = req.params;
    const { feature_name, feature_description, is_active } = req.body;

    // Check if feature exists and belongs to the addon
    const features = await executeQuery(`
      SELECT * FROM addon_features WHERE id = ? AND addon_id = ?
    `, [featureId, addonId]);

    if (!features || features.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      });
    }

    // Update feature
    await executeQuery(`
      UPDATE addon_features 
      SET feature_name = ?, feature_description = ?, is_active = ?
      WHERE id = ?
    `, [
      feature_name || features[0].feature_name,
      feature_description !== undefined ? feature_description : features[0].feature_description,
      is_active !== undefined ? is_active : features[0].is_active,
      featureId
    ]);

    // Get the updated feature
    const updatedFeatures = await executeQuery(`
      SELECT * FROM addon_features WHERE id = ?
    `, [featureId]);

    const updatedFeature = updatedFeatures[0];

    res.json({
      success: true,
      message: 'Feature updated successfully',
      data: {
        feature_id: updatedFeature.id,
        feature_info: {
          feature_name: updatedFeature.feature_name,
          feature_description: updatedFeature.feature_description,
          is_active: updatedFeature.is_active,
          created_at: updatedFeature.created_at
        }
      }
    });

  } catch (error) {
    console.error('Update addon feature error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete addon feature
 * DELETE /api/addons/:addonId/features/:featureId
 */
const deleteAddonFeature = async (req, res) => {
  try {
    const { addonId, featureId } = req.params;

    // Check if feature exists and belongs to the addon
    const features = await executeQuery(`
      SELECT * FROM addon_features WHERE id = ? AND addon_id = ?
    `, [featureId, addonId]);

    if (!features || features.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      });
    }

    // Soft delete feature
    await executeQuery(`
      UPDATE addon_features 
      SET is_active = FALSE
      WHERE id = ?
    `, [featureId]);

    res.json({
      success: true,
      message: 'Feature deleted successfully'
    });

  } catch (error) {
    console.error('Delete addon feature error:', error);
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
  addFeatureToAddon,
  updateAddonFeature,
  deleteAddonFeature
}; 