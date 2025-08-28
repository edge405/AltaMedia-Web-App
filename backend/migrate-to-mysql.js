#!/usr/bin/env node

/**
 * Migration script to transfer data from Supabase to MySQL
 * This script helps migrate existing data to the new MySQL database
 */

const { createClient } = require('@supabase/supabase-js');
const { executeQuery, initializePool, testConnection } = require('./src/config/mysql');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase configuration. Please check your environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

/**
 * Migrate users table
 */
const migrateUsers = async () => {
  console.log('🔄 Migrating users...');
  
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching users from Supabase:', error);
      return false;
    }
    
    console.log(`📊 Found ${users.length} users to migrate`);
    
    for (const user of users) {
      try {
        // Check if user already exists
        const existingUsers = await executeQuery(
          'SELECT id FROM users WHERE email = ?',
          [user.email]
        );
        
        if (existingUsers.length === 0) {
          await executeQuery(
            'INSERT INTO users (id, email, password, email_verified_at, fullname, phone_number, address, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              user.id,
              user.email,
              user.password,
              user.email_verified_at,
              user.fullname,
              user.phone_number,
              user.address,
              user.role || 'user',
              user.created_at,
              user.updated_at
            ]
          );
          console.log(`✅ Migrated user: ${user.email}`);
        } else {
          console.log(`⏭️  User already exists: ${user.email}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating user ${user.email}:`, error);
      }
    }
    
    console.log('✅ Users migration completed');
    return true;
  } catch (error) {
    console.error('❌ Users migration failed:', error);
    return false;
  }
};

/**
 * Migrate packages table
 */
const migratePackages = async () => {
  console.log('🔄 Migrating packages...');
  
  try {
    const { data: packages, error } = await supabase
      .from('packages')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching packages from Supabase:', error);
      return false;
    }
    
    console.log(`📊 Found ${packages.length} packages to migrate`);
    
    for (const package of packages) {
      try {
        // Check if package already exists
        const existingPackages = await executeQuery(
          'SELECT id FROM packages WHERE name = ?',
          [package.name]
        );
        
        if (existingPackages.length === 0) {
          await executeQuery(
            'INSERT INTO packages (id, name, description, price, duration_days, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              package.id,
              package.name,
              package.description,
              package.price,
              package.duration_days,
              package.is_active,
              package.created_at,
              package.updated_at
            ]
          );
          console.log(`✅ Migrated package: ${package.name}`);
        } else {
          console.log(`⏭️  Package already exists: ${package.name}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating package ${package.name}:`, error);
      }
    }
    
    console.log('✅ Packages migration completed');
    return true;
  } catch (error) {
    console.error('❌ Packages migration failed:', error);
    return false;
  }
};

/**
 * Migrate package features table
 */
const migratePackageFeatures = async () => {
  console.log('🔄 Migrating package features...');
  
  try {
    const { data: features, error } = await supabase
      .from('package_features')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching package features from Supabase:', error);
      return false;
    }
    
    console.log(`📊 Found ${features.length} package features to migrate`);
    
    for (const feature of features) {
      try {
        // Check if feature already exists
        const existingFeatures = await executeQuery(
          'SELECT id FROM package_features WHERE id = ?',
          [feature.id]
        );
        
        if (existingFeatures.length === 0) {
          await executeQuery(
            'INSERT INTO package_features (id, package_id, feature_name, feature_description, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [
              feature.id,
              feature.package_id,
              feature.feature_name,
              feature.feature_description,
              feature.is_active,
              feature.created_at
            ]
          );
          console.log(`✅ Migrated feature: ${feature.feature_name}`);
        } else {
          console.log(`⏭️  Feature already exists: ${feature.feature_name}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating feature ${feature.feature_name}:`, error);
      }
    }
    
    console.log('✅ Package features migration completed');
    return true;
  } catch (error) {
    console.error('❌ Package features migration failed:', error);
    return false;
  }
};

/**
 * Migrate package purchases table
 */
const migratePackagePurchases = async () => {
  console.log('🔄 Migrating package purchases...');
  
  try {
    const { data: purchases, error } = await supabase
      .from('package_purchases')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching package purchases from Supabase:', error);
      return false;
    }
    
    console.log(`📊 Found ${purchases.length} package purchases to migrate`);
    
    for (const purchase of purchases) {
      try {
        // Check if purchase already exists
        const existingPurchases = await executeQuery(
          'SELECT id FROM package_purchases WHERE id = ?',
          [purchase.id]
        );
        
        if (existingPurchases.length === 0) {
          await executeQuery(
            'INSERT INTO package_purchases (id, user_id, package_id, purchase_date, expiration_date, status, total_amount, features, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              purchase.id,
              purchase.user_id,
              purchase.package_id,
              purchase.purchase_date,
              purchase.expiration_date,
              purchase.status,
              purchase.total_amount,
              purchase.features ? JSON.stringify(purchase.features) : null,
              purchase.created_at,
              purchase.updated_at
            ]
          );
          console.log(`✅ Migrated purchase ID: ${purchase.id}`);
        } else {
          console.log(`⏭️  Purchase already exists: ${purchase.id}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating purchase ${purchase.id}:`, error);
      }
    }
    
    console.log('✅ Package purchases migration completed');
    return true;
  } catch (error) {
    console.error('❌ Package purchases migration failed:', error);
    return false;
  }
};

/**
 * Migrate addons table
 */
const migrateAddons = async () => {
  console.log('🔄 Migrating addons...');
  
  try {
    const { data: addons, error } = await supabase
      .from('addons')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching addons from Supabase:', error);
      return false;
    }
    
    console.log(`📊 Found ${addons.length} addons to migrate`);
    
    for (const addon of addons) {
      try {
        // Check if addon already exists
        const existingAddons = await executeQuery(
          'SELECT id FROM addons WHERE id = ?',
          [addon.id]
        );
        
        if (existingAddons.length === 0) {
          await executeQuery(
            'INSERT INTO addons (id, name, description, price_type, base_price, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              addon.id,
              addon.name,
              addon.description,
              addon.price_type,
              addon.base_price,
              addon.is_active,
              addon.created_at,
              addon.updated_at
            ]
          );
          console.log(`✅ Migrated addon: ${addon.name}`);
        } else {
          console.log(`⏭️  Addon already exists: ${addon.name}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating addon ${addon.name}:`, error);
      }
    }
    
    console.log('✅ Addons migration completed');
    return true;
  } catch (error) {
    console.error('❌ Addons migration failed:', error);
    return false;
  }
};

/**
 * Migrate addon features table
 */
const migrateAddonFeatures = async () => {
  console.log('🔄 Migrating addon features...');
  
  try {
    const { data: features, error } = await supabase
      .from('addon_features')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching addon features from Supabase:', error);
      return false;
    }
    
    console.log(`📊 Found ${features.length} addon features to migrate`);
    
    for (const feature of features) {
      try {
        // Check if feature already exists
        const existingFeatures = await executeQuery(
          'SELECT id FROM addon_features WHERE id = ?',
          [feature.id]
        );
        
        if (existingFeatures.length === 0) {
          await executeQuery(
            'INSERT INTO addon_features (id, addon_id, feature_name, feature_description, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [
              feature.id,
              feature.addon_id,
              feature.feature_name,
              feature.feature_description,
              feature.is_active,
              feature.created_at
            ]
          );
          console.log(`✅ Migrated addon feature: ${feature.feature_name}`);
        } else {
          console.log(`⏭️  Addon feature already exists: ${feature.feature_name}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating addon feature ${feature.feature_name}:`, error);
      }
    }
    
    console.log('✅ Addon features migration completed');
    return true;
  } catch (error) {
    console.error('❌ Addon features migration failed:', error);
    return false;
  }
};

/**
 * Migrate purchased addons table
 */
const migratePurchasedAddons = async () => {
  console.log('🔄 Migrating purchased addons...');
  
  try {
    const { data: purchases, error } = await supabase
      .from('purchased_addons')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching purchased addons from Supabase:', error);
      return false;
    }
    
    console.log(`📊 Found ${purchases.length} purchased addons to migrate`);
    
    for (const purchase of purchases) {
      try {
        // Check if purchase already exists
        const existingPurchases = await executeQuery(
          'SELECT id FROM purchased_addons WHERE id = ?',
          [purchase.id]
        );
        
        if (existingPurchases.length === 0) {
          await executeQuery(
            'INSERT INTO purchased_addons (id, user_id, addon_id, purchase_date, base_price, status, duration, price_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              purchase.id,
              purchase.user_id,
              purchase.addon_id,
              purchase.purchase_date,
              purchase.base_price,
              purchase.status,
              purchase.duration,
              purchase.price_type,
              purchase.created_at
            ]
          );
          console.log(`✅ Migrated purchased addon ID: ${purchase.id}`);
        } else {
          console.log(`⏭️  Purchased addon already exists: ${purchase.id}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating purchased addon ${purchase.id}:`, error);
      }
    }
    
    console.log('✅ Purchased addons migration completed');
    return true;
  } catch (error) {
    console.error('❌ Purchased addons migration failed:', error);
    return false;
  }
};

/**
 * Migrate purchased package with features table
 */
const migratePurchasedPackageWithFeatures = async () => {
  console.log('🔄 Migrating purchased package with features...');
  
  try {
    const { data: purchases, error } = await supabase
      .from('purchased_package_with_features')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching purchased package with features from Supabase:', error);
      return false;
    }
    
    console.log(`📊 Found ${purchases.length} purchased package with features to migrate`);
    
    for (const purchase of purchases) {
      try {
        // Check if purchase already exists
        const existingPurchases = await executeQuery(
          'SELECT id FROM purchased_package_with_features WHERE id = ?',
          [purchase.id]
        );
        
        if (existingPurchases.length === 0) {
          await executeQuery(
            'INSERT INTO purchased_package_with_features (id, user_id, purchase_date, expiration_date, status, total_amount, features, package_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              purchase.id,
              purchase.user_id,
              purchase.purchase_date,
              purchase.expiration_date,
              purchase.status,
              purchase.total_amount,
              purchase.features ? JSON.stringify(purchase.features) : null,
              purchase.package_name,
              purchase.created_at,
              purchase.updated_at
            ]
          );
          console.log(`✅ Migrated purchased package with features ID: ${purchase.id}`);
        } else {
          console.log(`⏭️  Purchased package with features already exists: ${purchase.id}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating purchased package with features ${purchase.id}:`, error);
      }
    }
    
    console.log('✅ Purchased package with features migration completed');
    return true;
  } catch (error) {
    console.error('❌ Purchased package with features migration failed:', error);
    return false;
  }
};

/**
 * Migrate package feature comments table
 */
const migratePackageFeatureComments = async () => {
  console.log('🔄 Migrating package feature comments...');
  
  try {
    const { data: comments, error } = await supabase
      .from('package_feature_comments')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching package feature comments from Supabase:', error);
      return false;
    }
    
    console.log(`📊 Found ${comments.length} package feature comments to migrate`);
    
    for (const comment of comments) {
      try {
        // Check if comment already exists
        const existingComments = await executeQuery(
          'SELECT id FROM package_feature_comments WHERE id = ?',
          [comment.id]
        );
        
        if (existingComments.length === 0) {
          await executeQuery(
            'INSERT INTO package_feature_comments (id, package_feature_id, user_id, comment_text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            [
              comment.id,
              comment.package_feature_id,
              comment.user_id,
              comment.comment_text,
              comment.created_at,
              comment.updated_at
            ]
          );
          console.log(`✅ Migrated comment ID: ${comment.id}`);
        } else {
          console.log(`⏭️  Comment already exists: ${comment.id}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating comment ${comment.id}:`, error);
      }
    }
    
    console.log('✅ Package feature comments migration completed');
    return true;
  } catch (error) {
    console.error('❌ Package feature comments migration failed:', error);
    return false;
  }
};

/**
 * Migrate organization forms table
 */
const migrateOrganizationForms = async () => {
  console.log('🔄 Migrating organization forms...');
  
  try {
    const { data: forms, error } = await supabase
      .from('organization_forms')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching organization forms from Supabase:', error);
      return false;
    }
    
    console.log(`📊 Found ${forms.length} organization forms to migrate`);
    
    for (const form of forms) {
      try {
        // Check if form already exists
        const existingForms = await executeQuery(
          'SELECT id FROM organization_forms WHERE id = ?',
          [form.id]
        );
        
        if (existingForms.length === 0) {
          await executeQuery(
            `INSERT INTO organization_forms (
              id, user_id, building_type, organization_name, social_media_goals, 
              brand_uniqueness, desired_emotion, target_platforms, content_types, 
              deliverables, timeline, main_contact, additional_info, reference_materials,
              current_step, progress_percentage, is_completed, completed_at, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              form.id,
              form.user_id,
              form.building_type,
              form.organization_name,
              form.social_media_goals,
              form.brand_uniqueness,
              form.desired_emotion,
              form.target_platforms ? JSON.stringify(form.target_platforms) : null,
              form.content_types ? JSON.stringify(form.content_types) : null,
              form.deliverables ? JSON.stringify(form.deliverables) : null,
              form.timeline,
              form.main_contact,
              form.additional_info,
              form.reference_materials,
              form.current_step,
              form.progress_percentage,
              form.is_completed,
              form.completed_at,
              form.created_at,
              form.updated_at
            ]
          );
          console.log(`✅ Migrated organization form ID: ${form.id}`);
        } else {
          console.log(`⏭️  Organization form already exists: ${form.id}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating organization form ${form.id}:`, error);
      }
    }
    
    console.log('✅ Organization forms migration completed');
    return true;
  } catch (error) {
    console.error('❌ Organization forms migration failed:', error);
    return false;
  }
};

/**
 * Migrate product service forms table
 */
const migrateProductServiceForms = async () => {
  console.log('🔄 Migrating product service forms...');
  
  try {
    const { data: forms, error } = await supabase
      .from('product_service_forms')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching product service forms from Supabase:', error);
      return false;
    }
    
    console.log(`📊 Found ${forms.length} product service forms to migrate`);
    
    for (const form of forms) {
      try {
        // Check if form already exists
        const existingForms = await executeQuery(
          'SELECT id FROM product_service_forms WHERE id = ?',
          [form.id]
        );
        
        if (existingForms.length === 0) {
          await executeQuery(
            `INSERT INTO product_service_forms (
              id, user_id, building_type, product_name, product_description, industry,
              want_to_attract, mission_story, desired_emotion, brand_tone, target_audience_profile,
              reach_locations, brand_personality, design_style, preferred_colors, colors_to_avoid,
              competitors, brand_kit_use, brand_elements, file_formats, platform_support,
              timeline, primary_location, preferred_contact, approver, special_notes,
              reference_materials, current_step, progress_percentage, is_completed, completed_at,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              form.id,
              form.user_id,
              form.building_type,
              form.product_name,
              form.product_description,
              form.industry ? JSON.stringify(form.industry) : null,
              form.want_to_attract,
              form.mission_story,
              form.desired_emotion,
              form.brand_tone,
              form.target_audience_profile,
              form.reach_locations ? JSON.stringify(form.reach_locations) : null,
              form.brand_personality ? JSON.stringify(form.brand_personality) : null,
              form.design_style ? JSON.stringify(form.design_style) : null,
              form.preferred_colors ? JSON.stringify(form.preferred_colors) : null,
              form.colors_to_avoid ? JSON.stringify(form.colors_to_avoid) : null,
              form.competitors,
              form.brand_kit_use ? JSON.stringify(form.brand_kit_use) : null,
              form.brand_elements ? JSON.stringify(form.brand_elements) : null,
              form.file_formats ? JSON.stringify(form.file_formats) : null,
              form.platform_support ? JSON.stringify(form.platform_support) : null,
              form.timeline,
              form.primary_location,
              form.preferred_contact,
              form.approver,
              form.special_notes,
              form.reference_materials,
              form.current_step,
              form.progress_percentage,
              form.is_completed,
              form.completed_at,
              form.created_at,
              form.updated_at
            ]
          );
          console.log(`✅ Migrated product service form ID: ${form.id}`);
        } else {
          console.log(`⏭️  Product service form already exists: ${form.id}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating product service form ${form.id}:`, error);
      }
    }
    
    console.log('✅ Product service forms migration completed');
    return true;
  } catch (error) {
    console.error('❌ Product service forms migration failed:', error);
    return false;
  }
};

/**
 * Migrate company brand kit forms table
 */
const migrateCompanyBrandKitForms = async () => {
  console.log('🔄 Migrating company brand kit forms...');
  
  try {
    const { data: forms, error } = await supabase
      .from('company_brand_kit_forms')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching company brand kit forms from Supabase:', error);
      return false;
    }
    
    console.log(`📊 Found ${forms.length} company brand kit forms to migrate`);
    
    for (const form of forms) {
      try {
        // Check if form already exists
        const existingForms = await executeQuery(
          'SELECT id FROM company_brand_kit_forms WHERE id = ?',
          [form.id]
        );
        
        if (existingForms.length === 0) {
          // This is a large table, so we'll build the query dynamically
          const fields = Object.keys(form).filter(key => key !== 'id');
          const placeholders = fields.map(() => '?').join(', ');
          const values = fields.map(field => {
            const value = form[field];
            // Handle JSON fields
            if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
              return JSON.stringify(value);
            }
            return value;
          });
          
          await executeQuery(
            `INSERT INTO company_brand_kit_forms (id, ${fields.join(', ')}) VALUES (?, ${placeholders})`,
            [form.id, ...values]
          );
          console.log(`✅ Migrated company brand kit form ID: ${form.id}`);
        } else {
          console.log(`⏭️  Company brand kit form already exists: ${form.id}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating company brand kit form ${form.id}:`, error);
      }
    }
    
    console.log('✅ Company brand kit forms migration completed');
    return true;
  } catch (error) {
    console.error('❌ Company brand kit forms migration failed:', error);
    return false;
  }
};

/**
 * Main migration function
 */
const runMigration = async () => {
  console.log('🚀 Starting Supabase to MySQL migration...');
  console.log('📋 This will migrate all data from your Supabase database to MySQL');
  console.log('');
  
  try {
    // Initialize MySQL connection
    console.log('🔄 Initializing MySQL connection...');
    await initializePool();
    
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Failed to connect to MySQL database');
      process.exit(1);
    }
    
    console.log('✅ MySQL connection established');
    console.log('');
    
    // Run migrations in order
    const migrations = [
      { name: 'Users', fn: migrateUsers },
      { name: 'Packages', fn: migratePackages },
      { name: 'Package Features', fn: migratePackageFeatures },
      { name: 'Package Purchases', fn: migratePackagePurchases },
      { name: 'Addons', fn: migrateAddons },
      { name: 'Addon Features', fn: migrateAddonFeatures },
      { name: 'Purchased Addons', fn: migratePurchasedAddons },
      { name: 'Purchased Package with Features', fn: migratePurchasedPackageWithFeatures },
      { name: 'Package Feature Comments', fn: migratePackageFeatureComments },
      { name: 'Organization Forms', fn: migrateOrganizationForms },
      { name: 'Product Service Forms', fn: migrateProductServiceForms },
      { name: 'Company Brand Kit Forms', fn: migrateCompanyBrandKitForms }
    ];
    
    let successCount = 0;
    let totalCount = migrations.length;
    
    for (const migration of migrations) {
      console.log(`🔄 Running ${migration.name} migration...`);
      const success = await migration.fn();
      
      if (success) {
        successCount++;
        console.log(`✅ ${migration.name} migration completed successfully`);
      } else {
        console.log(`❌ ${migration.name} migration failed`);
      }
      
      console.log('');
    }
    
    console.log('🎉 Migration completed!');
    console.log(`📊 Successfully migrated ${successCount}/${totalCount} tables`);
    
    if (successCount === totalCount) {
      console.log('✅ All migrations completed successfully!');
      console.log('');
      console.log('📝 Next steps:');
      console.log('1. Update your environment variables to use MySQL instead of Supabase');
      console.log('2. Restart your application');
      console.log('3. Test your application to ensure everything works correctly');
    } else {
      console.log('⚠️  Some migrations failed. Please check the logs above for details.');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = {
  runMigration,
  migrateUsers,
  migratePackages,
  migratePackageFeatures,
  migratePackagePurchases,
  migrateAddons,
  migrateAddonFeatures,
  migratePurchasedAddons,
  migratePurchasedPackageWithFeatures,
  migratePackageFeatureComments,
  migrateOrganizationForms,
  migrateProductServiceForms,
  migrateCompanyBrandKitForms
};
