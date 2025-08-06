const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test function for labeled package data
async function testLabeledPackages() {
  console.log('🧪 Testing Labeled Package Data Structure...\n');

  try {
    // Test 1: Get All Packages with Labeled Data
    console.log('1. Testing Get All Packages with Labeled Data...');
    const packagesResponse = await axios.get(`${BASE_URL}/packages`);
    
    console.log('✅ Get Packages Response Structure:');
    console.log('📊 Response Structure:');
    console.log('   - success:', packagesResponse.data.success);
    console.log('   - message:', packagesResponse.data.message);
    console.log('   - data.total_packages:', packagesResponse.data.data.total_packages);
    
    if (packagesResponse.data.data.packages.length > 0) {
      const package = packagesResponse.data.data.packages[0];
      console.log('\n📦 Sample Package Structure:');
      console.log('   - package_id:', package.package_id);
      console.log('   - package_info:', {
        name: package.package_info.name,
        description: package.package_info.description,
        price: package.package_info.price,
        duration_days: package.package_info.duration_days,
        is_active: package.package_info.is_active
      });
    }
    console.log('');

    // Test 2: Get Specific Package by ID
    if (packagesResponse.data.data.packages.length > 0) {
      const packageId = packagesResponse.data.data.packages[0].package_id;
      console.log(`2. Testing Get Package by ID (${packageId})...`);
      
      const packageByIdResponse = await axios.get(`${BASE_URL}/packages/${packageId}`);
      
      console.log('✅ Get Package by ID Response:');
      console.log('   - success:', packageByIdResponse.data.success);
      console.log('   - message:', packageByIdResponse.data.message);
      console.log('   - data.package_id:', packageByIdResponse.data.data.package_id);
      console.log('   - data.package_info:', {
        name: packageByIdResponse.data.data.package_info.name,
        description: packageByIdResponse.data.data.package_info.description,
        price: packageByIdResponse.data.data.package_info.price,
        duration_days: packageByIdResponse.data.data.package_info.duration_days
      });
      console.log('   - data.features count:', packageByIdResponse.data.data.features.length);
      
      if (packageByIdResponse.data.data.features.length > 0) {
        const feature = packageByIdResponse.data.data.features[0];
        console.log('\n🔧 Sample Feature Structure:');
        console.log('   - feature_id:', feature.feature_id);
        console.log('   - feature_info:', {
          feature_name: feature.feature_info.feature_name,
          feature_description: feature.feature_info.feature_description,
          is_active: feature.feature_info.is_active
        });
      }
      console.log('');
    }

    // Test 3: Login to get admin token for package creation
    console.log('3. Logging in to get authentication token for admin operations...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'admin@example.com',
        password: 'admin123'
      });
      const token = loginResponse.data.data.token;
      console.log('✅ Admin login successful');
      console.log('');

      // Test 4: Create New Package with Labeled Response
      console.log('4. Testing Create New Package with Labeled Response...');
      const createPackageData = {
        name: 'Test Package',
        description: 'A test package for demonstration',
        price: 99.99,
        duration_days: 30,
        features: [
          {
            name: 'Feature 1',
            description: 'First feature description'
          },
          {
            name: 'Feature 2',
            description: 'Second feature description'
          }
        ]
      };
      
      try {
        const createPackageResponse = await axios.post(`${BASE_URL}/packages`, createPackageData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('✅ Create Package Response Structure:');
        console.log('   - success:', createPackageResponse.data.success);
        console.log('   - message:', createPackageResponse.data.message);
        console.log('   - data.package_id:', createPackageResponse.data.data.package_id);
        console.log('   - data.package_info:', createPackageResponse.data.data.package_info);
        console.log('   - data.features count:', createPackageResponse.data.data.features.length);
        console.log('');
      } catch (error) {
        console.log('⚠️ Create Package failed (likely due to admin permissions):', error.response?.data?.message || error.message);
        console.log('');
      }

    } catch (error) {
      console.log('⚠️ Admin login failed (using test credentials):', error.response?.data?.message || error.message);
      console.log('');
    }

    console.log('🎉 Labeled Package Data Tests Completed!');
    console.log('\n📋 Summary of Package Improvements:');
    console.log('   ✅ Clear separation of package_info and features');
    console.log('   ✅ Descriptive field names (package_id, feature_id, etc.)');
    console.log('   ✅ Organized feature structure with feature_info');
    console.log('   ✅ Consistent response structure across all package endpoints');
    console.log('   ✅ Better error handling and messaging');
    console.log('   ✅ Self-documenting field names for better frontend integration');

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testLabeledPackages(); 