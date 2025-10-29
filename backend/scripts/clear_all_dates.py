#!/usr/bin/env python3
"""
Script para limpar todas as datas de próxima ação dos leads
"""
import sys
import os

# Adicionar o caminho do backend ao PYTHONPATH
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from datetime import datetime
from app.database import SessionLocal
from models.lead import Lead

def clear_all_dates():
    """Remove todas as datas de próxima ação dos leads"""
    
    print("🧹 Limpando todas as datas dos leads...")
    
    # Criar sessão da base de dados
    db = SessionLocal()
    
    try:
        # Buscar todos os leads ativos
        leads = db.query(Lead).filter(Lead.ativo == True).all()
        
        print(f"📋 Encontrados {len(leads)} leads ativos")
        
        # Contar quantos têm data agendada
        leads_com_data = [lead for lead in leads if lead.proxima_acao is not None]
        print(f"📅 {len(leads_com_data)} leads têm datas agendadas")
        
        if len(leads_com_data) == 0:
            print("✅ Nenhum lead tem data agendada. Nada a fazer.")
            return
        
        # Limpar todas as datas
        for lead in leads:
            if lead.proxima_acao is not None:
                print(f"🗑️  Removendo data de: {lead.nome_lead} (ID: {lead.id})")
                lead.proxima_acao = None
                lead.data_atualizacao = datetime.utcnow()
        
        # Salvar alterações
        db.commit()
        
        print(f"✅ Todas as datas foram removidas!")
        print(f"📊 {len(leads_com_data)} leads atualizados")
        
        # Verificar se realmente foram removidas
        leads_atualizados = db.query(Lead).filter(
            Lead.ativo == True,
            Lead.proxima_acao.is_not(None)
        ).all()
        
        if len(leads_atualizados) == 0:
            print("✅ Confirmado: Nenhum lead tem data agendada")
        else:
            print(f"⚠️  Ainda restam {len(leads_atualizados)} leads com data")
    
    except Exception as e:
        print(f"❌ Erro ao limpar datas: {e}")
        db.rollback()
    
    finally:
        db.close()

if __name__ == "__main__":
    clear_all_dates()