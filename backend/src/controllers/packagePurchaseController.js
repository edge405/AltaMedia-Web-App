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

    // Organize package purchases with clear labeling
    const labeledPackagePurchases = packagePurchases.map(purchase => ({
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
        duration_days: purchase.packages.duration_days
      }
    }));

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
          duration_days: packagePurchase.packages.duration_days
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

    // Organize package purchases with clear labeling
    const labeledPackagePurchases = packagePurchases.map(purchase => ({
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
        duration_days: purchase.packages.duration_days
      }
    }));

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
  getAllPackagePurchases
}; 