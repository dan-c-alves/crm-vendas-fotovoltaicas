#!/usr/bin/env python3
"""
Script para testar conexão com PostgreSQL e verificar tabelas
"""

import sys
import os

# Adicionar o diretório backend ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text, inspect
from config.settings import DATABASE_URL

def test_connection():
    """Testa conexão com o banco de dados"""
    print("🔍 Testando conexão com PostgreSQL...")
    print(f"📍 DATABASE_URL: {DATABASE_URL[:50]}...")
    
    try:
        engine = create_engine(DATABASE_URL)
        
        # Testar conexão
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            row = result.fetchone()
            version = row[0] if row else "desconhecida"
            print(f"✅ Conexão bem-sucedida!")
            print(f"📊 PostgreSQL Version: {version[:80]}...")
            
            # Listar tabelas
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            print(f"\n📋 Tabelas encontradas ({len(tables)}):")
            for table in tables:
                columns = inspector.get_columns(table)
                print(f"  - {table} ({len(columns)} colunas)")
            
            # Verificar tabela leads
            if 'leads' in tables:
                print(f"\n🔎 Colunas da tabela 'leads':")
                columns = inspector.get_columns('leads')
                for col in columns:
                    print(f"  - {col['name']}: {col['type']}")
                
                # Verificar se tarefa_concluida existe
                col_names = [col['name'] for col in columns]
                if 'tarefa_concluida' in col_names:
                    print("\n✅ Campo 'tarefa_concluida' existe!")
                else:
                    print("\n⚠️ Campo 'tarefa_concluida' NÃO existe! Execute:")
                    print("   python backend/scripts/add_tarefa_concluida_column.py")
            else:
                print("\n⚠️ Tabela 'leads' não encontrada! Execute:")
                print("   python backend/main.py  (para criar tabelas)")
        
        engine.dispose()
        print("\n✅ Teste concluído com sucesso!")
        
    except Exception as e:
        print(f"\n❌ Erro ao conectar: {e}")
        print("\n🔧 Possíveis soluções:")
        print("  1. Verifique se DATABASE_URL está correto em backend/config/settings.py")
        print("  2. Certifique-se que o PostgreSQL está rodando")
        print("  3. Verifique credenciais de acesso")

if __name__ == "__main__":
    test_connection()
