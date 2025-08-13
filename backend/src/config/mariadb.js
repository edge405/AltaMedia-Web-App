const mysql = require('mysql2/promise');
require('dotenv').config();

// MariaDB connection configuration
const dbConfig = {
  host: process.env.MARIADB_HOST,
  port: process.env.MARIADB_PORT,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  charset: 'utf8mb4',
  timezone: '+00:00',
  // Connection pool settings
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  // SSL configuration (optional)
  ssl: process.env.MARIADB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
};

// Create connection pool
let pool = null;

/**
 * Initialize MariaDB connection pool
 */
const initializePool = () => {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('✅ MariaDB connection pool initialized');
    return pool;
  } catch (error) {
    console.error('❌ Failed to initialize MariaDB pool:', error);
    throw error;
  }
};

/**
 * Get database connection from pool
 */
const getConnection = async () => {
  try {
    if (!pool) {
      pool = initializePool();
    }
    return await pool.getConnection();
  } catch (error) {
    console.error('❌ Failed to get MariaDB connection:', error);
    throw error;
  }
};

/**
 * Execute a query with parameters
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
const executeQuery = async (sql, params = []) => {
  let connection = null;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * Execute a transaction
 * @param {Function} callback - Transaction callback function
 * @returns {Promise<any>} Transaction result
 */
const executeTransaction = async (callback) => {
  let connection = null;
  try {
    connection = await getConnection();
    await connection.beginTransaction();
    
    const result = await callback(connection);
    
    await connection.commit();
    return result;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('❌ Transaction error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * Test database connection
 */
const testConnection = async () => {
  try {
    const result = await executeQuery('SELECT 1 as test');
    console.log('✅ MariaDB connection test successful:', result);
    return true;
  } catch (error) {
    console.error('❌ MariaDB connection test failed:', error);
    return false;
  }
};

/**
 * Close database pool
 */
const closePool = async () => {
  try {
    if (pool) {
      await pool.end();
      console.log('✅ MariaDB connection pool closed');
    }
  } catch (error) {
    console.error('❌ Error closing MariaDB pool:', error);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Closing MariaDB connections...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Closing MariaDB connections...');
  await closePool();
  process.exit(0);
});

module.exports = {
  pool,
  getConnection,
  executeQuery,
  executeTransaction,
  testConnection,
  closePool,
  initializePool
}; 