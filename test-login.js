// Quick test script to verify login functionality
const https = require('https');
const http = require('http');

function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function testLogin() {
  console.log('🧪 Testing login functionality...');

  // Test debug endpoint first
  console.log('\n1. Testing debug login endpoint...');
  try {
    const debugResult = await makeRequest('/api/test-login', {
      email: 'admin@wecon-masawat.com',
      password: 'admin123'
    });

    console.log('Debug login status:', debugResult.status);
    console.log('Debug login response:', debugResult.data);

    if (debugResult.data.ok) {
      console.log('✅ Debug login successful!');
    } else {
      console.log('❌ Debug login failed:', debugResult.data.error);
    }
  } catch (error) {
    console.log('❌ Debug login error:', error.message);
  }

  // Test actual login endpoint
  console.log('\n2. Testing actual login endpoint...');
  try {
    const loginResult = await makeRequest('/api/auth/login', {
      email: 'admin@wecon-masawat.com',
      password: 'admin123'
    });

    console.log('Login status:', loginResult.status);
    console.log('Login response:', loginResult.data);

    if (loginResult.data.ok) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed:', loginResult.data.error);
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }

  console.log('\n🎯 Login testing completed!');
}

testLogin().catch(console.error);
