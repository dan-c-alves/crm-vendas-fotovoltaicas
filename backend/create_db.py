import sqlite3
from datetime import datetime

print('🔍 Verificando estrutura da base de dados...')

# Conectar à base de dados
conn = sqlite3.connect('crm_vendas.db')
cursor = conn.cursor()

# Verificar tabelas existentes
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print(f'📋 Tabelas existentes: {[t[0] for t in tables]}')

# Se a tabela leads não existir, criar
if not any('leads' in str(t) for t in tables):
    print('🏗️ Criando tabela leads...')
    cursor.execute('''
    CREATE TABLE leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_lead TEXT NOT NULL,
        email TEXT,
        telefone TEXT,
        morada TEXT,
        status TEXT DEFAULT 'Entrada de Lead',
        valor_venda_com_iva REAL,
        taxa_iva REAL DEFAULT 23.0,
        valor_proposta REAL,
        comissao_percentagem REAL,
        comissao_valor REAL,
        notas_conversa TEXT,
        origem TEXT,
        data_contacto TEXT,
        proxima_acao TEXT,
        data_proxima_acao DATE,
        ativo BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    print('✅ Tabela leads criada')

conn.commit()
conn.close()
print('🎉 Base de dados pronta!')