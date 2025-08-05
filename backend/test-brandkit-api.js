const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/brandkit';

// Test data for BrandKit form
const testFormData = {
  building_type: 'business',
  business_email: 'test@example.com',
  has_proventous_id: 'no',
  business_name: 'Test Business',
  contact_number: '+1234567890',
  preferred_contact: 'email',
  industry: ['Technology', 'Consulting'],
  year_started: 2020,
  primary_location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
  behind_brand: 'We are a team of passionate innovators',
  current_customers: ['Male', 'Female'],
  want_to_attract: 'Tech-savvy professionals aged 25-45',
  team_description: 'Our team is collaborative and innovative',
  desired_emotion: 'inspired',
  target_professions: ['Entrepreneurs', 'Managers'],
  reach_locations: ['Social Media', 'LinkedIn'],
  age_groups: ['Young Adults', 'Adults'],
  spending_habits: ['Premium', 'Value-focused'],
  interaction_methods: ['Online', 'Email'],
  customer_challenges: 'Complex technical problems',
  culture_words: ['Innovative', 'Collaborative', 'Professional'],
  team_traditions: 'Weekly team lunches',
  team_highlights: 'Monthly innovation challenges',
  reason1: 'We solve real problems',
  reason2: 'We care about our customers',
  reason3: 'We innovate constantly',
  brand_soul: 'Empowering innovation',
  brand_tone: ['Professional', 'Friendly'],
  brand1: 'Apple',
  brand2: 'Google',
  brand3: 'Tesla',
  brand_avoid: 'Generic corporate brands',
  mission_statement: 'To empower businesses through innovative solutions',
  long_term_vision: 'To be the leading technology partner for businesses worldwide',
  core_values: ['Innovation', 'Integrity', 'Excellence'],
  brand_personality: ['Professional', 'Innovative', 'Reliable'],
  has_logo: 'yes',
  logo_action: ['Keep', 'Improve'],
  preferred_colors: ['#007ACC', '#FF6B35'],
  colors_to_avoid: ['#FF0000', '#000000'],
  font_styles: ['Sans-serif', 'Modern'],
  design_style: ['Clean', 'Minimal'],
  logo_type: ['Wordmark', 'Symbol'],
  imagery_style: ['Photography', 'Digital'],
  brand_kit_use: ['Website', 'Social Media'],
  brand_elements: ['Logo', 'Color Palette'],
  file_formats: ['PNG', 'SVG'],
  primary_goal: 'Increase brand recognition by 50%',
  short_term_goals: 'Launch new website within 3 months',
  mid_term_goals: 'Expand to 3 new markets',
  long_term_goal: 'Become industry leader',
  big_picture_vision: 'Transform how businesses approach technology',
  success_metrics: ['Brand Recognition', 'Revenue Growth'],
  business_description: 'We provide innovative technology solutions',
  inspiration: 'Modern tech companies that prioritize user experience',
  target_interests: ['Technology', 'Innovation'],
  current_interests: ['AI', 'Machine Learning'],
  special_notes: 'Focus on modern, clean design',
  timeline: '3-4-weeks',
  approver: 'John Doe',
  reference_materials: 'https://example.com/references'
};

async function testBrandKitAPI() {
  console.log('🧪 Testing BrandKit API endpoints...\n');

  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server health...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Server is running:', healthResponse.data.message);
    console.log('');

    // Test 2: Test BrandKit routes
    console.log('2️⃣ Testing BrandKit routes...');
    const testResponse = await axios.get(`${BASE_URL}/test`);
    console.log('✅ BrandKit routes are working:', testResponse.data.message);
    console.log('');

    // Test 3: Save form data
    console.log('3️⃣ Testing PUT /api/brandkit/save...');
    const saveResponse = await axios.put(`${BASE_URL}/save`, {
      userId: 1,
      stepData: testFormData,
      currentStep: 1
    });
    console.log('✅ Form data saved successfully:', saveResponse.data.message);
    console.log('📊 Progress:', saveResponse.data.data.progressPercentage + '%');
    console.log('');

    // Test 4: Get form data
    console.log('4️⃣ Testing GET /api/brandkit/data/:userId...');
    const getResponse = await axios.get(`${BASE_URL}/data/1`);
    console.log('✅ Form data retrieved successfully:', getResponse.data.message);
    console.log('📊 Current step:', getResponse.data.data.currentStep);
    console.log('📊 Progress:', getResponse.data.data.progressPercentage + '%');
    console.log('');

    console.log('🎉 All BrandKit API tests passed!');
    console.log('');
    console.log('📋 Available endpoints:');
    console.log('   PUT  /api/brandkit/save - Save form data (Next button)');
    console.log('   GET  /api/brandkit/data/:userId - Get form data (Back button)');
    console.log('   GET  /api/brandkit/test - Test endpoint');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📊 Data:', error.response.data);
    }
    
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure the backend server is running: npm run dev');
    console.log('   2. Check if port 3000 is available');
    console.log('   3. Verify environment variables are set');
    console.log('   4. Check database connection');
  }
}

// Run the test
testBrandKitAPI(); 