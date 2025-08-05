// Test file for Brand Kit Form Routes
// This demonstrates how to use the PUT and GET routes for form progress

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
const AUTH_TOKEN = 'your-auth-token-here'; // Replace with actual token

// Example form data for different steps
const step1Data = {
  what_building: 'Business/Company',
  current_step: 1,
  progress_percentage: 8.33,
  is_completed: false,
  form_data: {
    what_building: 'Business/Company'
  }
};

const step2Data = {
  business_email: 'test@example.com',
  has_proventous_id: 'No',
  full_business_name: 'Test Business Inc.',
  current_step: 2,
  progress_percentage: 16.67,
  is_completed: false,
  form_data: {
    what_building: 'Business/Company',
    business_email: 'test@example.com',
    has_proventous_id: 'No',
    full_business_name: 'Test Business Inc.'
  }
};

const step3Data = {
  contact_number: '+1234567890',
  preferred_communication: 'email',
  industry_niche: ['Technology', 'SaaS'],
  year_started: 2023,
  primary_location: 'New York, NY',
  current_step: 3,
  progress_percentage: 25.00,
  is_completed: false,
  form_data: {
    what_building: 'Business/Company',
    business_email: 'test@example.com',
    has_proventous_id: 'No',
    full_business_name: 'Test Business Inc.',
    contact_number: '+1234567890',
    preferred_communication: 'email',
    industry_niche: ['Technology', 'SaaS'],
    year_started: 2023,
    primary_location: 'New York, NY'
  }
};

// Test PUT route - Update form progress
async function testUpdateFormProgress() {
  try {
    console.log('🔄 Testing PUT /api/brandkit/progress - Update form progress');
    
    const response = await axios.put(`${BASE_URL}/brandkit/progress`, step1Data, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ PUT Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ PUT Error:', error.response?.data || error.message);
  }
}

// Test GET route - Retrieve form data
async function testGetFormProgress() {
  try {
    console.log('📥 Testing GET /api/brandkit/progress - Get form data');
    
    const response = await axios.get(`${BASE_URL}/brandkit/progress`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ GET Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ GET Error:', error.response?.data || error.message);
  }
}

// Test complete form submission
async function testCompleteForm() {
  try {
    console.log('📝 Testing POST /api/brandkit - Complete form submission');
    
    const completeFormData = {
      what_building: 'Business/Company',
      business_email: 'test@example.com',
      has_proventous_id: 'No',
      full_business_name: 'Test Business Inc.',
      contact_number: '+1234567890',
      preferred_communication: 'email',
      industry_niche: ['Technology', 'SaaS'],
      year_started: 2023,
      primary_location: 'New York, NY',
      // Add all other form fields here...
      current_step: 12,
      progress_percentage: 100.00,
      is_completed: true
    };

    const response = await axios.post(`${BASE_URL}/brandkit`, completeFormData, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ POST Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ POST Error:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Starting Brand Kit Form Route Tests\n');
  
  // Test step-by-step updates
  await testUpdateFormProgress();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testGetFormProgress();
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test complete form
  await testCompleteForm();
  
  console.log('\n🏁 Tests completed!');
}

// Export for use in other files
module.exports = {
  testUpdateFormProgress,
  testGetFormProgress,
  testCompleteForm,
  runTests
};

// Run if this file is executed directly
if (require.main === module) {
  runTests();
} 