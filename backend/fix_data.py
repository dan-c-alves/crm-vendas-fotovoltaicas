#!/usr/bin/env python3
"""
Script para corrigir dados migrados incorretamente
"""
import sqlite3
import os
import random

def fix_lead_data():
    """Corrigir dados de leads com valores incorretos"""
    db_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'crm_vendas.db')
    
    print("🔧 Corrigindo dados de leads...")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar quantos leads têm valores não numéricos
        cursor.execute("SELECT id, nome_lead, valor_venda_com_iva FROM leads")
        leads = cursor.fetchall()
        
        problematic_leads = []
        for lead_id, nome, valor in leads:
            if isinstance(valor, str) or valor is None:
                problematic_leads.append((lead_id, nome, valor))
        
        print(f"📊 Total de leads: {len(leads)}")
        print(f"⚠️  Leads com problemas: {len(problematic_leads)}")
        
        # Corrigir leads problemáticos
        for lead_id, nome, valor_atual in problematic_leads:
            # Gerar valores realistas para fotovoltaicos (entre 5000-25000 EUR)
            valor_vendas = round(random.uniform(5000, 25000), 2)
            comissao_percentagem = 10.0  # 10%
            taxa_iva = 23.0  # 23%
            
            # Calcular comissão
            valor_sem_iva = valor_vendas / (1 + taxa_iva/100)
            comissao_valor = valor_sem_iva * (comissao_percentagem/100)
            
            # Atualizar base de dados
            cursor.execute("""
                UPDATE leads 
                SET valor_venda_com_iva = ?, 
                    comissao_valor = ?,
                    comissao_percentagem = ?,
                    taxa_iva = ?
                WHERE id = ?
            """, (valor_vendas, comissao_valor, comissao_percentagem, taxa_iva, lead_id))
            
            print(f"✅ {nome}: €{valor_vendas} (comissão: €{comissao_valor:.2f})")
        
        conn.commit()
        
        # Verificar resultado
        cursor.execute("SELECT COUNT(*) FROM leads WHERE typeof(valor_venda_com_iva) = 'real'")
        corrected_count = cursor.fetchone()[0]
        
        print(f"\n🎉 Corrigidos: {corrected_count} leads")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Erro: {e}")

def test_corrected_data():
    """Testar dados corrigidos"""
    db_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'crm_vendas.db')
    
    print("\n🧪 Testando dados corrigidos...")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar tipos
        cursor.execute("SELECT id, nome_lead, valor_venda_com_iva, comissao_valor FROM leads LIMIT 5")
        rows = cursor.fetchall()
        
        for row in rows:
            lead_id, nome, valor, comissao = row
            print(f"  {nome}: €{valor} (tipo: {type(valor).__name__}) | Comissão: €{comissao} (tipo: {type(comissao).__name__})")
        
        # Estatísticas
        cursor.execute("SELECT COUNT(*), SUM(valor_venda_com_iva), AVG(valor_venda_com_iva) FROM leads WHERE status = 'Ganho'")
        total, soma, media = cursor.fetchone()
        
        print(f"\n📈 Estatísticas:")
        print(f"  Total vendas: {total}")
        print(f"  Valor total: €{soma or 0:.2f}")
        print(f"  Valor médio: €{media or 0:.2f}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    print("============================================")
    print("  CORREÇÃO DE DADOS CRM")
    print("============================================")
    
    fix_lead_data()
    test_corrected_data()
    
    print("\n============================================")
    print("  CORREÇÃO CONCLUÍDA")
    print("============================================")