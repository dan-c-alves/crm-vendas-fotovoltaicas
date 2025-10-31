// Teste da API de leads após correção da estrutura da tabela
// Execute este arquivo com: node test-api.js

const API_URL = 'http://localhost:3000'; // Testando localmente primeiro

async function testCreateLead() {
  const leadData = {
    nome_lead: "Maria Santos - TESTE API CORRIGIDO",
    email: "maria.teste.corrigido@email.com", 
    telefone: "913456789",
    morada: "Avenida da República, 456, Porto",
    origem: "Website",
    interesse: "Sistema fotovoltaico residencial",
    valor_venda_com_iva: 12000.00,
    taxa_iva: 23,  // Será convertido para 0.23
    comissao_percentagem: 5  // Será convertido para 0.05
  };

  try {
    console.log('🧪 Testando criação de lead...');
    console.log('📊 Dados do lead:', JSON.stringify(leadData, null, 2));
    
    const response = await fetch(`${API_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    });

    console.log('📡 Status da resposta:', response.status);
    console.log('📡 Status text:', response.statusText);

    const result = await response.text();
    console.log('📄 Resposta bruta:', result);

    if (response.ok) {
      console.log('✅ SUCCESS: Lead criado com sucesso!');
      try {
        const jsonResult = JSON.parse(result);
        console.log('📋 Lead criado:', jsonResult);
      } catch (e) {
        console.log('⚠️ Resposta não é JSON válido, mas sucesso!');
      }
    } else {
      console.log('❌ ERROR: Falha ao criar lead');
      console.log('💡 Erro:', result);
    }

  } catch (error) {
    console.log('🚨 EXCEPTION:', error.message);
  }
}

// Teste de conexão básica
async function testConnection() {
  try {
    console.log('🔗 Testando conexão com:', API_URL);
    const response = await fetch(API_URL);
    console.log('📡 Status da conexão:', response.status);
    if (response.ok) {
      console.log('✅ Servidor está online!');
    } else {
      console.log('⚠️ Servidor respondeu com erro');
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
  }
}

// Executar testes
async function runTests() {
  console.log('=== TESTE DA API LEADS ===\n');
  
  await testConnection();
  console.log('\n---\n');
  await testCreateLead();
  
  console.log('\n=== FIM DOS TESTES ===');
}

runTests();