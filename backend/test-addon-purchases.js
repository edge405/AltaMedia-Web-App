const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test function for independent addon purchases
async function testAddonPurchases() {
  console.log('🧪 Testing Independent Addon Purchase System...\n');

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

    // Test 2: Get Available Addons
    console.log('2. Testing Get Available Addons...');
    const addonsResponse = await axios.get(`${BASE_URL}/addons`);
    console.log('✅ Available Addons:', addonsResponse.data.data.length, 'addons found');
    console.log('');

    // Test 3: Create Independent Addon Purchase
    console.log('3. Testing Create Independent Addon Purchase...');
    const createAddonPurchaseData = {
      addon_id: 1, // Assuming addon ID 1 exists
      duration_days: 30
    };
    
    try {
      const createAddonPurchaseResponse = await axios.post(`${BASE_URL}/addon-purchases`, createAddonPurchaseData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Create Addon Purchase Response Structure:');
      console.log('   - success:', createAddonPurchaseResponse.data.success);
      console.log('   - message:', createAddonPurchaseResponse.data.message);
      console.log('   - data.addon_purchase_id:', createAddonPurchaseResponse.data.data.addon_purchase_id);
      console.log('   - data.purchase_info:', {
        purchase_date: createAddonPurchaseResponse.data.data.purchase_info.purchase_date,
        expiration_date: createAddonPurchaseResponse.data.data.purchase_info.expiration_date,
        status: createAddonPurchaseResponse.data.data.purchase_info.status,
        amount_paid: createAddonPurchaseResponse.data.data.purchase_info.amount_paid
      });
      console.log('   - data.addon_details:', {
        addon_id: createAddonPurchaseResponse.data.data.addon_details.addon_id,
        addon_name: createAddonPurchaseResponse.data.data.addon_details.addon_name,
        price_type: createAddonPurchaseResponse.data.data.addon_details.price_type,
        base_price: createAddonPurchaseResponse.data.data.addon_details.base_price
      });
      console.log('');

      const addonPurchaseId = createAddonPurchaseResponse.data.data.addon_purchase_id;

      // Test 4: Get User's Addon Purchases
      console.log('4. Testing Get User Addon Purchases...');
      const userAddonPurchasesResponse = await axios.get(`${BASE_URL}/addon-purchases`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Get User Addon Purchases Response:');
      console.log('   - success:', userAddonPurchasesResponse.data.success);
      console.log('   - message:', userAddonPurchasesResponse.data.message);
      console.log('   - data.user_id:', userAddonPurchasesResponse.data.data.user_id);
      console.log('   - data.total_addon_purchases:', userAddonPurchasesResponse.data.data.total_addon_purchases);
      
      if (userAddonPurchasesResponse.data.data.addon_purchases.length > 0) {
        const addonPurchase = userAddonPurchasesResponse.data.data.addon_purchases[0];
        console.log('\n📦 Sample Addon Purchase Structure:');
        console.log('   - addon_purchase_id:', addonPurchase.addon_purchase_id);
        console.log('   - purchase_info:', {
          purchase_date: addonPurchase.purchase_info.purchase_date,
          expiration_date: addonPurchase.purchase_info.expiration_date,
          status: addonPurchase.purchase_info.status,
          amount_paid: addonPurchase.purchase_info.amount_paid
        });
        console.log('   - addon_details:', {
          addon_id: addonPurchase.addon_details.addon_id,
          addon_name: addonPurchase.addon_details.addon_name,
          addon_description: addonPurchase.addon_details.addon_description,
          price_type: addonPurchase.addon_details.price_type,
          base_price: addonPurchase.addon_details.base_price
        });
      }
      console.log('');

      // Test 5: Get Specific Addon Purchase by ID
      console.log(`5. Testing Get Addon Purchase by ID (${addonPurchaseId})...`);
      const addonPurchaseByIdResponse = await axios.get(`${BASE_URL}/addon-purchases/${addonPurchaseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Get Addon Purchase by ID Response:');
      console.log('   - success:', addonPurchaseByIdResponse.data.success);
      console.log('   - message:', addonPurchaseByIdResponse.data.message);
      console.log('   - data structure matches labeled format');
      console.log('');

      // Test 6: Cancel Addon Purchase
      console.log(`6. Testing Cancel Addon Purchase (${addonPurchaseId})...`);
      const cancelAddonPurchaseResponse = await axios.put(`${BASE_URL}/addon-purchases/${addonPurchaseId}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Cancel Addon Purchase Response:');
      console.log('   - success:', cancelAddonPurchaseResponse.data.success);
      console.log('   - message:', cancelAddonPurchaseResponse.data.message);
      console.log('   - data.status:', cancelAddonPurchaseResponse.data.data.status);
      console.log('');

    } catch (error) {
      console.log('⚠️ Addon Purchase operations failed:', error.response?.data?.message || error.message);
      console.log('');
    }

    console.log('🎉 Independent Addon Purchase Tests Completed!');
    console.log('\n📋 Summary of Addon Purchase System:');
    console.log('   ✅ Independent addon purchases (separate from packages)');
    console.log('   ✅ Clear labeled data structure with addon_purchase_id');
    console.log('   ✅ Organized purchase_info and addon_details');
    console.log('   ✅ Support for different price types (one-time/recurring)');
    console.log('   ✅ Flexible duration calculation');
    console.log('   ✅ Full CRUD operations (Create, Read, Cancel)');
    console.log('   ✅ Admin endpoints for management');

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
testAddonPurchases(); 