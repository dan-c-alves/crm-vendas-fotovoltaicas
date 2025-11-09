import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from app.database import SessionLocal
from models.lead import Lead

def clean_inactive():
    print("🗑️  Removendo leads inativos antigos...")
    
    s = SessionLocal()
    try:
        # Contar e deletar todos os leads inativos
        inativos = s.query(Lead).filter(Lead.ativo == False).all()
        count = len(inativos)
        
        if count > 0:
            print(f"Encontrados {count} leads inativos.")
            print("Removendo permanentemente do banco de dados...")
            
            for lead in inativos:
                s.delete(lead)
            
            s.commit()
            print(f"✅ {count} leads inativos foram removidos permanentemente.")
        else:
            print("ℹ️  Nenhum lead inativo encontrado.")
        
        # Verificar totais finais
        total_final = s.query(Lead).count()
        ativos_final = s.query(Lead).filter(Lead.ativo == True).count()
        print(f"\n📊 Total de leads na tabela: {total_final}")
        print(f"📊 Leads ativos: {ativos_final}")
        
    except Exception as e:
        s.rollback()
        print(f"❌ Erro: {e}")
        raise
    finally:
        s.close()

if __name__ == "__main__":
    clean_inactive()
