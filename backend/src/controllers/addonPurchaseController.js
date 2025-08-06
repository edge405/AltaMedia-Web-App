const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * Get user's independent addon purchases
 * GET /api/addon-purchases
 */
const getUserAddonPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all independent addon purchases
    const { data: addonPurchases, error } = await supabase
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
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch addon purchases',
        error: error.message
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
        addon_id: purchase.addons.id,
        addon_name: purchase.addons.name,
        addon_description: purchase.addons.description,
        price_type: purchase.addons.price_type,
        base_price: purchase.addons.base_price
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
    const { data: addonPurchase, error: purchaseError } = await supabase
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
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (purchaseError || !addonPurchase) {
      return res.status(404).json({
        success: false,
        message: 'Addon purchase not found'
      });
    }

    res.json({
      success: true,
      message: 'Addon purchase details retrieved successfully',
      data: {
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
          addon_id: addonPurchase.addons.id,
          addon_name: addonPurchase.addons.name,
          addon_description: addonPurchase.addons.description,
          price_type: addonPurchase.addons.price_type,
          base_price: addonPurchase.addons.base_price
        }
      }
    });

  } catch (error) {
    console.error('Get addon purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create new independent addon purchase
 * POST /api/addon-purchases
 */
const createAddonPurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addon_id } = req.body;

    // Get addon details
    const { data: addon, error: addonError } = await supabase
      .from('addons')
      .select('*')
      .eq('id', addon_id)
      .eq('is_active', true)
      .single();

    if (addonError || !addon) {
      return res.status(404).json({
        success: false,
        message: 'Addon not found'
      });
    }

    // Create addon purchase using the existing purchased_addons table
    const { data: addonPurchase, error: purchaseError } = await supabaseAdmin
      .from('purchased_addons')
      .insert({
        user_id: userId,
        addon_id: addon_id,
        base_price: addon.base_price,
        price_type: addon.price_type,
        duration: null,
        status: 'active'
      })
      .select()
      .single();

    if (purchaseError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create addon purchase',
        error: purchaseError.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Addon purchase created successfully',
      data: {
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
          addon_id: addon.id,
          addon_name: addon.name,
          addon_description: addon.description,
          price_type: addon.price_type,
          base_price: addon.base_price
        }
      }
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
 * Cancel addon purchase
 * PUT /api/addon-purchases/:id/cancel
 */
const cancelAddonPurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: addonPurchase, error } = await supabaseAdmin
      .from('purchased_addons')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error || !addonPurchase) {
      return res.status(404).json({
        success: false,
        message: 'Addon purchase not found or already cancelled'
      });
    }

    res.json({
      success: true,
      message: 'Addon purchase cancelled successfully',
      data: {
        addon_purchase_id: addonPurchase.id,
        status: addonPurchase.status
      }
    });

  } catch (error) {
    console.error('Cancel addon purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get all addon purchases (Admin only)
 * GET /api/admin/addon-purchases
 */
const getAllAddonPurchases = async (req, res) => {
  try {
    // Get all addon purchases with user and addon details
    const { data: addonPurchases, error } = await supabaseAdmin
      .from('purchased_addons')
      .select(`
        *,
        addons:addon_id (
          id,
          name,
          description,
          price_type,
          base_price
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
        message: 'Failed to fetch addon purchases',
        error: error.message
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
      user_details: {
        user_id: purchase.users?.id || null,
        user_email: purchase.users?.email || null
      },
      addon_details: {
        addon_id: purchase.addons.id,
        addon_name: purchase.addons.name,
        addon_description: purchase.addons.description,
        price_type: purchase.addons.price_type,
        base_price: purchase.addons.base_price
      }
    }));

    res.json({
      success: true,
      message: 'All addon purchases retrieved successfully',
      data: {
        total_addon_purchases: labeledAddonPurchases.length,
        addon_purchases: labeledAddonPurchases
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

module.exports = {
  getUserAddonPurchases,
  getAddonPurchaseById,
  createAddonPurchase,
  cancelAddonPurchase,
  getAllAddonPurchases
}; 