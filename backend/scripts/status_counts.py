import os
import sys
from sqlalchemy import func

# Tornar módulos do backend importáveis quando executado via scripts/
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from app.database import SessionLocal
from models.lead import Lead


def main():
    s = SessionLocal()
    try:
        print("STATUS COUNTS (ativo=True):")
        rows = (
            s.query(Lead.status, func.count(Lead.id))
            .filter(Lead.ativo == True)
            .group_by(Lead.status)
            .all()
        )
        for st, cnt in rows:
            print(f"  {st}: {cnt}")
        total = s.query(func.count(Lead.id)).scalar()
        ativos = s.query(func.count(Lead.id)).filter(Lead.ativo == True).scalar()
        print(f"TOTAL REGISTROS: {total}")
        print(f"ATIVOS: {ativos}")
    finally:
        s.close()


if __name__ == "__main__":
    main()
