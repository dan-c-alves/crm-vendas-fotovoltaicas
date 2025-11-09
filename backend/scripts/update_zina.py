import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from app.database import SessionLocal
from models.lead import Lead

def update_zina():
    s = SessionLocal()
    try:
        # Buscar lead com nome contendo "Zina"
        zina = s.query(Lead).filter(
            Lead.nome_lead.ilike('%zina%'),
            Lead.ativo == True
        ).first()
        
        if zina:
            print(f"Encontrado: {zina.nome_lead}")
            print(f"Status atual: {zina.status}")
            zina.status = "Entrada de Lead"
            s.commit()
            print(f"✅ Status atualizado para: Entrada de Lead")
        else:
            print("❌ Lead Zina não encontrado nos registros ativos")
        
    except Exception as e:
        s.rollback()
        print(f"❌ Erro: {e}")
        raise
    finally:
        s.close()

if __name__ == "__main__":
    update_zina()
