const { executeQuery, executeTransaction } = require('../config/mysql');

/**
 * Get user's package purchases
 * GET /api/package-purchases
 */
const getUserPackagePurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all package purchases for the user with package details
    const packagePurchases = await executeQuery(
      `SELECT pp.*, p.name as package_name, p.description as package_description, 
       p.price as package_price, p.duration_days
       FROM package_purchases pp
       LEFT JOIN packages p ON pp.package_id = p.id
       WHERE pp.user_id = ?
       ORDER BY pp.created_at DESC`,
      [userId]
    );

    // Organize package purchases with clear labeling and features
    const labeledPackagePurchases = packagePurchases.map(purchase => {
      // Use features from the purchase JSON instead of fetching from package_features
      const purchaseFeatures = purchase.features ? JSON.parse(purchase.features) : [];
      
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
          package_id: purchase.package_id,
          package_name: purchase.package_name,
          package_description: purchase.package_description,
          package_price: purchase.package_price,
          duration_days: purchase.duration_days,
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

    // Get package purchase with package details
    const purchases = await executeQuery(
      `SELECT pp.*, p.name as package_name, p.description as package_description, 
       p.price as package_price, p.duration_days
       FROM package_purchases pp
       LEFT JOIN packages p ON pp.package_id = p.id
       WHERE pp.id = ? AND pp.user_id = ?`,
      [id, userId]
    );

    if (purchases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package purchase not found'
      });
    }

    const purchase = purchases[0];

    // Parse features from JSON
    const purchaseFeatures = purchase.features ? JSON.parse(purchase.features) : [];
    
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
      message: 'Package purchase retrieved successfully',
      data: {
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
          package_id: purchase.package_id,
          package_name: purchase.package_name,
          package_description: purchase.package_description,
          package_price: purchase.package_price,
          duration_days: purchase.duration_days,
          features: labeledFeatures
        }
      }
    });

  } catch (error) {
    console.error('Get package purchase by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create a new package purchase
 * POST /api/package-purchases
 */
const createPackagePurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const { package_id, features } = req.body;

    // Validate required fields
    if (!package_id) {
      return res.status(400).json({
        success: false,
        message: 'Package ID is required'
      });
    }

    // Get package details
    const packages = await executeQuery(
      'SELECT * FROM packages WHERE id = ? AND is_active = TRUE',
      [package_id]
    );

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    const package = packages[0];

    // Calculate expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + package.duration_days);

    // Prepare features data
    const featuresData = features || [];

    // Create package purchase
    const result = await executeQuery(
      'INSERT INTO package_purchases (user_id, package_id, expiration_date, total_amount, features) VALUES (?, ?, ?, ?, ?)',
      [userId, package_id, expirationDate, package.price, JSON.stringify(featuresData)]
    );

    const purchaseId = result.insertId;

    // Get the created purchase
    const [createdPurchase] = await executeQuery(
      'SELECT * FROM package_purchases WHERE id = ?',
      [purchaseId]
    );

    res.status(201).json({
      success: true,
      message: 'Package purchase created successfully',
      data: {
        purchase: createdPurchase
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
 * Update package purchase status
 * PUT /api/package-purchases/:id/status
 */
const updatePackagePurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['active', 'expired', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: active, expired, cancelled'
      });
    }

    // Check if purchase exists and belongs to user
    const existingPurchases = await executeQuery(
      'SELECT * FROM package_purchases WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingPurchases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package purchase not found'
      });
    }

    // Update status
    await executeQuery(
      'UPDATE package_purchases SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    // Get updated purchase
    const [updatedPurchase] = await executeQuery(
      'SELECT * FROM package_purchases WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Package purchase status updated successfully',
      data: {
        purchase: updatedPurchase
      }
    });

  } catch (error) {
    console.error('Update package purchase status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update package purchase features status
 * PUT /api/package-purchases/:id/features/:featureId/status
 */
const updatePackagePurchaseFeatureStatus = async (req, res) => {
  try {
    const { id, featureId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, in_progress, completed, cancelled'
      });
    }

    // Check if purchase exists and belongs to user
    const existingPurchases = await executeQuery(
      'SELECT * FROM package_purchases WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingPurchases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package purchase not found'
      });
    }

    const purchase = existingPurchases[0];
    const features = purchase.features ? JSON.parse(purchase.features) : [];

    // Find and update the specific feature
    const featureIndex = features.findIndex(f => f.feature_id == featureId);
    if (featureIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found in this purchase'
      });
    }

    // Update feature status
    features[featureIndex].status = status;
    features[featureIndex].updated_at = new Date().toISOString();

    // Update purchase with new features data
    await executeQuery(
      'UPDATE package_purchases SET features = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(features), id]
    );

    // Get updated purchase
    const [updatedPurchase] = await executeQuery(
      'SELECT * FROM package_purchases WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Feature status updated successfully',
      data: {
        purchase: updatedPurchase,
        updated_feature: features[featureIndex]
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
    const packagePurchases = await executeQuery(
      `SELECT pp.*, u.email as user_email, u.fullname as user_fullname,
       p.name as package_name, p.description as package_description
       FROM package_purchases pp
       LEFT JOIN users u ON pp.user_id = u.id
       LEFT JOIN packages p ON pp.package_id = p.id
       ORDER BY pp.created_at DESC`
    );

    res.json({
      success: true,
      message: 'All package purchases retrieved successfully',
      data: {
        total_purchases: packagePurchases.length,
        purchases: packagePurchases
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

/**
 * Get package purchases by user ID (Admin only)
 * GET /api/package-purchases/admin/user/:userId
 */
const getPackagePurchasesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get package purchases for specific user
    const packagePurchases = await executeQuery(
      `SELECT pp.*, p.name as package_name, p.description as package_description
       FROM package_purchases pp
       LEFT JOIN packages p ON pp.package_id = p.id
       WHERE pp.user_id = ?
       ORDER BY pp.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      message: 'User package purchases retrieved successfully',
      data: {
        user_id: userId,
        total_purchases: packagePurchases.length,
        purchases: packagePurchases
      }
    });

  } catch (error) {
    console.error('Get user package purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete package purchase (Admin only)
 * DELETE /api/package-purchases/admin/:id
 */
const deletePackagePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if purchase exists
    const existingPurchases = await executeQuery(
      'SELECT * FROM package_purchases WHERE id = ?',
      [id]
    );

    if (existingPurchases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package purchase not found'
      });
    }

    // Delete purchase
    await executeQuery(
      'DELETE FROM package_purchases WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Package purchase deleted successfully'
    });

  } catch (error) {
    console.error('Delete package purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUserPackagePurchases,
  getPackagePurchaseById,
  createPackagePurchase,
  updatePackagePurchaseStatus,
  updatePackagePurchaseFeatureStatus,
  getAllPackagePurchases,
  getPackagePurchasesByUserId,
  deletePackagePurchase
}; 