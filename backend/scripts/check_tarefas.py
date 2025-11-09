"""
Script para verificar leads com datas agendadas
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.settings import DATABASE_URL
from models.lead import Lead

def check_tarefas():
    """Verifica leads com tarefas agendadas"""
    
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # Buscar todos os leads ativos
        all_leads = db.query(Lead).filter(Lead.ativo == True).all()
        print(f"\n📊 Total de leads ativos: {len(all_leads)}")
        
        # Buscar leads com proxima_acao preenchida
        leads_with_date = db.query(Lead).filter(
            Lead.ativo == True,
            Lead.proxima_acao.isnot(None)
        ).all()
        print(f"📅 Leads com proxima_acao: {len(leads_with_date)}")
        
        # Buscar leads com tarefa não concluída
        leads_not_concluded = db.query(Lead).filter(
            Lead.ativo == True,
            Lead.proxima_acao.isnot(None),
            Lead.tarefa_concluida == False
        ).all()
        print(f"⏰ Leads com tarefa pendente: {len(leads_not_concluded)}")
        
        print("\n" + "="*60)
        print("DETALHES DOS LEADS COM TAREFAS PENDENTES:")
        print("="*60)
        
        for lead in leads_not_concluded:
            print(f"\n🔹 ID: {lead.id}")
            print(f"   Nome: {lead.nome_lead}")
            print(f"   Status: {lead.status}")
            print(f"   Proxima Ação: {lead.proxima_acao}")
            print(f"   Tipo: {type(lead.proxima_acao)}")
            print(f"   Tarefa Concluída: {lead.tarefa_concluida}")
            print(f"   Email: {lead.email}")
            print(f"   Telefone: {lead.telefone}")
        
        # Verificar se há leads com proxima_acao mas tarefa_concluida = True
        leads_concluded = db.query(Lead).filter(
            Lead.ativo == True,
            Lead.proxima_acao.isnot(None),
            Lead.tarefa_concluida == True
        ).all()
        
        if leads_concluded:
            print("\n" + "="*60)
            print("LEADS COM TAREFA CONCLUÍDA (NÃO DEVEM APARECER):")
            print("="*60)
            for lead in leads_concluded:
                print(f"\n🔹 ID: {lead.id}")
                print(f"   Nome: {lead.nome_lead}")
                print(f"   Proxima Ação: {lead.proxima_acao}")
        
    except Exception as e:
        print(f"\n❌ Erro: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_tarefas()
