const bcrypt = require('bcrypt');
const { executeQuery } = require('./src/config/mysql');

const createAdminUser = async () => {
  try {
    console.log('🔄 Creating admin user...');

    // Check if admin user already exists
    const existingUsers = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      ['admin@altamedia.com']
    );

    if (existingUsers.length > 0) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const result = await executeQuery(
      `INSERT INTO users (email, password, fullname, role) 
       VALUES (?, ?, ?, 'admin')`,
      ['admin@altamedia.com', hashedPassword, 'Admin User']
    );

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@altamedia.com');
    console.log('🔑 Password: admin123');
    console.log('🆔 User ID:', result.insertId);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// Run the script
createAdminUser().then(() => {
  console.log('🏁 Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
