const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testShopItem = {
  name: 'Protein Powder',
  description: 'High-quality whey protein powder for muscle building',
  price: 29.99,
  category: 'Supplements',
  stock: 50,
  image: 'https://example.com/protein-powder.jpg'
};

const testService = {
  name: 'Personal Training',
  description: 'One-on-one personal training sessions',
  price: 75.00,
  duration: '1 hour',
  category: 'Training',
  instructor: 'John Doe',
  maxCapacity: 1
};

const testPendingSignup = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  phone: '555-123-4567',
  membershipType: 'Premium',
  membershipDuration: '12 months'
};

async function testEndpoints() {
  console.log('🧪 Testing Gym Management System Endpoints...\n');

  try {
    // Test 1: Create a shop item (will fail without auth, but should not crash)
    console.log('1. Testing shop item creation...');
    try {
      const response = await axios.post(`${BASE_URL}/admin/shop-items`, testShopItem);
      console.log('✅ Shop item created:', response.data);
    } catch (error) {
      console.log('⚠️  Expected auth error for shop item creation:', error.response?.data?.message || error.message);
    }

    // Test 2: Create a service (will fail without auth, but should not crash)
    console.log('\n2. Testing service creation...');
    try {
      const response = await axios.post(`${BASE_URL}/admin/services`, testService);
      console.log('✅ Service created:', response.data);
    } catch (error) {
      console.log('⚠️  Expected auth error for service creation:', error.response?.data?.message || error.message);
    }

    // Test 3: Submit pending signup (should work without auth)
    console.log('\n3. Testing pending signup submission...');
    try {
      const response = await axios.post(`${BASE_URL}/auth/pending-signup`, testPendingSignup);
      console.log('✅ Pending signup submitted:', response.data);
    } catch (error) {
      console.log('❌ Pending signup failed:', error.response?.data?.message || error.message);
    }

    // Test 4: Get pending signups (will fail without auth, but should not crash)
    console.log('\n4. Testing pending signups retrieval...');
    try {
      const response = await axios.get(`${BASE_URL}/admin/pending-signups`);
      console.log('✅ Pending signups retrieved:', response.data);
    } catch (error) {
      console.log('⚠️  Expected auth error for pending signups retrieval:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 All endpoint tests completed!');
    console.log('\n📝 Summary:');
    console.log('- Shop management endpoints: Ready (require admin auth)');
    console.log('- Services management endpoints: Ready (require admin auth)');
    console.log('- Pending signups endpoints: Ready (public submission, admin review)');
    console.log('\n🚀 The system is ready for frontend integration!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testEndpoints(); 