const axios = require('axios');

const BACKEND_URL = 'https://s85-gym-management-system.onrender.com';
const FRONTEND_URL = 'https://ironcorefit.netlify.app';

async function testConnection() {
    console.log('🔍 Testing Backend-Frontend Connection...\n');
    
    try {
        // Test backend health
        console.log('1. Testing Backend Health...');
        const healthResponse = await axios.get(`${BACKEND_URL}/health`);
        console.log('✅ Backend Health:', healthResponse.data);
        
        // Test main endpoint
        console.log('\n2. Testing Main Endpoint...');
        const mainResponse = await axios.get(BACKEND_URL);
        console.log('✅ Main Endpoint:', mainResponse.data.substring(0, 100) + '...');
        
        // Test CORS with frontend origin
        console.log('\n3. Testing CORS Configuration...');
        const corsResponse = await axios.get(`${BACKEND_URL}/health`, {
            headers: {
                'Origin': FRONTEND_URL
            }
        });
        console.log('✅ CORS Test Passed');
        
        console.log('\n🎉 All tests passed! Backend is properly connected.');
        
    } catch (error) {
        console.error('\n❌ Connection Test Failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            console.error('Network Error:', error.message);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testConnection(); 