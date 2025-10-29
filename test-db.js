// Teste de conexão manual com Supabase
const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.jzezbecvjquqxjnilvya:Sen123456%21@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

console.log('🔗 Testando conexão com Supabase...');
console.log('URL:', DATABASE_URL.substring(0, 50) + '...');

async function testConnection() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 60000,
    max: 1
  });

  try {
    console.log('⏳ Conectando...');
    const client = await pool.connect();
    console.log('✅ Conectado com sucesso!');

    // Testar query básica
    const result = await client.query('SELECT 1 as test, NOW() as timestamp');
    console.log('📊 Resultado do teste:', result.rows[0]);

    // Verificar se a tabela leads existe
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'leads'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ Tabela "leads" existe');
      
      // Contar leads
      const countResult = await client.query('SELECT COUNT(*) as total FROM leads');
      console.log('📈 Total de leads:', countResult.rows[0].total);
      
      // Mostrar alguns leads
      const sampleLeads = await client.query('SELECT id, nome_lead, status FROM leads LIMIT 3');
      console.log('📋 Exemplos de leads:', sampleLeads.rows);
    } else {
      console.log('❌ Tabela "leads" não encontrada');
    }

    client.release();
    await pool.end();
    console.log('🔚 Conexão encerrada');

  } catch (error) {
    console.error('❌ Erro de conexão:', error);
    process.exit(1);
  }
}

testConnection();