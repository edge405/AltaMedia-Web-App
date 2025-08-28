const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_USER_ID = 1; // Use a test user ID

// Test data for BrandKit Questionnaire
const testFormData = {
  brandName: 'Test Brand',
  brandDescription: 'A test brand for API testing',
  primaryCustomers: 'Test customers aged 25-35',
  desiredEmotion: 'inspired',
  unfairAdvantage: 'Our unique testing approach',
  customerMiss: 'They would miss our testing capabilities',
  problemSolved: 'We solve testing problems',
  competitors: ['Competitor A', 'Competitor B'],
  competitorLikes: 'Their user interface',
  competitorDislikes: 'Their slow response time',
  brandDifferentiation: 'We are faster and more reliable',
  brandKitUse: ['Website', 'Social Media'],
  templates: ['Social Posts', 'Business Cards'],
  internalAssets: ['Recruitment Materials'],
  fileFormats: ['PNG', 'PDF'],
  culturalAdaptation: 'yes',
  brandVoice: ['Professional', 'Friendly'],
  admiredBrands: 'Apple, Google',
  inspirationBrand: 'Apple',
  communicationPerception: ['Authoritative', 'Approachable'],
  brandLogo: 'test-logo.png',
  logoRedesign: 'maybe',
  hasExistingColors: 'yes',
  existingColors: ['#FF0000', '#00FF00'],
  preferredColors: ['#0000FF'],
  colorsToAvoid: ['#FFFF00'],
  imageryStyle: ['Minimalist', 'Professional'],
  fontTypes: ['Sans-serif'],
  fontStyles: ['Modern'],
  legalConsiderations: 'Must comply with testing standards',
  sourceFiles: ['AI', 'PDF'],
  requiredFormats: ['PNG', 'SVG'],
  referenceMaterials: 'test-reference.pdf',
  inspirationBrands: 'Apple, Nike',
  brandVibe: ['Professional', 'Innovative'],
  brandWords: ['Reliable', 'Fast', 'Professional'],
  brandAvoidWords: ['Slow', 'Unreliable', 'Outdated'],
  tagline: 'Testing Excellence',
  mission: 'To provide the best testing solutions',
  vision: 'To be the leading testing platform',
  coreValues: ['Quality', 'Innovation', 'Reliability'],
  hasWebPage: 'yes',
  webPageUpload: 'test-webpage.html',
  wantWebPage: 'web-page'
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // Replace with actual token for testing
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${url}:`, error.response?.data || error.message);
    return null;
  }
};

// Test functions
const testEndpoints = async () => {
  console.log('🧪 Starting BrandKit Questionnaire API Tests...\n');

  // Test 1: Test endpoint
  console.log('1. Testing /test endpoint...');
  const testResponse = await makeAuthenticatedRequest('GET', '/api/brandkit-questionnaire/test');
  if (testResponse?.success) {
    console.log('✅ Test endpoint working:', testResponse.message);
  } else {
    console.log('❌ Test endpoint failed');
  }

  // Test 2: Save form data
  console.log('\n2. Testing save form data...');
  const saveData = {
    userId: TEST_USER_ID,
    stepData: testFormData,
    currentStep: 3
  };
  const saveResponse = await makeAuthenticatedRequest('PUT', '/api/brandkit-questionnaire/save', saveData);
  if (saveResponse?.success) {
    console.log('✅ Form data saved successfully');
    console.log('   Current step:', saveResponse.data.currentStep);
    console.log('   Progress:', saveResponse.data.progressPercentage + '%');
    console.log('   Completed:', saveResponse.data.isCompleted);
  } else {
    console.log('❌ Failed to save form data');
  }

  // Test 3: Get form data
  console.log('\n3. Testing get form data...');
  const getResponse = await makeAuthenticatedRequest('GET', `/api/brandkit-questionnaire/data/${TEST_USER_ID}`);
  if (getResponse?.success) {
    console.log('✅ Form data retrieved successfully');
    if (getResponse.data.formData) {
      console.log('   Brand name:', getResponse.data.formData.brand_name);
      console.log('   Current step:', getResponse.data.currentStep);
      console.log('   Progress:', getResponse.data.progressPercentage + '%');
      console.log('   Completed:', getResponse.data.isCompleted);
    } else {
      console.log('   No form data found for user');
    }
  } else {
    console.log('❌ Failed to get form data');
  }

  // Test 4: Complete form
  console.log('\n4. Testing complete form...');
  const completeResponse = await makeAuthenticatedRequest('PUT', `/api/brandkit-questionnaire/complete/${TEST_USER_ID}`);
  if (completeResponse?.success) {
    console.log('✅ Form marked as completed');
    console.log('   Current step:', completeResponse.data.currentStep);
    console.log('   Progress:', completeResponse.data.progressPercentage + '%');
    console.log('   Completed:', completeResponse.data.isCompleted);
  } else {
    console.log('❌ Failed to complete form');
  }

  // Test 5: Get all forms (Admin)
  console.log('\n5. Testing get all forms (Admin)...');
  const getAllResponse = await makeAuthenticatedRequest('GET', '/api/brandkit-questionnaire/admin/all');
  if (getAllResponse?.success) {
    console.log('✅ All forms retrieved successfully');
    console.log('   Total forms:', getAllResponse.data.total_forms);
    if (getAllResponse.data.forms.length > 0) {
      console.log('   Sample form:', getAllResponse.data.forms[0].brand_name);
    }
  } else {
    console.log('❌ Failed to get all forms (may need admin token)');
  }

  console.log('\n🎉 BrandKit Questionnaire API Tests Completed!');
};

// Run tests
testEndpoints().catch(console.error);
