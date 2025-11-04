# backend/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from pydantic import BaseModel, EmailStr
import jwt
from datetime import datetime, timedelta

from app.database import get_db
from models.user import User as UserModel
from config.settings import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    SCOPES,
    SECRET_KEY
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Schemas Pydantic
class RegisterRequest(BaseModel):
    nome: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

def create_access_token(data: dict):
    """Cria um token JWT"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

# Configuração do fluxo OAuth
flow = Flow.from_client_config(
    client_config={
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [GOOGLE_REDIRECT_URI],
        }
    },
    scopes=SCOPES,
    redirect_uri=GOOGLE_REDIRECT_URI
 )

@router.post("/register", response_model=TokenResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """Registra um novo usuário"""
    # Verifica se o email já existe
    existing = db.query(UserModel).filter(UserModel.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email já registrado")
    
    # Cria novo usuário
    user = UserModel(
        nome=data.nome,
        email=data.email
    )
    user.set_password(data.password)
    
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erro ao criar usuário")
    
    # Gera token
    token = create_access_token({"sub": user.email, "id": user.id})
    
    return {
        "access_token": token,
        "user": {
            "id": user.id,
            "nome": user.nome,
            "email": user.email
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Faz login do usuário"""
    user = db.query(UserModel).filter(UserModel.email == data.email).first()
    
    if not user or not user.check_password(data.password):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    # Gera token
    token = create_access_token({"sub": user.email, "id": user.id})
    
    return {
        "access_token": token,
        "user": {
            "id": user.id,
            "nome": user.nome,
            "email": user.email
        }
    }

@router.get("/google/login")
def google_login():
    """
    Inicia o fluxo de autenticação do Google.
    """
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    # Redirecionar para o Google
    return RedirectResponse(authorization_url)

@router.get("/google/callback")
def google_callback(code: str, db: Session = Depends(get_db)):
    """
    Recebe o código de autorização e troca por um token, guardando-o no User.
    """
    try:
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        # Guardar o token no utilizador padrão (ID 1)
        user = db.query(UserModel).filter(UserModel.id == 1).first()
        if not user:
            raise HTTPException(status_code=404, detail="Utilizador padrão não encontrado")
            
        user.google_calendar_token = credentials.token
        db.commit()
        
        # Redirecionar de volta para o Frontend (página de Configurações)
        frontend_url = "http://localhost:3000/settings" 
        return RedirectResponse(frontend_url + "?auth=success" )
        
    except Exception as e:
        print(f"Erro no callback do Google: {e}")
        # Redirecionar com erro para o frontend
        frontend_url = "http://localhost:3000/settings" 
        return RedirectResponse(frontend_url + "?auth=failure" )
