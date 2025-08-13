const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * Get user's package purchases
 * GET /api/package-purchases
 */
const getUserPackagePurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all package purchases for the user
    const { data: packagePurchases, error } = await supabase
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
        message: 'Failed to fetch package purchases',
        error: error.message
      });
    }

    // Organize package purchases with clear labeling and features
    const labeledPackagePurchases = packagePurchases.map(purchase => {
      // Use features from the purchase JSON instead of fetching from package_features
      const purchaseFeatures = purchase.features || [];
      
      // Organize features with clear labeling
      const labeledFeatures = purchaseFeatures.map(feature => ({
        feature_id: feature.feature_id,
        feature_info: {
          feature_name: feature.feature_name,
          feature_description: feature.feature_description,
          status: feature.status || 'pending',
          is_active: feature.is_active,
          created_at: feature.created_at,
          purchase_date: feature.purchase_date
        }
      }));

      return {
        package_purchase_id: purchase.id,
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
          duration_days: purchase.packages.duration_days,
          features: labeledFeatures
        }
      };
    });

    res.json({
      success: true,
      message: 'Package purchases retrieved successfully',
      data: {
        user_id: userId,
        total_package_purchases: labeledPackagePurchases.length,
        package_purchases: labeledPackagePurchases
      }
    });

  } catch (error) {
    console.error('Get package purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get package purchase by ID
 * GET /api/package-purchases/:id
 */
const getPackagePurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get package purchase details
    const { data: packagePurchase, error: purchaseError } = await supabase
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

    if (purchaseError || !packagePurchase) {
      return res.status(404).json({
        success: false,
        message: 'Package purchase not found'
      });
    }

    // Use features from the purchase JSON instead of fetching from package_features
    const purchaseFeatures = packagePurchase.features || [];
    
    // Organize features with clear labeling
    const labeledFeatures = purchaseFeatures.map(feature => ({
      feature_id: feature.feature_id,
      feature_info: {
        feature_name: feature.feature_name,
        feature_description: feature.feature_description,
        status: feature.status || 'pending',
        is_active: feature.is_active,
        created_at: feature.created_at,
        purchase_date: feature.purchase_date
      }
    }));

    res.json({
      success: true,
      message: 'Package purchase details retrieved successfully',
      data: {
        package_purchase_id: packagePurchase.id,
        purchase_info: {
          purchase_date: packagePurchase.purchase_date,
          expiration_date: packagePurchase.expiration_date,
          status: packagePurchase.status,
          total_amount: packagePurchase.total_amount,
          created_at: packagePurchase.created_at,
          updated_at: packagePurchase.updated_at
        },
        package_details: {
          package_id: packagePurchase.packages.id,
          package_name: packagePurchase.packages.name,
          package_description: packagePurchase.packages.description,
          package_price: packagePurchase.packages.price,
          duration_days: packagePurchase.packages.duration_days,
          features: labeledFeatures
        }
      }
    });

  } catch (error) {
    console.error('Get package purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create a new package purchase with features
 * POST /api/package-purchases
 */
const createPackagePurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const { package_id, total_amount, expiration_date } = req.body;

    // Validate required fields
    if (!package_id || !total_amount || !expiration_date) {
      return res.status(400).json({
        success: false,
        message: 'Package ID, total amount, and expiration date are required'
      });
    }

    // First, fetch all features for the package
    const { data: packageFeatures, error: featuresError } = await supabase
      .from('package_features')
      .select('*')
      .eq('package_id', package_id)
      .eq('is_active', true);

    if (featuresError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch package features',
        error: featuresError.message
      });
    }

    // Transform features into JSON structure for storage
    // Note: package_features table doesn't have status, so we add it here
    const featuresJson = packageFeatures.map(feature => ({
      feature_id: feature.id,
      feature_name: feature.feature_name,
      feature_description: feature.feature_description,
      status: 'pending', // Default status when feature is purchased
      is_active: feature.is_active,
      created_at: feature.created_at,
      purchase_date: new Date().toISOString() // When this feature was purchased
    }));

    // Create the package purchase with features JSON
    const { data: newPurchase, error: purchaseError } = await supabase
      .from('package_purchases')
      .insert({
        user_id: userId,
        package_id: package_id,
        total_amount: total_amount,
        expiration_date: expiration_date,
        status: 'active',
        features: featuresJson // Store features as JSON
      })
      .select()
      .single();

    if (purchaseError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create package purchase',
        error: purchaseError.message
      });
    }

    // Get package details for response
    const { data: packageDetails, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', package_id)
      .single();

    if (packageError) {
      console.error('Package fetch error:', packageError);
    }

    res.status(201).json({
      success: true,
      message: 'Package purchase created successfully',
      data: {
        package_purchase_id: newPurchase.id,
        purchase_info: {
          purchase_date: newPurchase.purchase_date,
          expiration_date: newPurchase.expiration_date,
          status: newPurchase.status,
          total_amount: newPurchase.total_amount,
          created_at: newPurchase.created_at,
          updated_at: newPurchase.updated_at
        },
        package_details: {
          package_id: packageDetails?.id || package_id,
          package_name: packageDetails?.name || 'Unknown Package',
          package_description: packageDetails?.description || '',
          package_price: packageDetails?.price || total_amount,
          duration_days: packageDetails?.duration_days || 30
        },
        features: featuresJson
      }
    });

  } catch (error) {
    console.error('Create package purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update feature status in a package purchase
 * PUT /api/package-purchases/:id/features/:featureId/status
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

    // Get the current package purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('package_purchases')
      .select('*')
      .eq('id', purchaseId)
      .eq('user_id', userId)
      .single();

    if (purchaseError || !purchase) {
      return res.status(404).json({
        success: false,
        message: 'Package purchase not found'
      });
    }

    // Update the specific feature status in the features JSON
    const features = purchase.features || [];
    const featureIndex = features.findIndex(f => f.feature_id === parseInt(featureId));
    
    if (featureIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found in this purchase'
      });
    }

    // Update the feature status
    features[featureIndex].status = status;
    features[featureIndex].updated_at = new Date().toISOString();

    // Update the package purchase with modified features
    const { data: updatedPurchase, error: updateError } = await supabase
      .from('package_purchases')
      .update({
        features: features,
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
        package_purchase_id: updatedPurchase.id,
        updated_feature: features[featureIndex],
        features: updatedPurchase.features
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

/**
 * Get all package purchases (Admin only)
 * GET /api/package-purchases/admin/all
 */
const getAllPackagePurchases = async (req, res) => {
  try {
    // Get all package purchases with user and package details
    const { data: packagePurchases, error } = await supabaseAdmin
      .from('package_purchases')
      .select(`
        *,
        packages:package_id (
          id,
          name,
          description,
          price,
          duration_days
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
        message: 'Failed to fetch package purchases',
        error: error.message
      });
    }

    // Organize package purchases with clear labeling and features
    const labeledPackagePurchases = packagePurchases.map(purchase => {
      // Use features from the purchase JSON instead of fetching from package_features
      const purchaseFeatures = purchase.features || [];
      
      // Organize features with clear labeling
      const labeledFeatures = purchaseFeatures.map(feature => ({
        feature_id: feature.feature_id,
        feature_info: {
          feature_name: feature.feature_name,
          feature_description: feature.feature_description,
          status: feature.status || 'pending',
          is_active: feature.is_active,
          created_at: feature.created_at,
          purchase_date: feature.purchase_date
        }
      }));

      return {
        package_purchase_id: purchase.id,
        purchase_info: {
          purchase_date: purchase.purchase_date,
          expiration_date: purchase.expiration_date,
          status: purchase.status,
          total_amount: purchase.total_amount,
          created_at: purchase.created_at,
          updated_at: purchase.updated_at
        },
        user_details: {
          user_id: purchase.users?.id || null,
          user_email: purchase.users?.email || null
        },
        package_details: {
          package_id: purchase.packages.id,
          package_name: purchase.packages.name,
          package_description: purchase.packages.description,
          package_price: purchase.packages.price,
          duration_days: purchase.packages.duration_days,
          features: labeledFeatures
        }
      };
    });

    res.json({
      success: true,
      message: 'All package purchases retrieved successfully',
      data: {
        total_package_purchases: labeledPackagePurchases.length,
        package_purchases: labeledPackagePurchases
      }
    });

  } catch (error) {
    console.error('Get all package purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUserPackagePurchases,
  getPackagePurchaseById,
  getAllPackagePurchases,
  createPackagePurchase,
  updatePurchaseFeatureStatus
}; 