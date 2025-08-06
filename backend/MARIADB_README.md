# MariaDB Configuration Guide

This guide explains how to set up and use MariaDB with the AltaMedia application.

## 📋 Prerequisites

1. **MariaDB Server** - Install MariaDB on your system
2. **Node.js** - Version 14 or higher
3. **npm** - Node package manager

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Run the setup script
node setup-mariadb.js
```

The setup script will:
- Install the `mysql2` dependency
- Create a `.env` file from template
- Test the database connection

### 2. Configure Environment Variables

Copy the environment template and update with your MariaDB settings:

```bash
cp mariadb.env.example .env
```

Edit the `.env` file with your MariaDB credentials:

```env
MARIADB_HOST=localhost
MARIADB_PORT=3306
MARIADB_USER=root
MARIADB_PASSWORD=your_password_here
MARIADB_DATABASE=alta_media
MARIADB_SSL=false
```

### 3. Create Database

Connect to MariaDB and create the database:

```sql
CREATE DATABASE alta_media CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 🧪 Testing Connection

### Basic Connection Test

```bash
node test-mariadb-connection.js
```

### Specific Test Types

```bash
# Test basic connection and queries
node test-mariadb-connection.js connection

# Test CRUD operations
node test-mariadb-connection.js operations

# Test connection pool
node test-mariadb-connection.js pool

# Run all tests
node test-mariadb-connection.js all
```

## 📁 Files Overview

### Configuration Files

- **`src/config/mariadb.js`** - Main MariaDB configuration
- **`mariadb.env.example`** - Environment variables template
- **`.env`** - Your environment configuration (create this)

### Test Files

- **`test-mariadb-connection.js`** - Comprehensive connection tests
- **`setup-mariadb.js`** - Automated setup script

## 🔧 Configuration Options

### Connection Settings

```javascript
const dbConfig = {
  host: process.env.MARIADB_HOST || 'localhost',
  port: process.env.MARIADB_PORT || 3306,
  user: process.env.MARIADB_USER || 'root',
  password: process.env.MARIADB_PASSWORD || '',
  database: process.env.MARIADB_DATABASE || 'alta_media',
  charset: 'utf8mb4',
  timezone: '+00:00'
};
```

### Pool Settings

```javascript
{
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
}
```

## 📚 API Reference

### Available Functions

```javascript
const mariadb = require('./src/config/mariadb');

// Initialize connection pool
await mariadb.initializePool();

// Get a connection from pool
const connection = await mariadb.getConnection();

// Execute a query
const results = await mariadb.executeQuery('SELECT * FROM users WHERE id = ?', [1]);

// Execute a transaction
const result = await mariadb.executeTransaction(async (connection) => {
  // Your transaction code here
  return 'success';
});

// Test connection
const isConnected = await mariadb.testConnection();

// Close pool
await mariadb.closePool();
```

## 🔍 Troubleshooting

### Common Issues

1. **Connection Refused**
   ```
   Error: connect ECONNREFUSED
   ```
   - Ensure MariaDB is running
   - Check host and port settings

2. **Access Denied**
   ```
   Error: ER_ACCESS_DENIED_ERROR
   ```
   - Verify username and password
   - Check user permissions

3. **Database Not Found**
   ```
   Error: ER_BAD_DB_ERROR
   ```
   - Create the database first
   - Check database name in .env

4. **Module Not Found**
   ```
   Error: Cannot find module 'mysql2'
   ```
   - Run `npm install mysql2`
   - Check package.json

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG=mysql2 node test-mariadb-connection.js
```

## 🔒 Security Considerations

1. **Environment Variables** - Never commit `.env` files to version control
2. **SSL Connection** - Enable SSL for production environments
3. **Connection Pooling** - Use connection pooling to prevent resource exhaustion
4. **Parameterized Queries** - Always use parameterized queries to prevent SQL injection

## 📊 Performance Tips

1. **Indexes** - Ensure proper indexes on frequently queried columns
2. **Connection Pool** - Adjust pool size based on your application needs
3. **Query Optimization** - Use EXPLAIN to analyze query performance
4. **Connection Limits** - Monitor connection usage and adjust limits accordingly

## 🔄 Migration from Supabase

If migrating from Supabase to MariaDB:

1. Export your data from Supabase
2. Import data into MariaDB using the provided schema
3. Update your controllers to use MariaDB instead of Supabase
4. Test all endpoints thoroughly

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review MariaDB logs for detailed error messages
3. Test with the provided test scripts
4. Verify your environment configuration

## 📝 License

This configuration is part of the AltaMedia application and follows the same license terms. 