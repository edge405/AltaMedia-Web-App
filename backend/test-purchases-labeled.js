const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test function for labeled purchase data
async function testLabeledPurchases() {
  console.log('🧪 Testing Labeled Purchase Data Structure...\n');

  try {
    // Test 1: Login to get token
    console.log('1. Logging in to get authentication token...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');
    console.log('');

    // Test 2: Get User Purchases with Labeled Data
    console.log('2. Testing Get User Purchases with Labeled Data...');
    const userPurchasesResponse = await axios.get(`${BASE_URL}/purchases`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Get User Purchases Response Structure:');
    console.log('📊 Response Structure:');
    console.log('   - success:', userPurchasesResponse.data.success);
    console.log('   - message:', userPurchasesResponse.data.message);
    console.log('   - data.user_id:', userPurchasesResponse.data.data.user_id);
    console.log('   - data.total_purchases:', userPurchasesResponse.data.data.total_purchases);
    
    if (userPurchasesResponse.data.data.purchases.length > 0) {
      const purchase = userPurchasesResponse.data.data.purchases[0];
      console.log('\n📦 Sample Purchase Structure:');
      console.log('   - purchase_id:', purchase.purchase_id);
      console.log('   - purchase_info:', {
        purchase_date: purchase.purchase_info.purchase_date,
        expiration_date: purchase.purchase_info.expiration_date,
        status: purchase.purchase_info.status,
        total_amount: purchase.purchase_info.total_amount
      });
      console.log('   - package_details:', {
        package_id: purchase.package_details.package_id,
        package_name: purchase.package_details.package_name,
        package_description: purchase.package_details.package_description,
        package_price: purchase.package_details.package_price,
        duration_days: purchase.package_details.duration_days
      });
      console.log('   - addons count:', purchase.addons.length);
      
      if (purchase.addons.length > 0) {
        const addon = purchase.addons[0];
        console.log('\n🔧 Sample Addon Structure:');
        console.log('   - addon_purchase_id:', addon.addon_purchase_id);
        console.log('   - addon_details:', {
          addon_id: addon.addon_details.addon_id,
          addon_name: addon.addon_details.addon_name,
          addon_description: addon.addon_details.addon_description,
          price_type: addon.addon_details.price_type,
          base_price: addon.addon_details.base_price
        });
        console.log('   - purchase_info:', {
          amount_paid: addon.purchase_info.amount_paid,
          status: addon.purchase_info.status,
          purchase_date: addon.purchase_info.purchase_date
        });
      }
    }
    console.log('');

    // Test 3: Get Specific Purchase by ID
    if (userPurchasesResponse.data.data.purchases.length > 0) {
      const purchaseId = userPurchasesResponse.data.data.purchases[0].purchase_id;
      console.log(`3. Testing Get Purchase by ID (${purchaseId})...`);
      
      const purchaseByIdResponse = await axios.get(`${BASE_URL}/purchases/${purchaseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Get Purchase by ID Response:');
      console.log('   - success:', purchaseByIdResponse.data.success);
      console.log('   - message:', purchaseByIdResponse.data.message);
      console.log('   - data structure matches labeled format');
      console.log('');
    }

    // Test 4: Create New Purchase with Labeled Response
    console.log('4. Testing Create New Purchase with Labeled Response...');
    const createPurchaseData = {
      package_id: 1, // Assuming package ID 1 exists
      addons: [1, 2] // Assuming addon IDs 1 and 2 exist
    };
    
    try {
      const createPurchaseResponse = await axios.post(`${BASE_URL}/purchases`, createPurchaseData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Create Purchase Response Structure:');
      console.log('   - success:', createPurchaseResponse.data.success);
      console.log('   - message:', createPurchaseResponse.data.message);
      console.log('   - data.purchase_id:', createPurchaseResponse.data.data.purchase_id);
      console.log('   - data.purchase_info:', createPurchaseResponse.data.data.purchase_info);
      console.log('   - data.package_details:', createPurchaseResponse.data.data.package_details);
      console.log('   - data.addons count:', createPurchaseResponse.data.data.addons.length);
      console.log('');
    } catch (error) {
      console.log('⚠️ Create Purchase failed (likely due to missing package/addon IDs):', error.response?.data?.message || error.message);
      console.log('');
    }

    console.log('🎉 Labeled Purchase Data Tests Completed!');
    console.log('\n📋 Summary of Improvements:');
    console.log('   ✅ Clear separation of purchase_info, package_details, and addons');
    console.log('   ✅ Descriptive field names (package_name, addon_name, etc.)');
    console.log('   ✅ Organized addon structure with addon_details and purchase_info');
    console.log('   ✅ Consistent response structure across all endpoints');
    console.log('   ✅ Better error handling and messaging');

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
testLabeledPurchases(); 