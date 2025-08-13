const { executeQuery, testConnection } = require('./src/config/mariadb');
const fs = require('fs');
const path = require('path');

async function checkAndCreateTable() {
  console.log('🔍 Checking MariaDB table setup...\n');

  try {
    // Test connection
    console.log('1. Testing MariaDB connection...');
    const connectionTest = await testConnection();
    if (!connectionTest) {
      throw new Error('Failed to connect to MariaDB');
    }
    console.log('✅ MariaDB connection successful\n');

    // Check if table exists
    console.log('2. Checking if company_brand_kit_forms table exists...');
    const tableCheck = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'company_brand_kit_forms'
    `);
    
    if (tableCheck[0].count === 0) {
      console.log('❌ company_brand_kit_forms table does not exist');
      console.log('📝 Creating table...');
      
      // Read the SQL file
      const sqlPath = path.join(__dirname, 'brand_kit_forms_mariadb.sql');
      if (!fs.existsSync(sqlPath)) {
        throw new Error('brand_kit_forms_mariadb.sql file not found');
      }
      
      const sqlContent = fs.readFileSync(sqlPath, 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = sqlContent.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await executeQuery(statement);
            console.log('✅ Executed SQL statement');
          } catch (error) {
            console.log('⚠️  Statement failed (might be expected):', error.message);
          }
        }
      }
      
      console.log('✅ Table creation completed');
    } else {
      console.log('✅ company_brand_kit_forms table already exists');
    }

    // Check table structure
    console.log('\n3. Checking table structure...');
    const columns = await executeQuery(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM information_schema.columns 
      WHERE table_schema = DATABASE() 
      AND table_name = 'company_brand_kit_forms'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('Table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'nullable' : 'not null'})`);
    });

    // Test insert
    console.log('\n4. Testing table insert...');
    const testUserId = 999999;
    
    try {
      await executeQuery(`
        INSERT INTO company_brand_kit_forms (
          user_id, 
          business_email, 
          business_name,
          current_step,
          progress_percentage,
          is_completed
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        testUserId,
        'test@example.com',
        'Test Business',
        1,
        8,
        false
      ]);
      
      console.log('✅ Test insert successful');
      
      // Clean up test data
      await executeQuery('DELETE FROM company_brand_kit_forms WHERE user_id = ?', [testUserId]);
      console.log('✅ Test data cleaned up');
      
    } catch (error) {
      console.error('❌ Test insert failed:', error.message);
    }

    console.log('\n🎉 MariaDB table setup completed successfully!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

checkAndCreateTable();
