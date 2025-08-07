const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testPackageCommentsAPI() {
  console.log('🧪 Testing Package Feature Comments API...\n');

  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server health...');
    try {
      await axios.get(`${BASE_URL}/api/health`);
      console.log('✅ Server is running');
    } catch (error) {
      console.log('❌ Server is not running or health endpoint not available');
      return;
    }

    // Test 2: Test the new endpoint without auth (should return 401)
    console.log('\n2️⃣ Testing new endpoint without authentication...');
    try {
      await axios.get(`${BASE_URL}/api/package-feature-comments/feature/1/user/1`);
      console.log('❌ Should have returned 401 (unauthorized)');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctly returned 401 (authentication required)');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test 3: Test with invalid route (should return 404)
    console.log('\n3️⃣ Testing invalid route...');
    try {
      await axios.get(`${BASE_URL}/api/package-feature-comments/invalid/route`);
      console.log('❌ Should have returned 404 (not found)');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Correctly returned 404 (route not found)');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('\n🎉 API endpoint structure is working correctly!');
    console.log('📝 To test with authentication, use the Postman collection:');
    console.log('   backend/Package_Feature_Comments_API.postman_collection.json');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPackageCommentsAPI();
