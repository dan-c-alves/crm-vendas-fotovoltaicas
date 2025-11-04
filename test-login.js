// Test login API endpoint
const fetch = require('node-fetch');

async function testLogin() {
  console.log('🧪 Testando login local...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'danilocalves86@gmail.com',
        password: '101010'
      })
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Login funcionou!');
    } else {
      console.log('\n❌ Login falhou!');
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testLogin();
