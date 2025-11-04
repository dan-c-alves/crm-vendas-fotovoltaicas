// Test registro local
const teste = async () => {
  try {
    console.log('🧪 Testando registro...\n');
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Teste Local',
        email: `teste${Date.now()}@teste.com`,
        password: '123456'
      })
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Registro funcionou!');
    } else {
      console.log('\n❌ Registro falhou!');
      console.log('Erro:', data.error);
    }
  } catch (error) {
    console.error('❌ Erro de rede:', error.message);
  }
};

teste();
