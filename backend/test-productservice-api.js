const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test data
const testData = {
  userId: 1,
  currentStep: 1,
  stepData: {
    building_type: 'product',
    product_name: 'Test Product',
    product_description: 'A test product description',
    industry: ['Technology', 'SaaS'],
    want_to_attract: 'Test target audience',
    mission_story: 'Test mission story',
    desired_emotion: 'inspired',
    brand_tone: 'friendly'
  }
};

async function testProductServiceAPI() {
  console.log('🧪 Testing ProductService API...\n');

  try {
    // Test 1: Save form data
    console.log('📝 Testing saveFormData...');
    const saveResponse = await axios.put(`${API_BASE_URL}/productservice/save`, testData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TEST_TOKEN_HERE' // Replace with actual token
      }
    });
    
    console.log('✅ Save response:', saveResponse.data);

    // Test 2: Get form data
    console.log('\n📥 Testing getFormData...');
    const getResponse = await axios.get(`${API_BASE_URL}/productservice/data/1`, {
      headers: {
        'Authorization': 'Bearer YOUR_TEST_TOKEN_HERE' // Replace with actual token
      }
    });
    
    console.log('✅ Get response:', getResponse.data);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testProductServiceAPI();
