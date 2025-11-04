import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.database import SessionLocal
from models.user import User
import bcrypt

def create_admin_user():
    db = SessionLocal()
    try:
        # Verificar se já existe
        existing = db.query(User).filter(User.email == 'danilocalves86@gmail.com').first()  # type: ignore
        if existing:
            print(f"❌ Utilizador já existe: {existing.email}")
            return
        
        # Criar hash da senha
        password_hash = bcrypt.hashpw('101010'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Criar utilizador
        user = User(
            nome='Danilo',
            email='danilocalves86@gmail.com',
            senha_hash=password_hash
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        print(f"✅ Utilizador administrador criado com sucesso!")
        print(f"   Nome: {user.nome}")
        print(f"   Email: {user.email}")
        print(f"   ID: {user.id}")
        print(f"   Senha: 101010")
        
    except Exception as e:
        print(f"❌ Erro ao criar utilizador: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    create_admin_user()
