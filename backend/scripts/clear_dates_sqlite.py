#!/usr/bin/env python3
"""
Script para limpar todas as datas dos leads usando SQLite direto
"""

import sqlite3
import os

def clear_all_dates():
    """Limpar todas as datas de próxima ação"""
    try:
        db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crm_vendas.db')
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Primeiro verificar quantos leads têm data
        cursor.execute("""
            SELECT COUNT(*) FROM leads 
            WHERE data_proxima_acao IS NOT NULL OR proxima_acao IS NOT NULL
        """)
        
        count_before = cursor.fetchone()[0]
        print(f"📊 Leads com data antes da limpeza: {count_before}")
        
        if count_before == 0:
            print("✅ Nenhum lead tem data agendada. Nada a fazer.")
            conn.close()
            return
        
        # Mostrar os leads que serão limpos
        cursor.execute("""
            SELECT id, nome_lead, data_proxima_acao, proxima_acao
            FROM leads 
            WHERE data_proxima_acao IS NOT NULL OR proxima_acao IS NOT NULL
        """)
        
        leads_com_data = cursor.fetchall()
        print("\n🗑️  Leads que terão datas removidas:")
        for lead in leads_com_data:
            data = lead[2] or lead[3]
            print(f"  ID {lead[0]}: {lead[1]} - {data}")
        
        # Limpar todas as datas (ambos os campos possíveis)
        cursor.execute("""
            UPDATE leads 
            SET data_proxima_acao = NULL, 
                proxima_acao = NULL,
                data_atualizacao = CURRENT_TIMESTAMP
            WHERE data_proxima_acao IS NOT NULL OR proxima_acao IS NOT NULL
        """)
        
        # Confirmar alterações
        conn.commit()
        
        # Verificar se foram removidas
        cursor.execute("""
            SELECT COUNT(*) FROM leads 
            WHERE data_proxima_acao IS NOT NULL OR proxima_acao IS NOT NULL
        """)
        
        count_after = cursor.fetchone()[0]
        print(f"\n📊 Leads com data após limpeza: {count_after}")
        
        if count_after == 0:
            print("✅ Todas as datas foram removidas com sucesso!")
        else:
            print(f"⚠️  Ainda restam {count_after} leads com data")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")

if __name__ == "__main__":
    print("🧹 Limpando todas as datas dos leads...")
    clear_all_dates()