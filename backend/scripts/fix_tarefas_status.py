"""
Script para corrigir o status de tarefas concluídas
Marca tarefa_concluida = False para leads que têm proxima_acao
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.settings import DATABASE_URL
from models.lead import Lead

def fix_tarefas():
    """Corrige status de tarefas"""
    
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # Buscar leads com proxima_acao preenchida mas marcados como concluídos
        leads_to_fix = db.query(Lead).filter(
            Lead.ativo == True,
            Lead.proxima_acao.isnot(None),
            Lead.tarefa_concluida == True
        ).all()
        
        print(f"\n📋 Encontrados {len(leads_to_fix)} leads para corrigir:")
        
        for lead in leads_to_fix:
            print(f"\n🔄 Corrigindo: {lead.nome_lead} (ID: {lead.id})")
            print(f"   Proxima Ação: {lead.proxima_acao}")
            print(f"   Status atual: tarefa_concluida = {lead.tarefa_concluida}")
            
            # Marcar como não concluída
            lead.tarefa_concluida = False
            print(f"   ✅ Novo status: tarefa_concluida = False")
        
        # Salvar alterações
        db.commit()
        print(f"\n✅ {len(leads_to_fix)} leads corrigidos com sucesso!")
        
        # Verificar resultado
        print("\n" + "="*60)
        print("VERIFICAÇÃO FINAL:")
        print("="*60)
        
        leads_pendentes = db.query(Lead).filter(
            Lead.ativo == True,
            Lead.proxima_acao.isnot(None),
            Lead.tarefa_concluida == False
        ).all()
        
        print(f"\n📊 Leads com tarefas pendentes agora: {len(leads_pendentes)}")
        for lead in leads_pendentes:
            print(f"   • {lead.nome_lead} - {lead.proxima_acao}")
        
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_tarefas()
