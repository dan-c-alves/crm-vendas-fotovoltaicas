import sqlite3
from datetime import datetime, date, timedelta

print('📊 Criando dados de exemplo para teste de tarefas...')

# Conectar à base de dados
conn = sqlite3.connect('crm_vendas.db')
cursor = conn.cursor()

# Dados de exemplo para diferentes tipos de tarefas
dados_exemplo = [
    # Follow-ups agendados
    {
        'nome_lead': 'João Silva',
        'email': 'joao.silva@email.com',
        'telefone': '912345678',
        'status': 'Contactados',
        'valor_proposta': 15000.0,
        'proxima_acao': 'Ligar para confirmar interesse',
        'data_proxima_acao': date.today(),  # Hoje
        'origem': 'Website'
    },
    {
        'nome_lead': 'Maria Santos',
        'email': 'maria.santos@email.com',
        'telefone': '923456789',
        'status': 'Follow-up',
        'valor_proposta': 12500.0,
        'proxima_acao': 'Enviar proposta detalhada',
        'data_proxima_acao': date.today() + timedelta(days=1),  # Amanhã
        'origem': 'Referência'
    },
    {
        'nome_lead': 'Pedro Costa',
        'email': 'pedro.costa@email.com',
        'telefone': '934567890',
        'status': 'Interessados',
        'valor_proposta': 8000.0,
        'proxima_acao': 'Agendar visita técnica',
        'data_proxima_acao': date.today() - timedelta(days=1),  # Atrasado
        'origem': 'Facebook'
    },
    
    # Hot Leads sem atenção
    {
        'nome_lead': 'Ana Ferreira',
        'email': 'ana.ferreira@email.com',
        'telefone': '945678901',
        'status': 'Hot Lead',
        'valor_proposta': 25000.0,
        'origem': 'Google Ads',
        'created_at': datetime.now() - timedelta(days=5),
        'updated_at': datetime.now() - timedelta(days=4)  # 4 dias sem atualização
    },
    {
        'nome_lead': 'Rui Oliveira',
        'email': 'rui.oliveira@email.com',
        'telefone': '956789012',
        'status': 'Negociação',
        'valor_proposta': 18000.0,
        'origem': 'LinkedIn',
        'created_at': datetime.now() - timedelta(days=6),
        'updated_at': datetime.now() - timedelta(days=5)  # 5 dias sem atualização
    },
    
    # Leads sem contacto
    {
        'nome_lead': 'Sofia Mendes',
        'email': 'sofia.mendes@email.com',
        'telefone': '967890123',
        'status': 'Entrada de Lead',
        'origem': 'Website',
        'created_at': datetime.now() - timedelta(days=2)  # 2 dias sem ação
    },
    {
        'nome_lead': 'Carlos Rodrigues',
        'email': 'carlos.rodrigues@email.com',
        'telefone': '978901234',
        'status': 'Contactados',
        'origem': 'Referência',
        'created_at': datetime.now() - timedelta(days=3)  # 3 dias sem próxima ação
    },
    
    # Leads normais (para controle)
    {
        'nome_lead': 'Luís Pereira',
        'email': 'luis.pereira@email.com',
        'telefone': '989012345',
        'status': 'Venda Fechada',
        'valor_venda_com_iva': 15000.0,
        'valor_proposta': 15000.0,
        'origem': 'Website'
    }
]

# Inserir dados
for dados in dados_exemplo:
    campos = ', '.join(dados.keys())
    placeholders = ', '.join(['?' for _ in dados])
    
    cursor.execute(f'''
    INSERT INTO leads ({campos}) 
    VALUES ({placeholders})
    ''', list(dados.values()))

conn.commit()

# Verificar resultados
cursor.execute('SELECT COUNT(*) FROM leads')
total = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM leads WHERE data_proxima_acao IS NOT NULL AND data_proxima_acao <= date('now', '+1 day')")
follow_ups = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM leads WHERE status IN ('Hot Lead', 'Negociação') AND updated_at < datetime('now', '-3 days')")
hot_leads = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM leads WHERE (proxima_acao IS NULL OR proxima_acao = '') AND status IN ('Entrada de Lead', 'Contactados') AND created_at < datetime('now', '-1 day')")
sem_contacto = cursor.fetchone()[0]

conn.close()

print(f'✅ Criados {total} leads de exemplo')
print(f'📋 Estatísticas de tarefas:')
print(f'   📞 Follow-ups: {follow_ups}')
print(f'   🔥 Hot Leads: {hot_leads}')
print(f'   📋 Sem Contacto: {sem_contacto}')
print(f'   📊 Total Tarefas: {follow_ups + hot_leads + sem_contacto}')
print('🎉 Dados de teste criados com sucesso!')