import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from app.database import SessionLocal
from models.lead import Lead

def remove_duplicates():
    print("🔍 Removendo leads duplicados...")
    
    s = SessionLocal()
    try:
        # Encontrar leads com email teste@test.com (placeholders duplicados)
        placeholder_leads = s.query(Lead).filter(
            Lead.email == 'teste@test.com',
            Lead.ativo == True
        ).order_by(Lead.id).all()
        
        if len(placeholder_leads) > 1:
            print(f"Encontrados {len(placeholder_leads)} leads com email placeholder.")
            print("Mantendo o primeiro, removendo os demais...")
            
            # Manter o primeiro, desativar os outros
            kept = placeholder_leads[0]
            to_remove = placeholder_leads[1:]
            
            for lead in to_remove:
                lead.ativo = False
                print(f"  Desativando: {lead.nome_lead} (ID: {lead.id})")
            
            s.commit()
            print(f"✅ {len(to_remove)} leads duplicados foram desativados.")
            print(f"✅ Lead mantido: {kept.nome_lead} (ID: {kept.id})")
        else:
            print("ℹ️  Nenhum lead duplicado encontrado com email placeholder.")
        
        # Verificar totais finais
        ativos_final = s.query(Lead).filter(Lead.ativo == True).count()
        print(f"\n📊 Total de leads ativos após limpeza: {ativos_final}")
        
    except Exception as e:
        s.rollback()
        print(f"❌ Erro: {e}")
        raise
    finally:
        s.close()

if __name__ == "__main__":
    remove_duplicates()
