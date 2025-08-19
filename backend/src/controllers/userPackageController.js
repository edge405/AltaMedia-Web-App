const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { supabase, supabaseAdmin } = require('../config/supabase');
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
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate secure random password
    const generatedPassword = crypto.randomBytes(5).toString('hex');
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        fullname,
        phone_number,
        role: 'user'
      })
      .select('id, email, fullname, phone_number, created_at')
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: userError.message
      });
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
    const { data: purchasedPackage, error: packageError } = await supabase
      .from('purchased_package_with_features')
      .insert({
        user_id: newUser.id,
        package_name,
        expiration_date,
        total_amount,
        features: processedFeatures
      })
      .select('id, user_id, package_name, purchase_date, expiration_date, status, total_amount, features, created_at')
      .single();

    if (packageError) {
      console.error('Package purchase creation error:', packageError);
      // Rollback user creation
      await supabase
        .from('users')
        .delete()
        .eq('id', newUser.id);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create package purchase',
        error: packageError.message
      });
    }

    // Send welcome email with package details
    const emailResult = await sendWelcomeEmailWithPackage(
      email, 
      generatedPassword, 
      fullname, 
      package_name, 
      expiration_date, 
      total_amount, 
      processedFeatures
    );

    if (!emailResult.success) {
      console.warn('Failed to send welcome email:', emailResult.error);
      // Don't fail the entire operation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'User and package created successfully',
      data: {
        user_id: newUser.id,
        purchased_package_with_features_id: purchasedPackage.id,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullname: newUser.fullname,
          phone_number: newUser.phone_number,
          created_at: newUser.created_at
        },
        package: {
          id: purchasedPackage.id,
          package_name,
          expiration_date: purchasedPackage.expiration_date,
          total_amount: purchasedPackage.total_amount,
          status: purchasedPackage.status,
          purchase_date: purchasedPackage.purchase_date,
          features: processedFeatures
        },
        email_sent: emailResult.success
      }
    });

  } catch (error) {
    console.error('Create user with package error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Send welcome email with package details
 */
const sendWelcomeEmailWithPackage = async (email, password, fullname, packageName, expirationDate, totalAmount, features) => {
  const featuresList = features.map(feature => 
    `<li><strong>${feature.feature_name}</strong></li>`
  ).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: #333; margin: 0; text-align: center;">Welcome to AltaMedia!</h1>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #495057; margin-top: 0;">Hello ${fullname || 'there'}!</h2>
        
        <p style="color: #6c757d; line-height: 1.6;">
          Your account has been successfully created with your package. Here are your login credentials:
        </p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
        </div>
        
        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; margin: 20px 0;">
          <h3 style="color: #0056b3; margin-top: 0;">Your Package Details</h3>
          <p style="margin: 5px 0;"><strong>Package:</strong> ${packageName}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₱${totalAmount}</p>
          <p style="margin: 5px 0;"><strong>Expiration Date:</strong> ${new Date(expirationDate).toLocaleDateString()}</p>
        </div>
        
        ${features.length > 0 ? `
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">Your Package Features</h3>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${featuresList}
          </ul>
        </div>
        ` : ''}
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">
            <strong>Important:</strong> For security reasons, we recommend changing your password after your first login.
          </p>
        </div>
        
        <p style="color: #6c757d; line-height: 1.6;">
          You can now log in to your account and track the progress of your package.
        </p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://altamedia-web-app.onrender.com/login" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Login to Your Account
          </a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>&copy; 2025 AltaMedia. All rights reserved.</p>
      </div>
    </div>
  `;

  return await require('../utils/email').sendEmail(
    email,
    'Welcome to AltaMedia - Your Account and Package Details',
    htmlContent
  );
};

module.exports = {
  createUserWithPackage
};
