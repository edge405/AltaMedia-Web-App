const axios = require('axios');

// Test URLs to check
const TEST_URLS = [
  'https://builderapi.altamedia.ai',
  'https://builderapi.altamedia.ai/health',
  'https://builderapi.altamedia.ai/api/ai-suggestions',
  'https://builder.altamedia.ai/api/ai-suggestions', // In case backend is on same domain
  'https://builder.altamedia.ai/health'
];

async function testEndpoint(url, description) {
  try {
    console.log(`\n🔍 Testing: ${description}`);
    console.log(`URL: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      validateStatus: () => true // Don't throw on non-2xx status
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📄 Headers:`, {
      'content-type': response.headers['content-type'],
      'server': response.headers['server'],
      'cors': response.headers['access-control-allow-origin']
    });
    
    if (response.data) {
      console.log(`📦 Response:`, JSON.stringify(response.data, null, 2));
    }
    
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    if (error.code) {
      console.log(`   Code: ${error.code}`);
    }
    return { success: false, error: error.message };
  }
}

async function testAISuggestions() {
  console.log('\n🤖 Testing AI Suggestions specifically...');
  
  const testData = {
    brandName: 'Water Bottle',
    industry: 'Beverage'
  };
  
  const urls = [
    'https://builderapi.altamedia.ai/api/ai-suggestions',
    'https://builder.altamedia.ai/api/ai-suggestions'
  ];
  
  for (const baseUrl of urls) {
    try {
      const params = new URLSearchParams({
        fieldName: 'problemSolved',
        formData: JSON.stringify(testData)
      });
      
      const url = `${baseUrl}?${params}`;
      console.log(`\n🔍 Testing AI Suggestions: ${url}`);
      
      const response = await axios.get(url, {
        timeout: 10000,
        validateStatus: () => true
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📦 Response:`, JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

async function runDebugTests() {
  console.log('🚀 AltaMedia Backend Deployment Debug');
  console.log('=====================================');
  
  // Test basic connectivity
  for (const url of TEST_URLS) {
    const description = url.includes('health') ? 'Health Check' : 'Basic Connectivity';
    await testEndpoint(url, description);
  }
  
  // Test AI suggestions specifically
  await testAISuggestions();
  
  console.log('\n📊 Debug Summary');
  console.log('================');
  console.log('If you see 404 errors, the backend might not be deployed correctly.');
  console.log('If you see connection refused, check if the domain is pointing to the right server.');
  console.log('If you see CORS errors, check the backend CORS configuration.');
}

// Run the tests
runDebugTests().catch(console.error);
