const { executeQuery } = require('./src/config/mysql');

const createEmailVerificationTable = async () => {
  try {
    console.log('🔄 Creating email_verifications table...');
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS email_verifications (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        email varchar(255) NOT NULL,
        verification_code varchar(6) NOT NULL,
        verification_token varchar(64) NOT NULL,
        is_verified tinyint(1) DEFAULT 0,
        expires_at timestamp NOT NULL,
        verified_at timestamp NULL DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (id),
        UNIQUE KEY email (email),
        KEY verification_token (verification_token),
        KEY expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `;
    
    await executeQuery(createTableQuery);
    console.log('✅ email_verifications table created successfully!');
    
    // Test the table by inserting a sample record
    console.log('🔄 Testing table functionality...');
    const testEmail = 'test@example.com';
    const testCode = '123456';
    const testToken = 'test-token-' + Date.now();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    await executeQuery(
      'INSERT INTO email_verifications (email, verification_code, verification_token, expires_at) VALUES (?, ?, ?, ?)',
      [testEmail, testCode, testToken, expiresAt]
    );
    
    // Verify the record was inserted
    const result = await executeQuery(
      'SELECT * FROM email_verifications WHERE email = ?',
      [testEmail]
    );
    
    if (result.length > 0) {
      console.log('✅ Table test successful! Sample record inserted and retrieved.');
      
      // Clean up test record
      await executeQuery('DELETE FROM email_verifications WHERE email = ?', [testEmail]);
      console.log('✅ Test record cleaned up.');
    }
    
    console.log('🎉 Email verification system is ready to use!');
    
  } catch (error) {
    console.error('❌ Error creating email_verifications table:', error);
    process.exit(1);
  }
};

// Run the script
createEmailVerificationTable();
