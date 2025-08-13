const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * Get user's package purchases with addons
 * GET /api/purchases
 */
const getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all purchases with package details
    const { data: purchases, error } = await supabase
      .from('package_purchases')
      .select(`
        *,
        packages:package_id (
          id,
          name,
          description,
          price,
          duration_days
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch purchases',
        error: error.message
      });
    }

    // Get addons for each purchase and organize data with clear labels
    const purchasesWithAddons = await Promise.all(
      purchases.map(async (purchase) => {
        const { data: addons, error: addonsError } = await supabase
          .from('purchased_addons')
          .select(`
            id,
            purchase_date,
            amount_paid,
            status,
            created_at,
            addons:addon_id (
              id,
              name,
              description,
              price_type,
              base_price
            )
          `)
          .eq('package_purchase_id', purchase.id);

        if (addonsError) {
          console.error('Error fetching addons for purchase:', purchase.id, addonsError);
          return {
            purchase_id: purchase.id,
            purchase_info: {
              purchase_date: purchase.purchase_date,
              expiration_date: purchase.expiration_date,
              status: purchase.status,
              total_amount: purchase.total_amount,
              created_at: purchase.created_at,
              updated_at: purchase.updated_at
            },
            package_details: {
              package_id: purchase.packages.id,
              package_name: purchase.packages.name,
              package_description: purchase.packages.description,
              package_price: purchase.packages.price,
              duration_days: purchase.packages.duration_days
            },
            features: purchase.features || [], // Include features from JSON
            addons: []
          };
        }

        // Organize addons with clear labeling
        const organizedAddons = (addons || []).map(addon => ({
          addon_purchase_id: addon.id,
          addon_details: {
            addon_id: addon.addons.id,
            addon_name: addon.addons.name,
            addon_description: addon.addons.description,
            price_type: addon.addons.price_type,
            base_price: addon.addons.base_price
          },
          purchase_info: {
            amount_paid: addon.amount_paid,
            status: addon.status,
            purchase_date: addon.purchase_date,
            created_at: addon.created_at
          }
        }));

        return {
          purchase_id: purchase.id,
          purchase_info: {
            purchase_date: purchase.purchase_date,
            expiration_date: purchase.expiration_date,
            status: purchase.status,
            total_amount: purchase.total_amount,
            created_at: purchase.created_at,
            updated_at: purchase.updated_at
          },
          package_details: {
            package_id: purchase.packages.id,
            package_name: purchase.packages.name,
            package_description: purchase.packages.description,
            package_price: purchase.packages.price,
            duration_days: purchase.packages.duration_days
          },
          features: purchase.features || [], // Include features from JSON
          addons: organizedAddons
        };
      })
    );

    res.json({
      success: true,
      message: 'User purchases retrieved successfully',
      data: {
        user_id: userId,
        total_purchases: purchasesWithAddons.length,
        purchases: purchasesWithAddons
      }
    });

  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get purchase by ID with addons
 * GET /api/purchases/:id
 */
const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get purchase details
    const { data: purchase, error: purchaseError } = await supabase
      .from('package_purchases')
      .select(`
        *,
        packages:package_id (
          id,
          name,
          description,
          price,
          duration_days
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (purchaseError || !purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    // Get purchased addons
    const { data: addons, error: addonsError } = await supabase
      .from('purchased_addons')
      .select(`
        *,
        addons:addon_id (
          id,
          name,
          description,
          price_type,
          base_price
        )
      `)
      .eq('package_purchase_id', id);

    if (addonsError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch purchase addons'
      });
    }

    // Organize addons with clear labeling
    const organizedAddons = (addons || []).map(addon => ({
      addon_purchase_id: addon.id,
      addon_details: {
        addon_id: addon.addons.id,
        addon_name: addon.addons.name,
        addon_description: addon.addons.description,
        price_type: addon.addons.price_type,
        base_price: addon.addons.base_price
      },
      purchase_info: {
        amount_paid: addon.amount_paid,
        status: addon.status,
        purchase_date: addon.purchase_date,
        created_at: addon.created_at
      }
    }));

    res.json({
      success: true,
      message: 'Purchase details retrieved successfully',
      data: {
        purchase_id: purchase.id,
        purchase_info: {
          purchase_date: purchase.purchase_date,
          expiration_date: purchase.expiration_date,
          status: purchase.status,
          total_amount: purchase.total_amount,
          created_at: purchase.created_at,
          updated_at: purchase.updated_at
        },
        package_details: {
          package_id: purchase.packages.id,
          package_name: purchase.packages.name,
          package_description: purchase.packages.description,
          package_price: purchase.packages.price,
          duration_days: purchase.packages.duration_days
        },
        addons: organizedAddons
      }
    });

  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create new package purchase
 * POST /api/purchases
 */
const createPurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const { package_id, addons } = req.body;

    // Get package details
    const { data: package, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', package_id)
      .eq('is_active', true)
      .single();

    if (packageError || !package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Fetch package features
    const { data: packageFeatures, error: featuresError } = await supabase
      .from('package_features')
      .select('*')
      .eq('package_id', package_id)
      .eq('is_active', true);

    if (featuresError) {
      console.error('Error fetching package features:', featuresError);
    }

    // Transform features into JSON structure for storage
    // Note: package_features table doesn't have status, so we add it here
    const featuresJson = (packageFeatures || []).map(feature => ({
      feature_id: feature.id,
      feature_name: feature.feature_name,
      feature_description: feature.feature_description,
      status: 'In Progress', // Default status when feature is purchased
      is_active: feature.is_active,
      created_at: feature.created_at,
      purchase_date: new Date().toISOString() // When this feature was purchased
    }));

    // Calculate expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + package.duration_days);

    // Calculate total amount
    let totalAmount = package.price;

    // Create purchase with features JSON
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('package_purchases')
      .insert({
        user_id: userId,
        package_id: package_id,
        expiration_date: expirationDate.toISOString().split('T')[0],
        total_amount: totalAmount,
        status: 'active',
        features: featuresJson // Store features as JSON
      })
      .select()
      .single();

    if (purchaseError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create purchase',
        error: purchaseError.message
      });
    }

    // Add addons if provided
    if (addons && addons.length > 0) {
      const addonData = [];
      for (const addonId of addons) {
        const { data: addon } = await supabase
          .from('addons')
          .select('*')
          .eq('id', addonId)
          .eq('is_active', true)
          .single();

        if (addon) {
          addonData.push({
            package_purchase_id: purchase.id,
            addon_id: addonId,
            amount_paid: addon.base_price,
            status: 'active'
          });
          totalAmount += addon.base_price;
        }
      }

      if (addonData.length > 0) {
        await supabaseAdmin
          .from('purchased_addons')
          .insert(addonData);

        // Update total amount
        await supabaseAdmin
          .from('package_purchases')
          .update({ total_amount: totalAmount })
          .eq('id', purchase.id);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      data: {
        purchase_id: purchase.id,
        purchase_info: {
          purchase_date: purchase.purchase_date,
          expiration_date: purchase.expiration_date,
          status: purchase.status,
          total_amount: totalAmount,
          created_at: purchase.created_at,
          updated_at: purchase.updated_at
        },
        package_details: {
          package_id: package.id,
          package_name: package.name,
          package_description: package.description,
          package_price: package.price,
          duration_days: package.duration_days
        },
        features: featuresJson, // Include features in response
        addons: addons ? addons.map(addonId => ({
          addon_id: addonId,
          status: 'active'
        })) : []
      }
    });

  } catch (error) {
    console.error('Create purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Cancel purchase
 * PUT /api/purchases/:id/cancel
 */
const cancelPurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: purchase, error } = await supabaseAdmin
      .from('package_purchases')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found or already cancelled'
      });
    }

    // Cancel associated addons
    await supabaseAdmin
      .from('purchased_addons')
      .update({ status: 'cancelled' })
      .eq('package_purchase_id', id);

    res.json({
      success: true,
      message: 'Purchase cancelled successfully',
      data: purchase
    });

  } catch (error) {
    console.error('Cancel purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get all purchases with addons (Admin only)
 * GET /api/admin/purchases
 */
const getAllPurchases = async (req, res) => {
  try {
    // Get all purchases with package and user details
    const { data: purchases, error } = await supabaseAdmin
      .from('package_purchases')
      .select(`
        *,
        packages:package_id (
          id,
          name,
          description
        ),
        users:user_id (
          id,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch purchases',
        error: error.message
      });
    }

    // Get addons for each purchase and organize data with clear labels
    const purchasesWithAddons = await Promise.all(
      purchases.map(async (purchase) => {
        const { data: addons, error: addonsError } = await supabaseAdmin
          .from('purchased_addons')
          .select(`
            id,
            purchase_date,
            amount_paid,
            status,
            created_at,
            addons:addon_id (
              id,
              name,
              description,
              price_type,
              base_price
            )
          `)
          .eq('package_purchase_id', purchase.id);

        if (addonsError) {
          console.error('Error fetching addons for purchase:', purchase.id, addonsError);
          return {
            purchase_id: purchase.id,
            purchase_info: {
              purchase_date: purchase.purchase_date,
              expiration_date: purchase.expiration_date,
              status: purchase.status,
              total_amount: purchase.total_amount,
              created_at: purchase.created_at,
              updated_at: purchase.updated_at
            },
            user_details: {
              user_id: purchase.users.id,
              user_email: purchase.users.email
            },
            package_details: {
              package_id: purchase.packages.id,
              package_name: purchase.packages.name,
              package_description: purchase.packages.description
            },
            addons: []
          };
        }

        // Organize addons with clear labeling
        const organizedAddons = (addons || []).map(addon => ({
          addon_purchase_id: addon.id,
          addon_details: {
            addon_id: addon.addons.id,
            addon_name: addon.addons.name,
            addon_description: addon.addons.description,
            price_type: addon.addons.price_type,
            base_price: addon.addons.base_price
          },
          purchase_info: {
            amount_paid: addon.amount_paid,
            status: addon.status,
            purchase_date: addon.purchase_date,
            created_at: addon.created_at
          }
        }));

        return {
          purchase_id: purchase.id,
          purchase_info: {
            purchase_date: purchase.purchase_date,
            expiration_date: purchase.expiration_date,
            status: purchase.status,
            total_amount: purchase.total_amount,
            created_at: purchase.created_at,
            updated_at: purchase.updated_at
          },
          user_details: {
            user_id: purchase.users.id,
            user_email: purchase.users.email
          },
          package_details: {
            package_id: purchase.packages.id,
            package_name: purchase.packages.name,
            package_description: purchase.packages.description
          },
          addons: organizedAddons
        };
      })
    );

    res.json({
      success: true,
      message: 'All purchases retrieved successfully',
      data: {
        total_purchases: purchasesWithAddons.length,
        purchases: purchasesWithAddons
      }
    });

  } catch (error) {
    console.error('Get all purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update feature status in a purchase
 * PUT /api/purchases/:id/features/:featureId/status
 */
const updatePurchaseFeatureStatus = async (req, res) => {
  try {
    const { id: purchaseId, featureId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['active', 'inactive', 'pending', 'deprecated'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: active, inactive, pending, deprecated'
      });
    }

    // Get the purchase to verify ownership and get current features
    const { data: purchase, error: purchaseError } = await supabase
      .from('package_purchases')
      .select('*')
      .eq('id', purchaseId)
      .eq('user_id', userId)
      .single();

    if (purchaseError || !purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found or access denied'
      });
    }

    // Get current features
    const currentFeatures = purchase.features || [];
    
    // Find and update the specific feature
    const featureIndex = currentFeatures.findIndex(feature => feature.feature_id === parseInt(featureId));
    
    if (featureIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found in this purchase'
      });
    }

    // Update the feature status
    currentFeatures[featureIndex].status = status;
    currentFeatures[featureIndex].updated_at = new Date().toISOString();

    // Update the purchase with the modified features
    const { data: updatedPurchase, error: updateError } = await supabase
      .from('package_purchases')
      .update({ 
        features: currentFeatures,
        updated_at: new Date().toISOString()
      })
      .eq('id', purchaseId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update feature status',
        error: updateError.message
      });
    }

    res.json({
      success: true,
      message: 'Feature status updated successfully',
      data: {
        purchase_id: purchaseId,
        feature_id: featureId,
        status: status,
        updated_features: currentFeatures
      }
    });

  } catch (error) {
    console.error('Update feature status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUserPurchases,
  getPurchaseById,
  createPurchase,
  cancelPurchase,
  getAllPurchases,
  updatePurchaseFeatureStatus
}; 