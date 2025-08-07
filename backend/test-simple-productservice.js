const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testSimpleProductService() {
  console.log('🧪 Testing ProductService API endpoints...\n');

  try {
    // Test 1: Check if server is running
    console.log('🔍 Testing server health...');
    const healthResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Server health:', healthResponse.data);

    // Test 2: Try to access ProductService endpoint (should fail with auth error)
    console.log('\n🔍 Testing ProductService endpoint accessibility...');
    try {
      const response = await axios.get(`${API_BASE_URL}/productservice/data/1`);
      console.log('❌ Unexpected success (should require auth):', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly requires authentication (401 Unauthorized)');
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
      }
    }

    // Test 3: Check if route is registered
    console.log('\n🔍 Testing route registration...');
    try {
      const response = await axios.get(`${API_BASE_URL}/productservice/test`);
      console.log('❌ Unexpected success (should be 404):', response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Route correctly returns 404 for non-existent endpoint');
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Server is not running. Please start the backend server first.');
    }
  }
}

// Run the test
testSimpleProductService();
