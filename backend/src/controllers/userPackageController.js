const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { executeQuery } = require('../config/mysql');
const { sendWelcomeEmail } = require('../utils/email');

/**
 * Create user with package
 * POST /api/user-package/create-user-with-package
 */
const createUserWithPackage = async (req, res) => {
  try {
    const { 
      email, 
      fullname, 
      phone_number, 
      package_name, 
      expiration_date, 
      total_amount, 
      features = []
    } = req.body;

    // Validate required fields
    if (!email || !fullname || !phone_number || !package_name || !expiration_date || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, fullname, phone_number, package_name, expiration_date, total_amount'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if user already exists
    const existingUsers = await executeQuery(
      'SELECT id, email, fullname, phone_number, created_at FROM users WHERE email = ?',
      [email]
    );

    let user;
    let isNewUser = false;
    let generatedPassword = null;

    if (existingUsers.length > 0) {
      // User exists, use existing user
      user = existingUsers[0];
    } else {
      // User doesn't exist, create new user
      isNewUser = true;
      generatedPassword = crypto.randomBytes(5).toString('hex');
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      const userResult = await executeQuery(`
        INSERT INTO users (email, password, fullname, phone_number, role)
        VALUES (?, ?, ?, ?, ?)
      `, [email, hashedPassword, fullname, phone_number, 'user']);

      const newUserId = userResult.insertId;

      // Get the created user
      const newUsers = await executeQuery(
        'SELECT id, email, fullname, phone_number, created_at FROM users WHERE id = ?',
        [newUserId]
      );

      user = newUsers[0];
    }

    // Process features array with unique IDs and default values
    const processedFeatures = features.map((feature, index) => ({
      feature_id: index + 1,
      feature_name: feature.feature_name || feature.name || `Feature ${index + 1}`,
      status: feature.status || 'pending',
      progress: feature.progress || 0,
      description: feature.description || feature.feature_description || '',
      ...feature // Include any additional properties
    }));

    // Create purchased package with features
    const packageResult = await executeQuery(`
      INSERT INTO purchased_package_with_features (user_id, package_name, expiration_date, total_amount, features)
      VALUES (?, ?, ?, ?, ?)
    `, [user.id, package_name, expiration_date, total_amount, JSON.stringify(processedFeatures)]);

    const purchasedPackageId = packageResult.insertId;

    // Get the created purchased package
    const purchasedPackages = await executeQuery(`
      SELECT id, user_id, package_name, purchase_date, expiration_date, status, total_amount, features, created_at
      FROM purchased_package_with_features WHERE id = ?
    `, [purchasedPackageId]);

    const purchasedPackage = purchasedPackages[0];

    // Send welcome email with generated password (only for new users)
    if (isNewUser) {
      try {
        await sendWelcomeEmail(email, generatedPassword, fullname, purchasedPackage, processedFeatures);
      } catch (emailError) {
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: isNewUser ? 'User and package created successfully' : 'Package added to existing user successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          phone_number: user.phone_number,
          created_at: user.created_at,
          is_new_user: isNewUser
        },
        package: {
          id: purchasedPackage.id,
          package_name: purchasedPackage.package_name,
          purchase_date: purchasedPackage.purchase_date,
          expiration_date: purchasedPackage.expiration_date,
          status: purchasedPackage.status,
          total_amount: purchasedPackage.total_amount,
          features: purchasedPackage.features ? JSON.parse(purchasedPackage.features) : [],
          created_at: purchasedPackage.created_at
        },
        generated_password: isNewUser ? generatedPassword : null // Only include for new users
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get user's purchased packages with features
 * GET /api/user-package/packages
 */
const getUserPackages = async (req, res) => {
  try {
    const userId = req.user.id;

    const packages = await executeQuery(`
      SELECT * FROM purchased_package_with_features 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId]);

    // Parse features JSON for each package
    const packagesWithFeatures = packages.map(pkg => ({
      ...pkg,
      features: pkg.features ? JSON.parse(pkg.features) : []
    }));

    res.json({
      success: true,
      message: 'User packages retrieved successfully',
      data: {
        user_id: userId,
        total_packages: packagesWithFeatures.length,
        packages: packagesWithFeatures
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get user's purchased package by ID
 * GET /api/user-package/packages/:id
 */
const getUserPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const packages = await executeQuery(`
      SELECT * FROM purchased_package_with_features 
      WHERE id = ? AND user_id = ?
    `, [id, userId]);

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    const package = packages[0];
    const packageWithFeatures = {
      ...package,
      features: package.features ? JSON.parse(package.features) : []
    };

    res.json({
      success: true,
      message: 'Package retrieved successfully',
      data: packageWithFeatures
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update feature status in user's package
 * PUT /api/user-package/packages/:id/features/:featureId/status
 */
const updateFeatureStatus = async (req, res) => {
  try {
    const { id: packageId, featureId } = req.params;
    const { status, progress } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, in_progress, completed, cancelled'
      });
    }

    // Get the package to verify ownership and get current features
    const packages = await executeQuery(`
      SELECT * FROM purchased_package_with_features 
      WHERE id = ? AND user_id = ?
    `, [packageId, userId]);

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found or access denied'
      });
    }

    const package = packages[0];
    const currentFeatures = package.features ? JSON.parse(package.features) : [];
    
    // Find and update the specific feature
    const featureIndex = currentFeatures.findIndex(feature => feature.feature_id === parseInt(featureId));
    
    if (featureIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found in this package'
      });
    }

    // Update the feature status and progress
    currentFeatures[featureIndex].status = status;
    if (progress !== undefined) {
      currentFeatures[featureIndex].progress = progress;
    }
    currentFeatures[featureIndex].updated_at = new Date().toISOString();

    // Update the package with the modified features
    await executeQuery(`
      UPDATE purchased_package_with_features 
      SET features = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [JSON.stringify(currentFeatures), packageId]);

    res.json({
      success: true,
      message: 'Feature status updated successfully',
      data: {
        package_id: packageId,
        feature_id: featureId,
        status: status,
        progress: progress,
        updated_features: currentFeatures
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get all user packages (Admin)
 * GET /api/user-package/admin/all
 */
const getAllUserPackages = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const packages = await executeQuery(`
      SELECT ppwf.*, u.email as user_email, u.fullname as user_name
      FROM purchased_package_with_features ppwf
      LEFT JOIN users u ON ppwf.user_id = u.id
      ORDER BY ppwf.created_at DESC
    `);

    // Parse features JSON for each package
    const packagesWithFeatures = packages.map(pkg => ({
      ...pkg,
      features: pkg.features ? JSON.parse(pkg.features) : []
    }));

    res.json({
      success: true,
      message: 'All user packages retrieved successfully',
      data: {
        total_packages: packagesWithFeatures.length,
        packages: packagesWithFeatures
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete user package (Admin)
 * DELETE /api/user-package/admin/:id
 */
const deleteUserPackage = async (req, res) => {
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
      'DELETE FROM purchased_package_with_features WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      message: 'User package deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get user's purchased packages with detailed information
 * GET /api/user-package/user-packages-detailed
 */
const getUserPackagesDetailed = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user information
    const users = await executeQuery(`
      SELECT id, email, fullname, phone_number, created_at 
      FROM users WHERE id = ?
    `, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Get all packages for the user with detailed information
    const packages = await executeQuery(`
      SELECT 
        id,
        package_name,
        purchase_date,
        expiration_date,
        status,
        total_amount,
        features,
        created_at,
        updated_at,
        CASE 
          WHEN expiration_date < CURDATE() THEN 'expired'
          WHEN expiration_date = CURDATE() THEN 'expires_today'
          ELSE 'active'
        END as expiration_status,
        DATEDIFF(expiration_date, CURDATE()) as days_until_expiration
      FROM purchased_package_with_features 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId]);

    // Process packages and features
    const packagesWithFeatures = packages.map(pkg => {
      const features = pkg.features ? JSON.parse(pkg.features) : [];
      
      // Calculate package statistics
      const totalFeatures = features.length;
      const completedFeatures = features.filter(f => f.status === 'completed').length;
      const inProgressFeatures = features.filter(f => f.status === 'in_progress').length;
      const pendingFeatures = features.filter(f => f.status === 'pending').length;
      const overallProgress = totalFeatures > 0 ? Math.round((completedFeatures / totalFeatures) * 100) : 0;

      return {
        ...pkg,
        features: features,
        statistics: {
          total_features: totalFeatures,
          completed_features: completedFeatures,
          in_progress_features: inProgressFeatures,
          pending_features: pendingFeatures,
          overall_progress: overallProgress
        }
      };
    });

    // Calculate user statistics
    const totalPackages = packagesWithFeatures.length;
    const activePackages = packagesWithFeatures.filter(pkg => pkg.expiration_status === 'active').length;
    const expiredPackages = packagesWithFeatures.filter(pkg => pkg.expiration_status === 'expired').length;
    const totalSpent = packagesWithFeatures.reduce((sum, pkg) => sum + parseFloat(pkg.total_amount), 0);

    res.json({
      success: true,
      message: 'User packages retrieved successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          phone_number: user.phone_number,
          created_at: user.created_at
        },
        summary: {
          total_packages: totalPackages,
          active_packages: activePackages,
          expired_packages: expiredPackages,
          total_spent: totalSpent,
          packages: packagesWithFeatures
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get user's active packages only
 * GET /api/user-package/active-packages
 */
const getUserActivePackages = async (req, res) => {
  try {
    const userId = req.user.id;

    const packages = await executeQuery(`
      SELECT 
        id,
        package_name,
        purchase_date,
        expiration_date,
        status,
        total_amount,
        features,
        created_at,
        updated_at,
        DATEDIFF(expiration_date, CURDATE()) as days_until_expiration
      FROM purchased_package_with_features 
      WHERE user_id = ? 
        AND expiration_date >= CURDATE()
        AND status = 'active'
      ORDER BY expiration_date ASC
    `, [userId]);

    // Parse features JSON for each package
    const packagesWithFeatures = packages.map(pkg => ({
      ...pkg,
      features: pkg.features ? JSON.parse(pkg.features) : []
    }));

    res.json({
      success: true,
      message: 'Active packages retrieved successfully',
      data: {
        user_id: userId,
        total_active_packages: packagesWithFeatures.length,
        packages: packagesWithFeatures
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get admin dashboard statistics
 * GET /api/user-package/admin/dashboard-stats
 */
const getAdminDashboardStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Get all user packages with user information
    const packages = await executeQuery(`
      SELECT ppwf.*, u.email as user_email, u.fullname as user_name
      FROM purchased_package_with_features ppwf
      LEFT JOIN users u ON ppwf.user_id = u.id
      ORDER BY ppwf.created_at DESC
    `);

    // Parse features JSON for each package
    const packagesWithFeatures = packages.map(pkg => ({
      ...pkg,
      features: pkg.features ? JSON.parse(pkg.features) : []
    }));

    // Calculate package distribution by type
    const packageDistribution = {};
    packagesWithFeatures.forEach(pkg => {
      const packageName = pkg.package_name.toLowerCase();
      if (!packageDistribution[packageName]) {
        packageDistribution[packageName] = 0;
      }
      packageDistribution[packageName]++;
    });

    // Calculate overall statistics
    const totalPackages = packagesWithFeatures.length;
    const activePackages = packagesWithFeatures.filter(pkg => {
      const expirationDate = new Date(pkg.expiration_date);
      const today = new Date();
      return expirationDate >= today;
    }).length;
    const expiredPackages = packagesWithFeatures.filter(pkg => {
      const expirationDate = new Date(pkg.expiration_date);
      const today = new Date();
      return expirationDate < today;
    }).length;

    // Calculate feature completion statistics
    let totalFeatures = 0;
    let completedFeatures = 0;
    let inProgressFeatures = 0;
    let pendingFeatures = 0;

    packagesWithFeatures.forEach(pkg => {
      pkg.features.forEach(feature => {
        totalFeatures++;
        switch (feature.status) {
          case 'completed':
            completedFeatures++;
            break;
          case 'in_progress':
            inProgressFeatures++;
            break;
          case 'pending':
            pendingFeatures++;
            break;
        }
      });
    });

    // Get brandkit totals (all forms)
    const brandkitStats = await executeQuery(`
      SELECT 
        (SELECT COUNT(*) FROM company_brand_kit_forms) as total_brandkit_forms,
        (SELECT COUNT(*) FROM company_brand_kit_forms WHERE is_completed = 1) as completed_brandkit_forms,
        (SELECT COUNT(*) FROM company_brand_kit_forms WHERE is_completed = 0) as pending_brandkit_forms,
        (SELECT COUNT(*) FROM brandkit_questionnaire_forms) as total_questionnaire_forms,
        (SELECT COUNT(*) FROM brandkit_questionnaire_forms WHERE is_completed = 1) as completed_questionnaire_forms,
        (SELECT COUNT(*) FROM brandkit_questionnaire_forms WHERE is_completed = 0) as pending_questionnaire_forms,
        (SELECT COUNT(*) FROM organization_forms) as total_organization_forms,
        (SELECT COUNT(*) FROM organization_forms WHERE is_completed = 1) as completed_organization_forms,
        (SELECT COUNT(*) FROM organization_forms WHERE is_completed = 0) as pending_organization_forms
    `);

    const brandkitData = brandkitStats[0];
    const totalBrandkits = (brandkitData.total_brandkit_forms || 0) + 
                          (brandkitData.total_questionnaire_forms || 0) + 
                          (brandkitData.total_organization_forms || 0);
    
    const completedBrandkits = (brandkitData.completed_brandkit_forms || 0) + 
                              (brandkitData.completed_questionnaire_forms || 0) + 
                              (brandkitData.completed_organization_forms || 0);

    // Get client requests statistics
    const clientRequestsStats = await executeQuery(`
      SELECT 
        COUNT(*) as total_requests,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_requests,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_requests,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_requests,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_requests,
        SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent_requests,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority_requests
      FROM client_requests
    `);

    const requestsData = clientRequestsStats[0];

    // Get recent activity (last 10 packages)
    const recentActivity = packagesWithFeatures.slice(0, 10).map(pkg => ({
      id: pkg.id,
      type: 'package_purchased',
      client: pkg.user_name || pkg.user_email,
      description: `purchased ${pkg.package_name} package`,
      timestamp: pkg.created_at
    }));

    res.json({
      success: true,
      message: 'Admin dashboard statistics retrieved successfully',
      data: {
        overview: {
          total_packages: totalPackages,
          active_packages: activePackages,
          expired_packages: expiredPackages,
          package_distribution: packageDistribution,
          total_brandkits: totalBrandkits,
          completed_brandkits: completedBrandkits,
          brandkit_completion_rate: totalBrandkits > 0 ? Math.round((completedBrandkits / totalBrandkits) * 100) : 0
        },
        features: {
          total_features: totalFeatures,
          completed_features: completedFeatures,
          in_progress_features: inProgressFeatures,
          pending_features: pendingFeatures,
          completion_rate: totalFeatures > 0 ? Math.round((completedFeatures / totalFeatures) * 100) : 0
        },
        brandkits: {
          total_forms: totalBrandkits,
          completed_forms: completedBrandkits,
          pending_forms: totalBrandkits - completedBrandkits,
          completion_rate: totalBrandkits > 0 ? Math.round((completedBrandkits / totalBrandkits) * 100) : 0,
          breakdown: {
            brandkit_forms: {
              total: brandkitData.total_brandkit_forms || 0,
              completed: brandkitData.completed_brandkit_forms || 0,
              pending: brandkitData.pending_brandkit_forms || 0
            },
            questionnaire_forms: {
              total: brandkitData.total_questionnaire_forms || 0,
              completed: brandkitData.completed_questionnaire_forms || 0,
              pending: brandkitData.pending_questionnaire_forms || 0
            },
            organization_forms: {
              total: brandkitData.total_organization_forms || 0,
              completed: brandkitData.completed_organization_forms || 0,
              pending: brandkitData.pending_organization_forms || 0
            }
          }
        },
        client_requests: {
          total_requests: requestsData.total_requests || 0,
          pending_requests: requestsData.pending_requests || 0,
          in_progress_requests: requestsData.in_progress_requests || 0,
          resolved_requests: requestsData.resolved_requests || 0,
          closed_requests: requestsData.closed_requests || 0,
          urgent_requests: requestsData.urgent_requests || 0,
          high_priority_requests: requestsData.high_priority_requests || 0
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createUserWithPackage,
  getUserPackages,
  getUserPackageById,
  getUserPackagesDetailed,
  getUserActivePackages,
  updateFeatureStatus,
  getAllUserPackages,
  deleteUserPackage,
  getAdminDashboardStats
};
