const axios = require('axios');

async function testAISuggestionsWithAuth() {
  console.log('🤖 Testing AI Suggestions with Authentication');
  console.log('=============================================');
  
  const baseUrl = 'https://builder.altamedia.ai';
  
  try {
    // Step 1: Login to get a token
    console.log('\n1️⃣ Logging in to get authentication token...');
    
    const loginResponse = await axios.post(`${baseUrl}/api/auth/login`, {
      email: 'your-email@example.com', // Replace with your actual email
      password: 'your-password'        // Replace with your actual password
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: () => true
    });
    
    if (loginResponse.status !== 200) {
      console.log(`❌ Login failed: ${loginResponse.status}`);
      console.log('Response:', loginResponse.data);
      return;
    }
    
    const token = loginResponse.data.token || loginResponse.data.accessToken;
    console.log('✅ Login successful, token obtained');
    
    // Step 2: Test AI suggestions with the token
    console.log('\n2️⃣ Testing AI suggestions with authentication...');
    
    const testData = {
      brandName: 'Water Bottle',
      industry: 'Beverage',
      targetAudience: 'Health-conscious consumers'
    };
    
    const params = new URLSearchParams({
      fieldName: 'problemSolved',
      formData: JSON.stringify(testData)
    });
    
    const aiResponse = await axios.get(`${baseUrl}/api/ai-suggestions?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      validateStatus: () => true
    });
    
    console.log(`Status: ${aiResponse.status}`);
    
    if (aiResponse.status === 200) {
      console.log('✅ AI suggestions working!');
      console.log('Response:', JSON.stringify(aiResponse.data, null, 2));
    } else {
      console.log('❌ AI suggestions failed');
      console.log('Response:', JSON.stringify(aiResponse.data, null, 2));
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

// Instructions for manual testing
console.log('📋 Manual Testing Instructions:');
console.log('==============================');
console.log('1. Replace "your-email@example.com" and "your-password" with your actual credentials');
console.log('2. Run: node test-ai-suggestions.js');
console.log('');
console.log('Or test manually in Postman:');
console.log('1. POST https://builder.altamedia.ai/api/auth/login');
console.log('2. Copy the token from the response');
console.log('3. GET https://builder.altamedia.ai/api/ai-suggestions?fieldName=problemSolved&formData={"brandName":"Water Bottle"}');
console.log('4. Add Authorization header: Bearer YOUR_TOKEN');
console.log('');

// Run the test if credentials are provided
if (process.argv.includes('--test')) {
  testAISuggestionsWithAuth();
}
