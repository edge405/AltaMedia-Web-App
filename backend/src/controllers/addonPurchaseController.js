const { executeQuery } = require('../config/mysql');

/**
 * Get user's independent addon purchases
 * GET /api/addon-purchases
 */
const getUserAddonPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all independent addon purchases
    const addonPurchases = await executeQuery(`
      SELECT pa.*, a.id as addon_id, a.name as addon_name, a.description as addon_description,
             a.price_type, a.base_price
      FROM purchased_addons pa
      LEFT JOIN addons a ON pa.addon_id = a.id
      WHERE pa.user_id = ?
      ORDER BY pa.created_at DESC
    `, [userId]);

    if (!addonPurchases) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch addon purchases'
      });
    }

    // Organize addon purchases with clear labeling
    const labeledAddonPurchases = addonPurchases.map(purchase => ({
      addon_purchase_id: purchase.id,
      purchase_info: {
        purchase_date: purchase.purchase_date,
        status: purchase.status,
        base_price: purchase.base_price,
        price_type: purchase.price_type,
        duration: purchase.duration,
        created_at: purchase.created_at
      },
      addon_details: {
        addon_id: purchase.addon_id,
        addon_name: purchase.addon_name,
        addon_description: purchase.addon_description,
        price_type: purchase.price_type,
        base_price: purchase.base_price
      }
    }));

    res.json({
      success: true,
      message: 'Addon purchases retrieved successfully',
      data: {
        user_id: userId,
        total_addon_purchases: labeledAddonPurchases.length,
        addon_purchases: labeledAddonPurchases
      }
    });

  } catch (error) {
    console.error('Get addon purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get addon purchase by ID
 * GET /api/addon-purchases/:id
 */
const getAddonPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get addon purchase details
    const addonPurchases = await executeQuery(`
      SELECT pa.*, a.id as addon_id, a.name as addon_name, a.description as addon_description,
             a.price_type, a.base_price
      FROM purchased_addons pa
      LEFT JOIN addons a ON pa.addon_id = a.id
      WHERE pa.id = ? AND pa.user_id = ?
    `, [id, userId]);

    if (!addonPurchases || addonPurchases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Addon purchase not found'
      });
    }

    const addonPurchase = addonPurchases[0];

    const purchaseWithDetails = {
      addon_purchase_id: addonPurchase.id,
      purchase_info: {
        purchase_date: addonPurchase.purchase_date,
        status: addonPurchase.status,
        base_price: addonPurchase.base_price,
        price_type: addonPurchase.price_type,
        duration: addonPurchase.duration,
        created_at: addonPurchase.created_at
      },
      addon_details: {
        addon_id: addonPurchase.addon_id,
        addon_name: addonPurchase.addon_name,
        addon_description: addonPurchase.addon_description,
        price_type: addonPurchase.price_type,
        base_price: addonPurchase.base_price
      }
    };

    res.json({
      success: true,
      message: 'Addon purchase retrieved successfully',
      data: purchaseWithDetails
    });

  } catch (error) {
    console.error('Get addon purchase by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create addon purchase
 * POST /api/addon-purchases
 */
const createAddonPurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addon_id, base_price, price_type = 'one-time', duration = null } = req.body;

    if (!addon_id || !base_price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: addon_id, base_price'
      });
    }

    // Validate addon exists and is active
    const addons = await executeQuery(`
      SELECT * FROM addons WHERE id = ? AND is_active = TRUE
    `, [addon_id]);

    if (!addons || addons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Addon not found or inactive'
      });
    }

    const addon = addons[0];

    // Create addon purchase
    const purchaseResult = await executeQuery(`
      INSERT INTO purchased_addons (user_id, addon_id, base_price, price_type, duration, status)
      VALUES (?, ?, ?, ?, ?, 'active')
    `, [userId, addon_id, base_price, price_type, duration]);

    const purchaseId = purchaseResult.insertId;

    // Get the created purchase
    const createdPurchases = await executeQuery(`
      SELECT pa.*, a.id as addon_id, a.name as addon_name, a.description as addon_description,
             a.price_type, a.base_price
      FROM purchased_addons pa
      LEFT JOIN addons a ON pa.addon_id = a.id
      WHERE pa.id = ?
    `, [purchaseId]);

    const createdPurchase = createdPurchases[0];

    const purchaseWithDetails = {
      addon_purchase_id: createdPurchase.id,
      purchase_info: {
        purchase_date: createdPurchase.purchase_date,
        status: createdPurchase.status,
        base_price: createdPurchase.base_price,
        price_type: createdPurchase.price_type,
        duration: createdPurchase.duration,
        created_at: createdPurchase.created_at
      },
      addon_details: {
        addon_id: createdPurchase.addon_id,
        addon_name: createdPurchase.addon_name,
        addon_description: createdPurchase.addon_description,
        price_type: createdPurchase.price_type,
        base_price: createdPurchase.base_price
      }
    };

    res.status(201).json({
      success: true,
      message: 'Addon purchase created successfully',
      data: purchaseWithDetails
    });

  } catch (error) {
    console.error('Create addon purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update addon purchase status
 * PUT /api/addon-purchases/:id/status
 */
const updateAddonPurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['active', 'inactive', 'cancelled', 'expired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: active, inactive, cancelled, expired'
      });
    }

    const result = await executeQuery(`
      UPDATE purchased_addons 
      SET status = ?
      WHERE id = ? AND user_id = ?
    `, [status, id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Addon purchase not found'
      });
    }

    res.json({
      success: true,
      message: 'Addon purchase status updated successfully'
    });

  } catch (error) {
    console.error('Update addon purchase status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get all addon purchases (Admin)
 * GET /api/addon-purchases/admin/all
 */
const getAllAddonPurchases = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const addonPurchases = await executeQuery(`
      SELECT pa.*, a.name as addon_name, a.description as addon_description,
             u.email as user_email, u.fullname as user_name
      FROM purchased_addons pa
      LEFT JOIN addons a ON pa.addon_id = a.id
      LEFT JOIN users u ON pa.user_id = u.id
      ORDER BY pa.created_at DESC
    `);

    res.json({
      success: true,
      message: 'All addon purchases retrieved successfully',
      data: {
        total_addon_purchases: addonPurchases.length,
        addon_purchases: addonPurchases
      }
    });

  } catch (error) {
    console.error('Get all addon purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get addon purchases by user ID (Admin)
 * GET /api/addon-purchases/admin/user/:userId
 */
const getAddonPurchasesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const addonPurchases = await executeQuery(`
      SELECT pa.*, a.name as addon_name, a.description as addon_description
      FROM purchased_addons pa
      LEFT JOIN addons a ON pa.addon_id = a.id
      WHERE pa.user_id = ?
      ORDER BY pa.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      message: 'User addon purchases retrieved successfully',
      data: {
        user_id: userId,
        total_addon_purchases: addonPurchases.length,
        addon_purchases: addonPurchases
      }
    });

  } catch (error) {
    console.error('Get addon purchases by user ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete addon purchase (Admin)
 * DELETE /api/addon-purchases/admin/:id
 */
const deleteAddonPurchase = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const result = await executeQuery(
      'DELETE FROM purchased_addons WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Addon purchase not found'
      });
    }

    res.json({
      success: true,
      message: 'Addon purchase deleted successfully'
    });

  } catch (error) {
    console.error('Delete addon purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUserAddonPurchases,
  getAddonPurchaseById,
  createAddonPurchase,
  updateAddonPurchaseStatus,
  getAllAddonPurchases,
  getAddonPurchasesByUserId,
  deleteAddonPurchase
}; 