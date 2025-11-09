import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from app.database import SessionLocal
from models.lead import Lead

def recreate_zina():
    s = SessionLocal()
    try:
        # Criar lead Zina
        zina = Lead(
            nome_lead="Zina Oliveira - Setubal",
            email="zina_oliveira@example.com",  # Email placeholder
            telefone="938497470",
            status="Entrada de Lead",
            origem="Outros",
            ativo=True,
            notas_conversa="Lead importado do Trello (originalmente em status Perdido, movido para Entrada de Lead conforme solicitado)"
        )
        
        s.add(zina)
        s.commit()
        s.refresh(zina)
        
        print(f"✅ Lead criado: {zina.nome_lead} (ID: {zina.id})")
        print(f"   Status: {zina.status}")
        print(f"   Email: {zina.email}")
        print(f"   Telefone: {zina.telefone}")
        
    except Exception as e:
        s.rollback()
        print(f"❌ Erro: {e}")
        raise
    finally:
        s.close()

if __name__ == "__main__":
    recreate_zina()
