#!/usr/bin/env python3
"""
Script para criar mais leads de teste para demonstração completa
"""

import sqlite3
import os
from datetime import datetime, timedelta

def criar_leads_demo():
    """Criar vários leads de teste para demonstração"""
    try:
        db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crm_vendas.db')
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Lead 1: Para hoje às 16:30
        hoje = datetime.now()
        data_hoje = hoje.replace(hour=16, minute=30, second=0, microsecond=0)
        
        cursor.execute("""
            INSERT INTO leads 
            (nome_lead, email, telefone, morada, status, valor_venda_com_iva, taxa_iva, comissao_valor, notas_conversa, data_proxima_acao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "Carlos Mendes - Urgente",
            "carlos.mendes@email.com",
            "924567890",
            "Avenida da Liberdade, 456, Porto",
            "Hot Lead",
            25000.00,
            23.0,
            25000.00 / 1.23 * 0.05,  # 5% do valor sem IVA
            "Cliente com urgência em instalar sistema antes do inverno. Valor alto, boa oportunidade.",
            data_hoje.isoformat()
        ))
        
        # Lead 2: Para amanhã de manhã às 10:00
        amanha = datetime.now() + timedelta(days=1)
        data_amanha = amanha.replace(hour=10, minute=0, second=0, microsecond=0)
        
        cursor.execute("""
            INSERT INTO leads 
            (nome_lead, email, telefone, morada, status, valor_venda_com_iva, taxa_iva, comissao_valor, notas_conversa, data_proxima_acao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "Ana Rodrigues - Seguimento",
            "ana.rodrigues@email.com",
            "935678901",
            "Rua dos Cravos, 789, Braga",
            "Negociação",
            12500.00,
            23.0,
            12500.00 / 1.23 * 0.05,  # 5% do valor sem IVA
            "Cliente em fase de negociação. Quer comparar com outras propostas.",
            data_amanha.isoformat()
        ))
        
        # Lead 3: Para depois de amanhã às 14:00
        depois_amanha = datetime.now() + timedelta(days=2)
        data_depois = depois_amanha.replace(hour=14, minute=0, second=0, microsecond=0)
        
        cursor.execute("""
            INSERT INTO leads 
            (nome_lead, email, telefone, morada, status, valor_venda_com_iva, taxa_iva, comissao_valor, notas_conversa, data_proxima_acao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "Pedro Silva - Visita Técnica",
            "pedro.silva@email.com",
            "946789012",
            "Travessa das Flores, 321, Aveiro",
            "Levantamento Técnico",
            8900.00,
            23.0,
            8900.00 / 1.23 * 0.05,  # 5% do valor sem IVA
            "Agendada visita técnica para levantamento do telhado e medições.",
            data_depois.isoformat()
        ))
        
        conn.commit()
        conn.close()
        
        print("✅ 3 leads de teste criados com sucesso!")
        print(f"🕒 Hoje às 16:30: Carlos Mendes - €25.000")
        print(f"🕙 Amanhã às 10:00: Ana Rodrigues - €12.500")
        print(f"🕐 Depois de amanhã às 14:00: Pedro Silva - €8.900")
        print("\n🎯 Todos aparecerão na página de Tarefas ordenados por data!")
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")

if __name__ == "__main__":
    criar_leads_demo()