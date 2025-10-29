#!/usr/bin/env python3
"""
Script para adicionar data de teste a um lead específico
"""

import sqlite3
import os
from datetime import datetime, timedelta

def add_test_date():
    """Adicionar data de teste a um lead"""
    try:
        db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crm_vendas.db')
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar leads disponíveis
        cursor.execute("""
            SELECT id, nome_lead, status 
            FROM leads 
            WHERE ativo = 1
            ORDER BY id
            LIMIT 5
        """)
        
        leads = cursor.fetchall()
        print("📋 Leads disponíveis:")
        for lead in leads:
            print(f"  ID {lead[0]}: {lead[1]} - Status: {lead[2]}")
        
        if not leads:
            print("❌ Nenhum lead encontrado")
            conn.close()
            return
        
        # Selecionar o primeiro lead
        lead_escolhido = leads[0]
        lead_id = lead_escolhido[0]
        lead_nome = lead_escolhido[1]
        
        print(f"\n🎯 Selecionado: ID {lead_id} - {lead_nome}")
        
        # Criar data para amanhã às 14:30
        amanha = datetime.now() + timedelta(days=1)
        data_agendada = amanha.replace(hour=14, minute=30, second=0, microsecond=0)
        data_iso = data_agendada.isoformat()
        
        print(f"📅 Adicionando data: {data_iso}")
        
        # Atualizar o lead com a data
        cursor.execute("""
            UPDATE leads 
            SET proxima_acao = ?,
                data_atualizacao = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (data_iso, lead_id))
        
        conn.commit()
        
        # Verificar se foi salvo
        cursor.execute("""
            SELECT id, nome_lead, proxima_acao, status
            FROM leads 
            WHERE id = ?
        """, (lead_id,))
        
        lead_atualizado = cursor.fetchone()
        if lead_atualizado:
            print(f"✅ Lead atualizado:")
            print(f"   ID: {lead_atualizado[0]}")
            print(f"   Nome: {lead_atualizado[1]}")
            print(f"   Data: {lead_atualizado[2]}")
            print(f"   Status: {lead_atualizado[3]}")
        
        conn.close()
        
        print(f"\n🎯 Agora o lead {lead_nome} deve aparecer na página de Tarefas!")
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")

if __name__ == "__main__":
    print("📅 Adicionando data de teste a um lead...")
    add_test_date()