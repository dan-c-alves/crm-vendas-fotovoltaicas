#!/usr/bin/env python3
"""
Script simples para testar API de tarefas
"""

import sqlite3
import os

def verificar_dados():
    """Verificar dados na base"""
    try:
        db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crm_vendas.db')
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar leads com data_proxima_acao
        cursor.execute("""
            SELECT id, nome_lead, data_proxima_acao
            FROM leads 
            WHERE data_proxima_acao IS NOT NULL
        """)
        
        leads = cursor.fetchall()
        print(f"📊 Leads com data agendada: {len(leads)}")
        
        for lead in leads:
            print(f"  ID {lead[0]}: {lead[1]} - {lead[2]}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")

if __name__ == "__main__":
    verificar_dados()