const { executeQuery } = require('../config/mysql');

/**
 * Get user's package purchases with addons
 * GET /api/purchases
 */
const getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all purchases with package details
    const purchases = await executeQuery(`
      SELECT pp.*, p.id as package_id, p.name as package_name, p.description as package_description, 
             p.price as package_price, p.duration_days
      FROM package_purchases pp
      LEFT JOIN packages p ON pp.package_id = p.id
      WHERE pp.user_id = ?
      ORDER BY pp.created_at DESC
    `, [userId]);

    if (!purchases) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch purchases'
      });
    }

    // Get addons for each purchase and organize data with clear labels
    const purchasesWithAddons = await Promise.all(
      purchases.map(async (purchase) => {
        const addons = await executeQuery(`
          SELECT pa.*, a.id as addon_id, a.name as addon_name, a.description as addon_description,
                 a.price_type, a.base_price
          FROM purchased_addons pa
          LEFT JOIN addons a ON pa.addon_id = a.id
          WHERE pa.package_purchase_id = ?
        `, [purchase.id]);

        // Organize addons with clear labeling
        const organizedAddons = (addons || []).map(addon => ({
          addon_purchase_id: addon.id,
          addon_details: {
            addon_id: addon.addon_id,
            addon_name: addon.addon_name,
            addon_description: addon.addon_description,
            price_type: addon.price_type,
            base_price: addon.base_price
          },
          purchase_info: {
            amount_paid: addon.base_price,
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
            package_id: purchase.package_id,
            package_name: purchase.package_name,
            package_description: purchase.package_description,
            package_price: purchase.package_price,
            duration_days: purchase.duration_days
          },
          features: purchase.features ? JSON.parse(purchase.features) : [], // Parse JSON features
          addons: organizedAddons
        };
      })
    );

    res.json({
      success: true,
      message: 'Purchases retrieved successfully',
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
 * Get purchase by ID with details
 * GET /api/purchases/:id
 */
const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get purchase with package details
    const purchases = await executeQuery(`
      SELECT pp.*, p.id as package_id, p.name as package_name, p.description as package_description,
             p.price as package_price, p.duration_days
      FROM package_purchases pp
      LEFT JOIN packages p ON pp.package_id = p.id
      WHERE pp.id = ? AND pp.user_id = ?
    `, [id, userId]);

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    const purchase = purchases[0];

    // Get addons for this purchase
    const addons = await executeQuery(`
      SELECT pa.*, a.id as addon_id, a.name as addon_name, a.description as addon_description,
             a.price_type, a.base_price
      FROM purchased_addons pa
      LEFT JOIN addons a ON pa.addon_id = a.id
      WHERE pa.package_purchase_id = ?
    `, [purchase.id]);

    // Organize addons with clear labeling
    const organizedAddons = (addons || []).map(addon => ({
      addon_purchase_id: addon.id,
      addon_details: {
        addon_id: addon.addon_id,
        addon_name: addon.addon_name,
        addon_description: addon.addon_description,
        price_type: addon.price_type,
        base_price: addon.base_price
      },
      purchase_info: {
        amount_paid: addon.base_price,
        status: addon.status,
        purchase_date: addon.purchase_date,
        created_at: addon.created_at
      }
    }));

    const purchaseWithDetails = {
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
        package_id: purchase.package_id,
        package_name: purchase.package_name,
        package_description: purchase.package_description,
        package_price: purchase.package_price,
        duration_days: purchase.duration_days
      },
      features: purchase.features ? JSON.parse(purchase.features) : [],
      addons: organizedAddons
    };

    res.json({
      success: true,
      message: 'Purchase retrieved successfully',
      data: purchaseWithDetails
    });

  } catch (error) {
    console.error('Get purchase by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create a new purchase
 * POST /api/purchases
 */
const createPurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const { package_id, total_amount, features = [], addons = [] } = req.body;

    if (!package_id || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: package_id, total_amount'
      });
    }

    // Get package details to calculate expiration date
    const packages = await executeQuery(
      'SELECT * FROM packages WHERE id = ?',
      [package_id]
    );

    if (!packages || packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    const package = packages[0];
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + package.duration_days);

    // Create purchase
    const purchaseResult = await executeQuery(`
      INSERT INTO package_purchases (user_id, package_id, total_amount, expiration_date, features)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, package_id, total_amount, expirationDate, JSON.stringify(features)]);

    const purchaseId = purchaseResult.insertId;

    // Create addon purchases if any
    if (addons && addons.length > 0) {
      for (const addon of addons) {
        await executeQuery(`
          INSERT INTO purchased_addons (user_id, addon_id, package_purchase_id, base_price, status)
          VALUES (?, ?, ?, ?, ?)
        `, [userId, addon.addon_id, purchaseId, addon.base_price, 'active']);
      }
    }

    // Get the created purchase with details
    const createdPurchases = await executeQuery(`
      SELECT pp.*, p.id as package_id, p.name as package_name, p.description as package_description,
             p.price as package_price, p.duration_days
      FROM package_purchases pp
      LEFT JOIN packages p ON pp.package_id = p.id
      WHERE pp.id = ?
    `, [purchaseId]);

    const createdPurchase = createdPurchases[0];

    res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      data: {
        purchase_id: createdPurchase.id,
        purchase_info: {
          purchase_date: createdPurchase.purchase_date,
          expiration_date: createdPurchase.expiration_date,
          status: createdPurchase.status,
          total_amount: createdPurchase.total_amount,
          created_at: createdPurchase.created_at,
          updated_at: createdPurchase.updated_at
        },
        package_details: {
          package_id: createdPurchase.package_id,
          package_name: createdPurchase.package_name,
          package_description: createdPurchase.package_description,
          package_price: createdPurchase.package_price,
          duration_days: createdPurchase.duration_days
        },
        features: createdPurchase.features ? JSON.parse(createdPurchase.features) : []
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
 * Update purchase status
 * PUT /api/purchases/:id/status
 */
const updatePurchaseStatus = async (req, res) => {
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

    const validStatuses = ['active', 'expired', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: active, expired, cancelled'
      });
    }

    const result = await executeQuery(`
      UPDATE package_purchases 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `, [status, id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    res.json({
      success: true,
      message: 'Purchase status updated successfully'
    });

  } catch (error) {
    console.error('Update purchase status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get all purchases (Admin)
 * GET /api/purchases/admin/all
 */
const getAllPurchases = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const purchases = await executeQuery(`
      SELECT pp.*, p.name as package_name, u.email as user_email, u.fullname as user_name
      FROM package_purchases pp
      LEFT JOIN packages p ON pp.package_id = p.id
      LEFT JOIN users u ON pp.user_id = u.id
      ORDER BY pp.created_at DESC
    `);

    res.json({
      success: true,
      message: 'All purchases retrieved successfully',
      data: {
        total_purchases: purchases.length,
        purchases: purchases
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
 * Get purchases by user ID (Admin)
 * GET /api/purchases/admin/user/:userId
 */
const getPurchasesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const purchases = await executeQuery(`
      SELECT pp.*, p.name as package_name
      FROM package_purchases pp
      LEFT JOIN packages p ON pp.package_id = p.id
      WHERE pp.user_id = ?
      ORDER BY pp.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      message: 'User purchases retrieved successfully',
      data: {
        user_id: userId,
        total_purchases: purchases.length,
        purchases: purchases
      }
    });

  } catch (error) {
    console.error('Get purchases by user ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete purchase (Admin)
 * DELETE /api/purchases/admin/:id
 */
const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Delete related addon purchases first
    await executeQuery(
      'DELETE FROM purchased_addons WHERE package_purchase_id = ?',
      [id]
    );

    // Delete the purchase
    const result = await executeQuery(
      'DELETE FROM package_purchases WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    res.json({
      success: true,
      message: 'Purchase deleted successfully'
    });

  } catch (error) {
    console.error('Delete purchase error:', error);
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
  updatePurchaseStatus,
  getAllPurchases,
  getPurchasesByUserId,
  deletePurchase
}; 