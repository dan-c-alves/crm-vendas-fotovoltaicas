#!/usr/bin/env python3
"""
Script para atualizar cálculo de comissões
- Comissão sempre 5% do valor sem IVA
- IVA padrão 23% (mas pode ser alterado)
"""

import sqlite3
import os
from datetime import datetime

def get_db_path():
    """Obter caminho da base de dados"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(current_dir, '..', 'data', 'crm_vendas.db')

def atualizar_comissoes():
    """Atualizar todas as comissões para 5% do valor sem IVA"""
    try:
        db_path = get_db_path()
        print(f"📂 Conectando à base de dados: {db_path}")
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Primeiro, adicionar a coluna comissao_valor se não existir
        cursor.execute("PRAGMA table_info(leads)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'comissao_valor' not in columns:
            print("🔧 Adicionando coluna comissao_valor...")
            cursor.execute("ALTER TABLE leads ADD COLUMN comissao_valor REAL DEFAULT 0.0")
            conn.commit()
        
        if 'comissao_percentagem' not in columns:
            print("🔧 Adicionando coluna comissao_percentagem...")
            cursor.execute("ALTER TABLE leads ADD COLUMN comissao_percentagem REAL DEFAULT 5.0")
            conn.commit()

        # Buscar todos os leads ativos
        cursor.execute("""
            SELECT id, nome_lead, valor_venda_com_iva, taxa_iva, comissao_valor
            FROM leads 
        """)
        
        leads = cursor.fetchall()
        print(f"📊 Encontrados {len(leads)} leads para atualizar")
        
        updated_count = 0
        
        for lead in leads:
            lead_id, nome_lead, valor_com_iva, taxa_iva, comissao_atual = lead
            
            # Valores padrão
            valor_com_iva = float(valor_com_iva) if valor_com_iva else 0.0
            taxa_iva = float(taxa_iva) if taxa_iva else 23.0
            
            # Calcular valor sem IVA
            if valor_com_iva > 0.0:
                valor_sem_iva = valor_com_iva / (1 + taxa_iva / 100)
            else:
                valor_sem_iva = 0.0
            
            # Calcular nova comissão (5% do valor sem IVA)
            nova_comissao = valor_sem_iva * 0.05
            
            # Atualizar apenas se houver mudança significativa
            if abs((comissao_atual or 0) - nova_comissao) > 0.01:
                cursor.execute("""
                    UPDATE leads 
                    SET comissao_valor = ?,
                        comissao_percentagem = 5.0,
                        data_atualizacao = ?
                    WHERE id = ?
                """, (nova_comissao, datetime.now().isoformat(), lead_id))
                
                print(f"✅ {nome_lead}: €{comissao_atual or 0:.2f} → €{nova_comissao:.2f} (Valor sem IVA: €{valor_sem_iva:.2f})")
                updated_count += 1
            else:
                print(f"⚪ {nome_lead}: Comissão já correta (€{nova_comissao:.2f})")
        
        conn.commit()
        conn.close()
        
        print(f"\n🎉 Atualização concluída! {updated_count} leads atualizados")
        print("💡 Todas as comissões agora são calculadas como 5% do valor sem IVA")
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()

if __name__ == "__main__":
    print("🔧 Atualizando cálculo de comissões...")
    atualizar_comissoes()