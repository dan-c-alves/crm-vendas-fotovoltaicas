# backend/models/user.py

from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import bcrypt

Base = declarative_base()

class User(Base):
    """Modelo de Utilizador (para guardar o token do Google)"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    nome = Column(String(255))
    senha_hash = Column(String(255))  # Hash da senha para autenticação
    
    # Campos para Google OAuth
    google_id = Column(String(255), unique=True, nullable=True)  # ID do Google do usuário
    google_access_token = Column(Text)  # Token de acesso do Google
    google_refresh_token = Column(Text)  # Token de refresh do Google
    
    # Campo para guardar o token de acesso do Google Calendar (legacy - mantido para compatibilidade)
    google_calendar_token = Column(Text)
    
    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_atualizacao = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def set_password(self, password: str):
        """Define a senha do usuário (cria o hash)"""
        self.senha_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password: str) -> bool:
        """Verifica se a senha está correta"""
        if not self.senha_hash:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), self.senha_hash.encode('utf-8'))

    def __repr__(self):
        return f"<User {self.id}: {self.email}>"
