#!/usr/bin/env python3
"""
Script de teste para verificar funcionamento do sistema
"""
import sys
import os
import sqlite3
from pathlib import Path

# Adicionar o diretório do backend ao path
sys.path.insert(0, str(Path(__file__).parent))

def test_database():
    """Testar conexão com a base de dados"""
    print("🔍 Testando base de dados...")
    
    db_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'crm_vendas.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar se tabela leads existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='leads'")
        if cursor.fetchone():
            print("✅ Tabela 'leads' encontrada")
            
            # Contar leads
            cursor.execute("SELECT COUNT(*) FROM leads")
            total_leads = cursor.fetchone()[0]
            print(f"✅ Total de leads: {total_leads}")
            
            # Verificar tipos de dados problemáticos
            cursor.execute("SELECT id, valor_venda_com_iva, comissao_valor FROM leads LIMIT 5")
            rows = cursor.fetchall()
            
            print("🔍 Verificando tipos de dados:")
            for row in rows:
                lead_id, valor_venda, comissao = row
                print(f"  Lead {lead_id}: valor_venda={valor_venda} (tipo: {type(valor_venda)}), comissao={comissao} (tipo: {type(comissao)})")
        else:
            print("❌ Tabela 'leads' não encontrada")
            
        conn.close()
        
    except Exception as e:
        print(f"❌ Erro na base de dados: {e}")

def test_imports():
    """Testar imports dos módulos"""
    print("\n🔍 Testando imports...")
    
    try:
        from app.database import init_db
        print("✅ app.database importado")
        
        from routes.leads import router
        print("✅ routes.leads importado")
        
        from routes.tasks_working import router as tasks_router
        print("✅ routes.tasks_working importado")
        
        from utils.calculators import ComissaoCalculator
        print("✅ utils.calculators importado")
        
    except Exception as e:
        print(f"❌ Erro no import: {e}")

def test_calculators():
    """Testar calculadoras"""
    print("\n🔍 Testando calculadoras...")
    
    try:
        from utils.calculators import ComissaoCalculator
        
        # Teste com valores normais
        valor_sem_iva = ComissaoCalculator.calcular_valor_sem_iva(1000.0, 23.0)
        print(f"✅ Valor sem IVA: {valor_sem_iva}")
        
        comissao = ComissaoCalculator.calcular_comissao(valor_sem_iva, 10.0)
        print(f"✅ Comissão: {comissao}")
        
        # Teste com strings (problemático)
        try:
            valor_sem_iva_str = ComissaoCalculator.calcular_valor_sem_iva("1000.0", "23.0")
            print(f"⚠️  Valor sem IVA (string): {valor_sem_iva_str}")
        except Exception as e:
            print(f"❌ Erro com strings: {e}")
            
    except Exception as e:
        print(f"❌ Erro nas calculadoras: {e}")

if __name__ == "__main__":
    print("============================================")
    print("  TESTE COMPLETO DO SISTEMA CRM")
    print("============================================")
    
    test_database()
    test_imports()
    test_calculators()
    
    print("\n============================================")
    print("  TESTE CONCLUÍDO")
    print("============================================")