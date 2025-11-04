# backend/models/user.py

from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from typing import Optional
import bcrypt

Base = declarative_base()

class User(Base):
    """Modelo de Utilizador (para guardar o token do Google)"""
    __tablename__ = "users"

    id: int = Column(Integer, primary_key=True, index=True)  # type: ignore
    email: str = Column(String(255), unique=True, nullable=False)  # type: ignore
    nome: Optional[str] = Column(String(255))  # type: ignore
    senha_hash: Optional[str] = Column(String(255))  # type: ignore
    
    # Campos para Google OAuth
    google_id: Optional[str] = Column(String(255), unique=True, nullable=True)  # type: ignore
    google_access_token: Optional[str] = Column(Text)  # type: ignore
    google_refresh_token: Optional[str] = Column(Text)  # type: ignore
    
    # Campo para guardar o token de acesso do Google Calendar (legacy - mantido para compatibilidade)
    google_calendar_token: Optional[str] = Column(Text)  # type: ignore
    
    data_criacao: datetime = Column(DateTime, default=datetime.utcnow)  # type: ignore
    data_atualizacao: datetime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # type: ignore

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
