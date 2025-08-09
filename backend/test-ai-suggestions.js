const axios = require('axios');

// Test the simplified AI suggestions API
async function testAISuggestions() {
  try {
    console.log('🧪 Testing Simplified AI Suggestions API...');
    
    // You'll need to get a valid JWT token from your auth system
    const token = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token
    
    const testData = {
      fieldName: 'businessDescription',
      formData: JSON.stringify({
        businessName: 'Test Coffee Shop',
        industry: 'Food & Beverage',
        targetMarket: 'Young professionals',
        yearStarted: '2023'
      })
    };

    const params = new URLSearchParams(testData);
    
    const response = await axios.get(`http://localhost:3000/api/ai-suggestions?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ AI Suggestions API Response:', response.data);
    
  } catch (error) {
    console.error('❌ AI Suggestions API Error:', error.response?.data || error.message);
  }
}

// Run the test
testAISuggestions();
