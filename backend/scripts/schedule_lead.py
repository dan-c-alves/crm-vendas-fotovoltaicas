#!/usr/bin/env python3
"""
Script para agendar data para um lead existente
"""

import sqlite3
import os
from datetime import datetime, timedelta

def agendar_lead():
    """Agendar data para lead existente"""
    try:
        db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crm_vendas.db')
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar se temos leads
        cursor.execute("SELECT id, nome_lead FROM leads ORDER BY id DESC LIMIT 1")
        lead = cursor.fetchone()
        
        if not lead:
            print("❌ Nenhum lead encontrado")
            return
        
        lead_id, nome_lead = lead
        print(f"📋 Lead encontrado: ID {lead_id} - {nome_lead}")
        
        # Data para amanhã às 15:00
        amanha = datetime.now() + timedelta(days=1)
        data_agendada = amanha.replace(hour=15, minute=0, second=0, microsecond=0)
        
        # Atualizar com data agendada
        cursor.execute("""
            UPDATE leads 
            SET data_proxima_acao = ?
            WHERE id = ?
        """, (data_agendada.isoformat(), lead_id))
        
        conn.commit()
        conn.close()
        
        print(f"✅ Data agendada para: {data_agendada.strftime('%d/%m/%Y às %H:%M')}")
        print(f"🎯 O lead aparecerá na página de Tarefas")
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")

if __name__ == "__main__":
    agendar_lead()