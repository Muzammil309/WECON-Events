// Test production authentication with fallback users
const http = require('http');

function testLogin(email, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ email, password });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
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
          const response = JSON.parse(data);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing production authentication with fallback users...\n');

  const testUsers = [
    { email: 'admin@wecon-masawat.com', password: 'admin123', expectedRole: 'super_admin' },
    { email: 'attendee@wecon-masawat.com', password: 'attendee123', expectedRole: 'attendee' },
    { email: 'speaker@wecon-masawat.com', password: 'speaker123', expectedRole: 'speaker' },
    { email: 'invalid@test.com', password: 'wrong', expectedRole: null }
  ];

  for (const testUser of testUsers) {
    try {
      console.log(`🔍 Testing: ${testUser.email}`);
      const result = await testLogin(testUser.email, testUser.password);
      
      if (result.status === 200 && result.data.ok) {
        console.log(`✅ SUCCESS: ${testUser.email}`);
        console.log(`   User: ${result.data.user.name}`);
        console.log(`   Role: ${result.data.user.role}`);
        console.log(`   Expected: ${testUser.expectedRole}`);
        
        if (result.data.user.role === testUser.expectedRole) {
          console.log(`   ✅ Role matches expected`);
        } else {
          console.log(`   ❌ Role mismatch`);
        }
      } else {
        if (testUser.expectedRole === null) {
          console.log(`✅ EXPECTED FAILURE: ${testUser.email} (invalid credentials)`);
        } else {
          console.log(`❌ FAILED: ${testUser.email}`);
          console.log(`   Status: ${result.status}`);
          console.log(`   Response:`, result.data);
        }
      }
    } catch (error) {
      console.log(`💥 ERROR testing ${testUser.email}:`, error.message);
    }
    console.log('');
  }

  console.log('🎯 Production authentication test completed!');
}

runTests().catch(console.error);
