const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test function
async function testAPI() {
  console.log('🧪 Testing AltaMedia API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Get Packages (Public)
    console.log('2. Testing Get Packages...');
    const packagesResponse = await axios.get(`${BASE_URL}/packages`);
    console.log('✅ Get Packages:', packagesResponse.data);
    console.log('');

    // Test 3: Register User
    console.log('3. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'test@example.com',
      password: 'password123',
      fullname: 'John Doe',
      phone_number: '+1234567890',
      address: '123 Main St, City, State 12345'
    });
    console.log('✅ Registration:', registerResponse.data);
    console.log('');

    // Test 4: Login
    console.log('4. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login:', loginResponse.data);
    console.log('');

    // Test 5: Get Profile (with token)
    console.log('5. Testing Get Profile...');
    const token = loginResponse.data.data.token;
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Get Profile:', profileResponse.data);
    console.log('');

    // Test 6: Edit Profile (with token)
    console.log('6. Testing Edit Profile...');
    const editProfileData = {
      fullname: 'John Smith',
      phone_number: '+1987654321',
      address: '456 Oak Ave, City, State 54321'
    };
    const editProfileResponse = await axios.put(`${BASE_URL}/auth/profile`, editProfileData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Edit Profile:', editProfileResponse.data);
    console.log('');

    // Test 7: Get Addons (Public)
    console.log('7. Testing Get Addons...');
    const addonsResponse = await axios.get(`${BASE_URL}/addons`);
    console.log('✅ Get Addons:', addonsResponse.data);
    console.log('');

    // Test 8: Create Brand Kit Form
    console.log('8. Testing Brand Kit Form Creation...');
    const brandKitData = {
      business_type: "SaaS",
      business_email: "contact@example.com",
      business_name: "Test Corp",
      phone_number: "+1234567890",
      preferred_contact_method: "email",
      industry: ["Technology", "SaaS"],
      year_started: 2020,
      main_location: "San Francisco, CA",
      mission_statement: "To revolutionize the industry",
      vision_statement: "Leading the future of technology",
      core_values: ["Innovation", "Quality", "Customer Focus"],
      business_stage: "growth",
      brand_description: "A modern tech company focused on innovation",
      target_audience: "Tech-savvy professionals",
      spending_type: "premium",
      desired_feeling: "Professional and trustworthy",
      audience_interests: ["Technology", "Innovation"],
      professions: ["Developers", "Managers"],
      preferred_platforms: ["LinkedIn", "Twitter"],
      age_groups: ["25-34", "35-44"],
      current_audience_interests: ["Tech news", "Productivity"],
      spending_habits: ["Premium products", "Quality over price"],
      audience_behaviors: ["Research-driven", "Early adopters"],
      interaction_modes: ["Digital", "Social media"],
      customer_pain_points: "Complex onboarding process",
      purchase_motivators: "Time savings and efficiency",
      emotional_goal: "Confidence and trust",
      brand_owner: "John Doe",
      why_started: "To solve a market gap",
      reasons_exist1: "Innovation in the industry",
      reasons_exist2: "Customer satisfaction",
      reasons_exist3: "Market leadership",
      brand_soul: "Innovation meets reliability",
      brand_personality: ["Professional", "Innovative", "Friendly"],
      brand_voice: ["Clear", "Confident", "Approachable"],
      admire_brand1: "Apple",
      admire_brand2: "Tesla",
      admire_brand3: "Stripe",
      styles_to_avoid: "Overly casual or unprofessional",
      existing_logo: "Basic text logo",
      logo_action: ["Redesign", "Modernize"],
      brand_colors: ["Blue", "White", "Gray"],
      colors_to_avoid: ["Bright pink", "Neon green"],
      font_preferences: ["Sans-serif", "Clean"],
      design_style: ["Minimalist", "Modern"],
      logo_style: ["Wordmark", "Simple"],
      imagery_style: ["Professional", "Clean"],
      design_inspiration: "Apple's minimalist approach",
      usage_channels: ["Website", "Social media", "Print"],
      brand_elements_needed: ["Logo", "Business cards", "Website"],
      file_formats_needed: ["SVG", "PNG", "PDF"],
      goal_this_year: "Increase market share by 50%",
      other_short_term_goals: "Launch new product line",
      three_to_five_year_vision: "Become industry leader",
      additional_mid_term_goals: "Expand to international markets",
      long_term_vision: "Global technology leader",
      key_metrics: ["Revenue growth", "Customer satisfaction"],
      company_culture: ["Innovation", "Collaboration", "Excellence"],
      culture_description: "Fast-paced, innovative environment",
      internal_rituals: "Weekly team meetings",
      additional_notes: "Focus on premium positioning",
      timeline: "3 months for complete brand kit",
      decision_makers: "CEO and Marketing Director",
      reference_materials: "Competitor analysis and market research"
    };

    const brandKitResponse = await axios.post(`${BASE_URL}/brandkit`, brandKitData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Brand Kit Form Creation:', brandKitResponse.data);
    console.log('');

    // Test 9: Get Brand Kit Form
    console.log('9. Testing Get Brand Kit Form...');
    const getBrandKitResponse = await axios.get(`${BASE_URL}/brandkit`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Get Brand Kit Form:', getBrandKitResponse.data);
    console.log('');

    // Test 10: Update Brand Kit Form Progress
    console.log('10. Testing Update Brand Kit Form Progress...');
    const progressData = {
      current_step: 2,
      progress_percentage: 16.67,
      is_completed: false
    };
    const progressResponse = await axios.put(`${BASE_URL}/brandkit`, progressData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Update Brand Kit Form Progress:', progressResponse.data);
    console.log('');

    // Test 11: Edit Password
    console.log('11. Testing Edit Password...');
    const passwordData = {
      currentPassword: 'password123',
      newPassword: 'newpassword123'
    };
    const passwordResponse = await axios.put(`${BASE_URL}/auth/password`, passwordData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Edit Password:', passwordResponse.data);
    console.log('');

    // Test 12: Get User Addons
    console.log('12. Testing Get User Addons...');
    const userAddonsResponse = await axios.get(`${BASE_URL}/addons/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Get User Addons:', userAddonsResponse.data);
    console.log('');

    // Test 13: Get User Purchases
    console.log('13. Testing Get User Purchases...');
    const userPurchasesResponse = await axios.get(`${BASE_URL}/purchases`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Get User Purchases:', userPurchasesResponse.data);
    console.log('');

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testAPI(); 