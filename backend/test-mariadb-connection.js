const mariadb = require('../src/config/mariadb');

/**
 * Test MariaDB Connection and Basic Operations
 */
async function testMariaDBConnection() {
  console.log('🧪 Testing MariaDB Connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const connectionTest = await mariadb.testConnection();
    if (connectionTest) {
      console.log('✅ Connection successful!\n');
    } else {
      console.log('❌ Connection failed!\n');
      return;
    }

    // Test 2: Simple query
    console.log('2️⃣ Testing simple query...');
    const result = await mariadb.executeQuery('SELECT 1 as test_value, NOW() as current_time');
    console.log('✅ Query result:', result);
    console.log('');

    // Test 3: Check if tables exist
    console.log('3️⃣ Checking database tables...');
    const tables = await mariadb.executeQuery(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
    `, [process.env.MARIADB_DATABASE || 'alta_media']);
    
    console.log('📋 Available tables:');
    tables.forEach(table => {
      console.log(`   - ${table.TABLE_NAME}`);
    });
    console.log('');

    // Test 4: Test transaction
    console.log('4️⃣ Testing transaction...');
    const transactionResult = await mariadb.executeTransaction(async (connection) => {
      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
      return rows[0].count;
    });
    console.log(`✅ Transaction successful! User count: ${transactionResult}\n`);

    // Test 5: Test error handling
    console.log('5️⃣ Testing error handling...');
    try {
      await mariadb.executeQuery('SELECT * FROM non_existent_table');
    } catch (error) {
      console.log('✅ Error handling works correctly:', error.message);
    }
    console.log('');

    console.log('🎉 All MariaDB tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Close the pool
    await mariadb.closePool();
    process.exit(0);
  }
}

/**
 * Test Database Operations
 */
async function testDatabaseOperations() {
  console.log('🧪 Testing Database Operations...\n');

  try {
    // Test 1: Insert test user
    console.log('1️⃣ Testing user insertion...');
    const insertResult = await mariadb.executeQuery(`
      INSERT INTO users (email, password, fullname) 
      VALUES (?, ?, ?)
    `, ['test@example.com', 'hashed_password', 'Test User']);
    
    console.log('✅ User inserted successfully');
    console.log('');

    // Test 2: Query test user
    console.log('2️⃣ Testing user query...');
    const users = await mariadb.executeQuery(`
      SELECT id, email, fullname, created_at 
      FROM users 
      WHERE email = ?
    `, ['test@example.com']);
    
    console.log('✅ User query result:', users);
    console.log('');

    // Test 3: Update test user
    console.log('3️⃣ Testing user update...');
    const updateResult = await mariadb.executeQuery(`
      UPDATE users 
      SET fullname = ? 
      WHERE email = ?
    `, ['Updated Test User', 'test@example.com']);
    
    console.log('✅ User updated successfully');
    console.log('');

    // Test 4: Delete test user
    console.log('4️⃣ Testing user deletion...');
    const deleteResult = await mariadb.executeQuery(`
      DELETE FROM users 
      WHERE email = ?
    `, ['test@example.com']);
    
    console.log('✅ User deleted successfully');
    console.log('');

    console.log('🎉 All database operations completed successfully!');

  } catch (error) {
    console.error('❌ Database operations test failed:', error.message);
  } finally {
    await mariadb.closePool();
    process.exit(0);
  }
}

/**
 * Test Connection Pool
 */
async function testConnectionPool() {
  console.log('🧪 Testing Connection Pool...\n');

  try {
    // Test multiple concurrent connections
    console.log('1️⃣ Testing concurrent connections...');
    const promises = [];
    
    for (let i = 0; i < 5; i++) {
      promises.push(
        mariadb.executeQuery('SELECT ? as connection_id, NOW() as timestamp', [i + 1])
      );
    }
    
    const results = await Promise.all(promises);
    console.log('✅ Concurrent connections successful!');
    results.forEach((result, index) => {
      console.log(`   Connection ${index + 1}:`, result[0]);
    });
    console.log('');

    // Test connection pool limits
    console.log('2️⃣ Testing pool limits...');
    const poolPromises = [];
    
    for (let i = 0; i < 15; i++) {
      poolPromises.push(
        mariadb.executeQuery('SELECT ? as request_id', [i + 1])
          .catch(err => ({ error: err.message, request_id: i + 1 }))
      );
    }
    
    const poolResults = await Promise.all(poolPromises);
    const successful = poolResults.filter(r => !r.error).length;
    const failed = poolResults.filter(r => r.error).length;
    
    console.log(`✅ Pool test completed: ${successful} successful, ${failed} failed`);
    console.log('');

    console.log('🎉 Connection pool tests completed!');

  } catch (error) {
    console.error('❌ Connection pool test failed:', error.message);
  } finally {
    await mariadb.closePool();
    process.exit(0);
  }
}

// Main execution
async function main() {
  const testType = process.argv[2] || 'connection';
  
  console.log('🚀 MariaDB Connection Test Suite');
  console.log('================================\n');
  
  switch (testType) {
    case 'connection':
      await testMariaDBConnection();
      break;
    case 'operations':
      await testDatabaseOperations();
      break;
    case 'pool':
      await testConnectionPool();
      break;
    case 'all':
      await testMariaDBConnection();
      await testDatabaseOperations();
      await testConnectionPool();
      break;
    default:
      console.log('Usage: node test-mariadb-connection.js [connection|operations|pool|all]');
      console.log('  connection  - Test basic connection and queries');
      console.log('  operations  - Test CRUD operations');
      console.log('  pool        - Test connection pool');
      console.log('  all         - Run all tests');
      process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the test
main().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
}); 