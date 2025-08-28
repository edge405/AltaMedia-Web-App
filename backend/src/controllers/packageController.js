const { executeQuery } = require('../config/mysql');

/**
 * Get all active packages
 * GET /api/packages
 */
const getAllPackages = async (req, res) => {
  try {
    const packages = await executeQuery(
      'SELECT * FROM packages WHERE is_active = TRUE ORDER BY created_at DESC'
    );

    if (packages.length === 0) {
      return res.json({
        success: true,
        message: 'No packages found',
        data: {
          total_packages: 0,
          packages: []
        }
      });
    }

    // Get features for all packages
    const packageIds = packages.map(pkg => pkg.id);
    const placeholders = packageIds.map(() => '?').join(',');
    const allFeatures = await executeQuery(
      `SELECT * FROM package_features WHERE package_id IN (${placeholders}) AND is_active = TRUE`,
      packageIds
    );

    // Organize packages with clear labeling and features
    const labeledPackages = packages.map(package => {
      // Get features for this package
      const packageFeatures = allFeatures.filter(feature => feature.package_id === package.id);
      
      // Organize features with clear labeling
      const labeledFeatures = packageFeatures.map(feature => ({
        feature_id: feature.id,
        feature_info: {
          feature_name: feature.feature_name,
          feature_description: feature.feature_description,
          status: 'active', // Default status for package features
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
    const packages = await executeQuery(
      'SELECT * FROM packages WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    const package = packages[0];

    // Get features for this package
    const features = await executeQuery(
      'SELECT * FROM package_features WHERE package_id = ? AND is_active = TRUE',
      [id]
    );

    // Organize features with clear labeling
    const labeledFeatures = features.map(feature => ({
      feature_id: feature.id,
      feature_info: {
        feature_name: feature.feature_name,
        feature_description: feature.feature_description,
        status: 'active',
        is_active: feature.is_active,
        created_at: feature.created_at
      }
    }));

    res.json({
      success: true,
      message: 'Package retrieved successfully',
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
    console.error('Get package by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create a new package
 * POST /api/packages
 */
const createPackage = async (req, res) => {
  try {
    const { name, description, price, duration_days, features } = req.body;

    // Validate required fields
    if (!name || !price || !duration_days) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and duration_days are required'
      });
    }

    // Create package
    const result = await executeQuery(
      'INSERT INTO packages (name, description, price, duration_days) VALUES (?, ?, ?, ?)',
      [name, description, price, duration_days]
    );

    const packageId = result.insertId;

    // Add features if provided
    if (features && Array.isArray(features)) {
      for (const feature of features) {
        await executeQuery(
          'INSERT INTO package_features (package_id, feature_name, feature_description) VALUES (?, ?, ?)',
          [packageId, feature.feature_name, feature.feature_description]
        );
      }
    }

    // Get the created package with features
    const [createdPackage] = await executeQuery(
      'SELECT * FROM packages WHERE id = ?',
      [packageId]
    );

    const packageFeatures = await executeQuery(
      'SELECT * FROM package_features WHERE package_id = ?',
      [packageId]
    );

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: {
        package: createdPackage,
        features: packageFeatures
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
 * Update a package
 * PUT /api/packages/:id
 */
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration_days, is_active } = req.body;

    // Check if package exists
    const existingPackages = await executeQuery(
      'SELECT * FROM packages WHERE id = ?',
      [id]
    );

    if (existingPackages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Update package
    const result = await executeQuery(
      'UPDATE packages SET name = ?, description = ?, price = ?, duration_days = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, price, duration_days, is_active, id]
    );

    // Get updated package
    const [updatedPackage] = await executeQuery(
      'SELECT * FROM packages WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Package updated successfully',
      data: {
        package: updatedPackage
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
 * Delete a package (soft delete)
 * DELETE /api/packages/:id
 */
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if package exists
    const existingPackages = await executeQuery(
      'SELECT * FROM packages WHERE id = ?',
      [id]
    );

    if (existingPackages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Soft delete package
    await executeQuery(
      'UPDATE packages SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

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

/**
 * Add feature to package
 * POST /api/packages/:id/features
 */
const addFeatureToPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { feature_name, feature_description } = req.body;

    // Check if package exists
    const existingPackages = await executeQuery(
      'SELECT * FROM packages WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (existingPackages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Add feature
    const result = await executeQuery(
      'INSERT INTO package_features (package_id, feature_name, feature_description) VALUES (?, ?, ?)',
      [id, feature_name, feature_description]
    );

    // Get the created feature
    const [createdFeature] = await executeQuery(
      'SELECT * FROM package_features WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Feature added successfully',
      data: {
        feature: createdFeature
      }
    });

  } catch (error) {
    console.error('Add feature error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update package feature
 * PUT /api/packages/:packageId/features/:featureId
 */
const updatePackageFeature = async (req, res) => {
  try {
    const { packageId, featureId } = req.params;
    const { feature_name, feature_description, is_active } = req.body;

    // Check if feature exists
    const existingFeatures = await executeQuery(
      'SELECT * FROM package_features WHERE id = ? AND package_id = ?',
      [featureId, packageId]
    );

    if (existingFeatures.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      });
    }

    // Update feature
    await executeQuery(
      'UPDATE package_features SET feature_name = ?, feature_description = ?, is_active = ? WHERE id = ?',
      [feature_name, feature_description, is_active, featureId]
    );

    // Get updated feature
    const [updatedFeature] = await executeQuery(
      'SELECT * FROM package_features WHERE id = ?',
      [featureId]
    );

    res.json({
      success: true,
      message: 'Feature updated successfully',
      data: {
        feature: updatedFeature
      }
    });

  } catch (error) {
    console.error('Update feature error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete package feature
 * DELETE /api/packages/:packageId/features/:featureId
 */
const deletePackageFeature = async (req, res) => {
  try {
    const { packageId, featureId } = req.params;

    // Check if feature exists
    const existingFeatures = await executeQuery(
      'SELECT * FROM package_features WHERE id = ? AND package_id = ?',
      [featureId, packageId]
    );

    if (existingFeatures.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      });
    }

    // Soft delete feature
    await executeQuery(
      'UPDATE package_features SET is_active = FALSE WHERE id = ?',
      [featureId]
    );

    res.json({
      success: true,
      message: 'Feature deleted successfully'
    });

  } catch (error) {
    console.error('Delete feature error:', error);
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
  deletePackage,
  addFeatureToPackage,
  updatePackageFeature,
  deletePackageFeature
}; 