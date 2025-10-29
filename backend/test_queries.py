import sqlite3
from datetime import datetime, timedelta, date

print('🔍 Testando queries da API de tarefas...')

# Conectar à base de dados correta
conn = sqlite3.connect('../data/crm_vendas.db')
cursor = conn.cursor()

print('📋 Tabelas disponíveis:')
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
for table in tables:
    print(f'  - {table[0]}')

print('📊 Dados na tabela leads:')
cursor.execute('SELECT COUNT(*) FROM leads')
total = cursor.fetchone()[0]
print(f'  Total leads: {total}')

if total > 0:
    cursor.execute('SELECT nome_lead, status, data_proxima_acao FROM leads LIMIT 3')
    samples = cursor.fetchall()
    for sample in samples:
        print(f'  - {sample[0]}: {sample[1]} (próxima: {sample[2]})')

# Testar query de follow-ups
hoje = date.today()
amanha = hoje + timedelta(days=1)

print(f'🔍 Testando query de follow-ups para {hoje} - {amanha}...')
cursor.execute("""
    SELECT COUNT(*) FROM leads 
    WHERE data_proxima_acao IS NOT NULL 
    AND data_proxima_acao <= ?
    AND status IN ('Entrada de Lead', 'Contactados', 'Follow-up', 'Interessados')
""", (amanha,))
follow_ups = cursor.fetchone()[0]
print(f'📞 Follow-ups encontrados: {follow_ups}')

conn.close()
print('✅ Queries básicas funcionando')