const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'alta_web',
  charset: 'utf8mb4',
  timezone: '+00:00',
  // Connection pool settings
  connectionLimit: parseInt(process.env.DB_POOL_MAX) || 20,
  acquireTimeout: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
  timeout: 60000,
  reconnect: true,
  // SSL configuration (optional)
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
};

// Create connection pool
let pool = null;

/**
 * Initialize MySQL connection pool
 */
const initializePool = () => {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('✅ MySQL connection pool initialized');
    console.log(`📊 Database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
    return pool;
  } catch (error) {
    console.error('❌ Failed to initialize MySQL pool:', error);
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
    console.error('❌ Failed to get MySQL connection:', error);
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
    const connection = await getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ MySQL connection test successful');
    return true;
  } catch (error) {
    console.error('❌ MySQL connection test failed:', error);
    return false;
  }
};

/**
 * Close the connection pool
 */
const closePool = async () => {
  try {
    if (pool) {
      await pool.end();
      console.log('✅ MySQL connection pool closed');
    }
  } catch (error) {
    console.error('❌ Error closing MySQL pool:', error);
  }
};

module.exports = {
  initializePool,
  getConnection,
  executeQuery,
  executeTransaction,
  testConnection,
  closePool
};
