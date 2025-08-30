const axios = require('axios');

async function checkBackendStatus() {
  console.log('🔍 Checking AltaMedia Backend Status');
  console.log('====================================');
  
  const baseUrl = 'https://builderapi.altamedia.ai';
  
  try {
    // Test 1: Basic connectivity
    console.log('\n1️⃣ Testing basic connectivity...');
    const response = await axios.get(baseUrl, {
      timeout: 10000,
      validateStatus: () => true
    });
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Server: ${response.headers['server'] || 'Unknown'}`);
    console.log(`   Content-Type: ${response.headers['content-type'] || 'Unknown'}`);
    
    if (response.status === 200) {
      console.log('   ✅ Backend is responding');
    } else {
      console.log('   ⚠️  Backend responded but with unexpected status');
    }
    
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
    if (error.code === 'ENOTFOUND') {
      console.log('   💡 Domain not found - check DNS configuration');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('   💡 Connection refused - backend might not be running');
    }
  }
  
  try {
    // Test 2: Health endpoint
    console.log('\n2️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${baseUrl}/health`, {
      timeout: 10000,
      validateStatus: () => true
    });
    
    console.log(`   Status: ${healthResponse.status}`);
    
    if (healthResponse.status === 200) {
      const data = healthResponse.data;
      console.log(`   ✅ Health check passed`);
      console.log(`   Message: ${data.message}`);
      console.log(`   Environment: ${data.environment}`);
      console.log(`   Database: ${data.database}`);
    } else {
      console.log(`   ❌ Health check failed`);
    }
    
  } catch (error) {
    console.log(`   ❌ Health check error: ${error.message}`);
  }
  
  try {
    // Test 3: AI suggestions without auth (should return 401)
    console.log('\n3️⃣ Testing AI suggestions endpoint...');
    const aiResponse = await axios.post(`${baseUrl}/api/ai-suggestions`, {
      fieldName: 'test',
      formData: {}
    }, {
      timeout: 10000,
      validateStatus: () => true
    });
    
    console.log(`   Status: ${aiResponse.status}`);
    
    if (aiResponse.status === 401) {
      console.log('   ✅ AI suggestions endpoint is working (requires authentication)');
    } else if (aiResponse.status === 404) {
      console.log('   ❌ AI suggestions endpoint not found');
    } else {
      console.log(`   ⚠️  Unexpected response: ${aiResponse.status}`);
    }
    
  } catch (error) {
    console.log(`   ❌ AI suggestions test error: ${error.message}`);
  }
  
  console.log('\n📊 Summary:');
  console.log('===========');
  console.log('If you see 401 errors for AI suggestions, that means the endpoint is working but requires authentication.');
  console.log('If you see 404 errors, the backend might not be deployed correctly.');
  console.log('If you see connection errors, check your domain configuration.');
}

checkBackendStatus().catch(console.error);
