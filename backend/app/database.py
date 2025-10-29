# backend/app/database.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.settings import DATABASE_URL
from models.lead import Base as LeadBase
from models.user import Base as UserBase # NOVO IMPORT

# Se for SQLite, garantir que o diretório existe
if DATABASE_URL.startswith("sqlite"):
    db_path = DATABASE_URL.replace("sqlite:///", "")
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Inicializa a base de dados e cria as tabelas"""
    print(f"Base de dados inicializada em: {DATABASE_URL}")
    
    # Criar tabelas
    LeadBase.metadata.create_all(bind=engine)
    UserBase.metadata.create_all(bind=engine) # NOVO
    
    # Adicionar utilizador padrão se não existir (para guardar o token)
    db = SessionLocal()
    try:
        from models.user import User
        user_exists = db.query(User).filter(User.id == 1).first()
        if not user_exists:
            default_user = User(email="utilizador@crm.com", nome="Utilizador Padrão")
            db.add(default_user)
            db.commit()
            print("✅ Utilizador padrão criado para guardar o token do Google Calendar.")
    except Exception as e:
        print(f"⚠️  Erro ao criar utilizador padrão: {e}")
    finally:
        db.close()
    
    print("✅ Base de dados inicializada")

def get_db():
    """Dependência para obter a sessão de base de dados"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
