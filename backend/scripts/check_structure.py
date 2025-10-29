#!/usr/bin/env python3
"""
Script para verificar estrutura da tabela leads
"""

import sqlite3
import os

def get_db_path():
    """Obter caminho da base de dados"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(current_dir, '..', 'data', 'crm_vendas.db')

def verificar_estrutura():
    """Verificar estrutura da tabela leads"""
    try:
        db_path = get_db_path()
        print(f"📂 Conectando à base de dados: {db_path}")
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar estrutura da tabela
        cursor.execute("PRAGMA table_info(leads)")
        columns = cursor.fetchall()
        
        print("\n📋 Estrutura da tabela 'leads':")
        for col in columns:
            print(f"{col[0]} | {col[1]} | {col[2]} | {col[3]} | {col[4]} | {col[5]}")
        
        # Verificar alguns registos
        cursor.execute("SELECT * FROM leads LIMIT 3")
        leads = cursor.fetchall()
        
        print(f"\n📊 Primeiros {len(leads)} registos:")
        for lead in leads:
            print(f"Lead {lead[0]}: {lead[1] if len(lead) > 1 else 'N/A'}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    verificar_estrutura()