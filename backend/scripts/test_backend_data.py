import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from app.database import SessionLocal
from models.lead import Lead
from sqlalchemy import func

def test_backend_data():
    s = SessionLocal()
    try:
        print("=" * 60)
        print("TESTE DE DADOS DO BACKEND")
        print("=" * 60)
        
        # Contar todos os leads ativos
        total_ativos = s.query(Lead).filter(Lead.ativo == True).count()
        print(f"\n📊 Total de leads ativos: {total_ativos}")
        
        # Contar por status
        print("\n📊 Leads por Status:")
        status_counts = s.query(Lead.status, func.count(Lead.id)).filter(
            Lead.ativo == True
        ).group_by(Lead.status).all()
        
        for status, count in status_counts:
            print(f"  {status}: {count}")
        
        # Listar alguns exemplos
        print("\n📋 Primeiros 5 leads:")
        leads = s.query(Lead).filter(Lead.ativo == True).limit(5).all()
        for lead in leads:
            print(f"  - {lead.nome_lead} | {lead.status} | {lead.email}")
        
        print("\n✅ Backend tem dados disponíveis!")
        
    finally:
        s.close()

if __name__ == "__main__":
    test_backend_data()
