import os
import sys
from sqlalchemy import func

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from app.database import SessionLocal
from models.lead import Lead

def main():
    s = SessionLocal()
    try:
        total = s.query(Lead).count()
        ativos = s.query(Lead).filter(Lead.ativo == True).count()
        inativos = s.query(Lead).filter(Lead.ativo == False).count()
        
        print("=" * 60)
        print("CONTAGEM DETALHADA DE LEADS")
        print("=" * 60)
        print(f"TOTAL na tabela: {total}")
        print(f"ATIVOS (ativo=True): {ativos}")
        print(f"INATIVOS (ativo=False): {inativos}")
        print()
        
        # Verificar duplicados por email
        print("VERIFICANDO DUPLICADOS POR EMAIL:")
        duplicates = s.query(Lead.email, func.count(Lead.id)).filter(
            Lead.ativo == True
        ).group_by(Lead.email).having(func.count(Lead.id) > 1).all()
        
        if duplicates:
            print(f"Encontrados {len(duplicates)} emails duplicados:")
            for email, count in duplicates:
                print(f"  {email}: {count} registros")
        else:
            print("  Nenhum email duplicado encontrado.")
        print()
        
        # Verificar duplicados por nome + telefone
        print("VERIFICANDO DUPLICADOS POR NOME + TELEFONE:")
        dups_nome_tel = s.query(
            Lead.nome_lead, Lead.telefone, func.count(Lead.id)
        ).filter(
            Lead.ativo == True
        ).group_by(Lead.nome_lead, Lead.telefone).having(func.count(Lead.id) > 1).all()
        
        if dups_nome_tel:
            print(f"Encontrados {len(dups_nome_tel)} pares nome+telefone duplicados:")
            for nome, tel, count in dups_nome_tel[:10]:
                print(f"  {nome} / {tel}: {count} registros")
        else:
            print("  Nenhum par nome+telefone duplicado.")
        
    finally:
        s.close()

if __name__ == "__main__":
    main()
