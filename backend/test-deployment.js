const axios = require('axios');

// Test deployment endpoints
const BASE_URL = 'https://builderapi.altamedia.ai';

const testEndpoints = async () => {
  console.log('🧪 Testing AltaMedia Backend Deployment');
  console.log('=====================================');
  
  const endpoints = [
    { name: 'Health Check', path: '/health' },
    { name: 'Auth Endpoint', path: '/api/auth/login' },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing ${endpoint.name}...`);
      const response = await axios.get(`${BASE_URL}${endpoint.path}`, {
        timeout: 10000,
        validateStatus: () => true // Don't throw on non-2xx status
      });
      
      if (response.status === 200) {
        console.log(`✅ ${endpoint.name}: OK (${response.status})`);
      } else if (response.status === 404) {
        console.log(`⚠️  ${endpoint.name}: Not Found (${response.status}) - This might be expected for some endpoints`);
      } else if (response.status === 401) {
        console.log(`🔒 ${endpoint.name}: Unauthorized (${response.status}) - Authentication required`);
      } else {
        console.log(`❌ ${endpoint.name}: Error (${response.status})`);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${endpoint.name}: Connection refused - Server might not be running`);
      } else if (error.code === 'ENOTFOUND') {
        console.log(`❌ ${endpoint.name}: Domain not found - Check DNS configuration`);
      } else {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    }
  }

  console.log('\n📊 Deployment Test Summary');
  console.log('========================');
  console.log('✅ If health check passes, your backend is running');
  console.log('🔒 401 errors are normal for protected endpoints');
  console.log('⚠️  404 errors might be expected for some endpoints');
  console.log('❌ Connection errors indicate deployment issues');
};

// Test CORS configuration
const testCORS = async () => {
  console.log('\n🌐 Testing CORS Configuration...');
  try {
    const response = await axios.options(`${BASE_URL}/health`, {
      headers: {
        'Origin': 'https://builder.altamedia.ai',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    const corsHeaders = response.headers;
    console.log('✅ CORS headers found:');
    console.log(`   Access-Control-Allow-Origin: ${corsHeaders['access-control-allow-origin']}`);
    console.log(`   Access-Control-Allow-Methods: ${corsHeaders['access-control-allow-methods']}`);
    console.log(`   Access-Control-Allow-Headers: ${corsHeaders['access-control-allow-headers']}`);
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
};

// Run tests
const runTests = async () => {
  await testEndpoints();
  await testCORS();
  
  console.log('\n🎉 Test completed!');
  console.log('Check the results above to verify your deployment.');
};

runTests().catch(console.error);
