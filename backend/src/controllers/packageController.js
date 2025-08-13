const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * Get all active packages
 * GET /api/packages
 */
const getAllPackages = async (req, res) => {
  try {
    const { data: packages, error } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch packages',
        error: error.message
      });
    }

    // Get features for all packages
    const packageIds = packages.map(pkg => pkg.id);
    const { data: allFeatures, error: featuresError } = await supabase
      .from('package_features')
      .select('*')
      .in('package_id', packageIds)
      .eq('is_active', true);

    if (featuresError) {
      console.error('Features fetch error:', featuresError);
    }

    // Organize packages with clear labeling and features
    const labeledPackages = packages.map(package => {
      // Get features for this package
      const packageFeatures = allFeatures ? allFeatures.filter(feature => feature.package_id === package.id) : [];
      
      // Organize features with clear labeling
      // Note: package_features table doesn't have status, so we use a default
      const labeledFeatures = packageFeatures.map(feature => ({
        feature_id: feature.id,
        feature_info: {
          feature_name: feature.feature_name,
          feature_description: feature.feature_description,
          status: 'active', // Default status for package features (no status column in table)
          is_active: feature.is_active,
          created_at: feature.created_at
        }
      }));

      return {
        package_id: package.id,
        package_info: {
          name: package.name,
          description: package.description,
          price: package.price,
          duration_days: package.duration_days,
          is_active: package.is_active,
          created_at: package.created_at,
          updated_at: package.updated_at
        },
        features: labeledFeatures
      };
    });

    res.json({
      success: true,
      message: 'Packages retrieved successfully',
      data: {
        total_packages: labeledPackages.length,
        packages: labeledPackages
      }
    });

  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get package by ID with features
 * GET /api/packages/:id
 */
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get package details
    const { data: package, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (packageError || !package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Get package features
    const { data: features, error: featuresError } = await supabase
      .from('package_features')
      .select('*')
      .eq('package_id', id)
      .eq('is_active', true);

    if (featuresError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch package features'
      });
    }

    // Organize features with clear labeling
    const labeledFeatures = (features || []).map(feature => ({
      feature_id: feature.id,
      feature_info: {
        feature_name: feature.feature_name,
        feature_description: feature.feature_description,
        status: 'active', // Default status for package features (no status column in table)
        is_active: feature.is_active,
        created_at: feature.created_at
      }
    }));

    res.json({
      success: true,
      message: 'Package details retrieved successfully',
      data: {
        package_id: package.id,
        package_info: {
          name: package.name,
          description: package.description,
          price: package.price,
          duration_days: package.duration_days,
          is_active: package.is_active,
          created_at: package.created_at,
          updated_at: package.updated_at
        },
        features: labeledFeatures
      }
    });

  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create new package (Admin only)
 * POST /api/packages
 */
const createPackage = async (req, res) => {
  try {
    const { name, description, price, duration_days, features } = req.body;

    // Create package
    const { data: package, error: packageError } = await supabaseAdmin
      .from('packages')
      .insert({
        name,
        description,
        price,
        duration_days,
        is_active: true
      })
      .select()
      .single();

    if (packageError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create package',
        error: packageError.message
      });
    }

    // Create features if provided
    if (features && features.length > 0) {
      const featuresData = features.map(feature => ({
        package_id: package.id,
        feature_name: feature.name,
        feature_description: feature.description,
        // Note: package_features table doesn't have status column, so we don't include it
        is_active: true
      }));

      const { error: featuresError } = await supabaseAdmin
        .from('package_features')
        .insert(featuresData);

      if (featuresError) {
        console.error('Features creation error:', featuresError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: {
        package_id: package.id,
        package_info: {
          name: package.name,
          description: package.description,
          price: package.price,
          duration_days: package.duration_days,
          is_active: package.is_active,
          created_at: package.created_at,
          updated_at: package.updated_at
        },
        features: features ? features.map(feature => ({
          feature_name: feature.name,
          feature_description: feature.description,
          status: feature.status || 'active'
        })) : []
      }
    });

  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update package (Admin only)
 * PUT /api/packages/:id
 */
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration_days, is_active } = req.body;

    const { data: package, error } = await supabaseAdmin
      .from('packages')
      .update({
        name,
        description,
        price,
        duration_days,
        is_active
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found or update failed'
      });
    }

    res.json({
      success: true,
      message: 'Package updated successfully',
      data: {
        package_id: package.id,
        package_info: {
          name: package.name,
          description: package.description,
          price: package.price,
          duration_days: package.duration_days,
          is_active: package.is_active,
          created_at: package.created_at,
          updated_at: package.updated_at
        }
      }
    });

  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete package (Admin only)
 * DELETE /api/packages/:id
 */
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('packages')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete package',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });

  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
}; 