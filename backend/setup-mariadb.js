const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 MariaDB Setup Script');
console.log('========================\n');

async function setupMariaDB() {
  try {
    // Check if package.json exists
    const packagePath = path.join(__dirname, 'package.json');
    if (!fs.existsSync(packagePath)) {
      console.error('❌ package.json not found. Please run this script from the backend directory.');
      process.exit(1);
    }

    // Install mysql2 dependency
    console.log('1️⃣ Installing mysql2 dependency...');
    try {
      execSync('npm install mysql2', { stdio: 'inherit' });
      console.log('✅ mysql2 installed successfully\n');
    } catch (error) {
      console.error('❌ Failed to install mysql2:', error.message);
      process.exit(1);
    }

    // Check if .env file exists
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
      console.log('2️⃣ Creating .env file from template...');
      const envExamplePath = path.join(__dirname, 'mariadb.env.example');
      
      if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ .env file created from template');
        console.log('⚠️  Please update the .env file with your MariaDB credentials\n');
      } else {
        console.log('⚠️  No mariadb.env.example found. Please create a .env file manually.');
        console.log('   Required variables: MARIADB_HOST, MARIADB_USER, MARIADB_PASSWORD, MARIADB_DATABASE\n');
      }
    } else {
      console.log('✅ .env file already exists\n');
    }

    // Test connection
    console.log('3️⃣ Testing MariaDB connection...');
    try {
      const mariadb = require('./src/config/mariadb');
      const connectionTest = await mariadb.testConnection();
      
      if (connectionTest) {
        console.log('✅ MariaDB connection successful!');
        console.log('🎉 Setup completed successfully!');
      } else {
        console.log('❌ MariaDB connection failed!');
        console.log('Please check your .env configuration and ensure MariaDB is running.');
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      console.log('\nTroubleshooting tips:');
      console.log('1. Make sure MariaDB is installed and running');
      console.log('2. Check your .env file configuration');
      console.log('3. Verify database credentials');
      console.log('4. Ensure the database exists');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setupMariaDB().catch(error => {
  console.error('❌ Setup script failed:', error);
  process.exit(1);
}); 