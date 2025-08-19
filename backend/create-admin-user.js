const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('./src/config/supabase');

async function createAdminUser() {
  try {
    const adminEmail = 'admin@altamedia.com';
    const adminPassword = 'admin123';
    const adminFullname = 'Admin User';

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', adminEmail)
      .single();

    if (existingUser) {
      console.log('Admin user already exists:', existingUser.email);
      
      // Update the password if needed
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ 
          password: hashedPassword,
          role: 'admin',
          status: 'active'
        })
        .eq('email', adminEmail);

      if (updateError) {
        console.error('Error updating admin user:', updateError);
      } else {
        console.log('Admin user password updated successfully');
      }
    } else {
      // Create new admin user
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          email: adminEmail,
          password: hashedPassword,
          fullname: adminFullname,
          role: 'admin',
          status: 'active'
        })
        .select('id, email, fullname, role')
        .single();

      if (createError) {
        console.error('Error creating admin user:', createError);
      } else {
        console.log('Admin user created successfully:', newUser);
      }
    }

    console.log('\nAdmin Login Credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\nYou can now use these credentials to login to the admin panel.');

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
createAdminUser();
