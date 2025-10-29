#!/usr/bin/env python3
"""
Script para corrigir datas NULL na base de dados
"""
import sqlite3
import os
from datetime import datetime

def fix_null_dates():
    """Corrigir datas NULL na base de dados"""
    db_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'crm_vendas.db')
    
    print("🔧 Corrigindo datas NULL...")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        current_time = datetime.now().isoformat()
        
        # Verificar quantos leads têm datas NULL
        cursor.execute("SELECT COUNT(*) FROM leads WHERE data_entrada IS NULL OR data_atualizacao IS NULL")
        null_count = cursor.fetchone()[0]
        
        print(f"📊 Leads com datas NULL: {null_count}")
        
        if null_count > 0:
            # Atualizar datas NULL
            cursor.execute("""
                UPDATE leads 
                SET data_entrada = COALESCE(data_entrada, ?),
                    data_atualizacao = COALESCE(data_atualizacao, ?)
                WHERE data_entrada IS NULL OR data_atualizacao IS NULL
            """, (current_time, current_time))
            
            affected_rows = cursor.rowcount
            print(f"✅ {affected_rows} leads atualizados com datas corretas")
        
        conn.commit()
        
        # Verificar resultado
        cursor.execute("SELECT COUNT(*) FROM leads WHERE data_entrada IS NOT NULL AND data_atualizacao IS NOT NULL")
        fixed_count = cursor.fetchone()[0]
        
        print(f"🎉 Total de leads com datas corretas: {fixed_count}")
        
        # Teste de alguns leads
        cursor.execute("SELECT id, nome_lead, data_entrada, data_atualizacao FROM leads LIMIT 3")
        rows = cursor.fetchall()
        
        print("\n📋 Exemplos de leads:")
        for row in rows:
            lead_id, nome, entrada, atualizacao = row
            print(f"  {nome}: entrada={entrada}, atualização={atualizacao}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    print("============================================")
    print("  CORREÇÃO DE DATAS NULL")
    print("============================================")
    
    fix_null_dates()
    
    print("\n============================================")
    print("  CORREÇÃO CONCLUÍDA")
    print("============================================")