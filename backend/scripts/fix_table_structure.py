#!/usr/bin/env python3
"""
Script para corrigir estrutura da tabela leads
- Adicionar coluna data_proxima_acao como DATETIME
- Renomear proxima_acao para proxima_acao_texto
"""

import sqlite3
import os

def get_db_path():
    """Obter caminho da base de dados"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(current_dir, '..', 'data', 'crm_vendas.db')

def corrigir_estrutura():
    """Corrigir estrutura da tabela leads"""
    try:
        db_path = get_db_path()
        print(f"📂 Conectando à base de dados: {db_path}")
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar se a coluna data_proxima_acao existe
        cursor.execute("PRAGMA table_info(leads)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'data_proxima_acao' not in columns:
            print("🔧 Adicionando coluna data_proxima_acao...")
            cursor.execute("ALTER TABLE leads ADD COLUMN data_proxima_acao DATETIME DEFAULT NULL")
            conn.commit()
        
        # Renomear proxima_acao para proxima_acao_texto
        if 'proxima_acao_texto' not in columns:
            print("🔧 Adicionando coluna proxima_acao_texto...")
            cursor.execute("ALTER TABLE leads ADD COLUMN proxima_acao_texto TEXT DEFAULT NULL")
            conn.commit()
            
            # Copiar dados de proxima_acao para proxima_acao_texto se existir
            if 'proxima_acao' in columns:
                print("📋 Copiando dados de proxima_acao para proxima_acao_texto...")
                cursor.execute("UPDATE leads SET proxima_acao_texto = proxima_acao WHERE proxima_acao IS NOT NULL")
                conn.commit()
        
        conn.close()
        
        print("✅ Estrutura da tabela atualizada com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    corrigir_estrutura()