# backend/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from pydantic import BaseModel, EmailStr
import jwt
from datetime import datetime, timedelta
import os

from app.database import get_db
from models.user import User as UserModel
from config.settings import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    SECRET_KEY
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Email autorizado
ALLOWED_EMAIL = "danilocalves86@gmail.com"

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

class GoogleUserInfo(BaseModel):
    email: str
    nome: str
    foto: str | None = None

def create_access_token(data: dict, remember_me: bool = False):
    """Cria um token JWT"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=30 if remember_me else 1)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

def get_google_oauth_flow(redirect_uri: str):
    """Cria um fluxo OAuth do Google com o redirect_uri especificado"""
    return Flow.from_client_config(
        client_config={
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=[
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/calendar.events"
        ],
        redirect_uri=redirect_uri
    )

@router.post("/register", response_model=TokenResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """Registra um novo usuário"""
    # Verifica se o email já existe
    existing = db.query(UserModel).filter(UserModel.email == data.email).first()  # type: ignore
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
    user = db.query(UserModel).filter(UserModel.email == data.email).first()  # type: ignore
    
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
def google_login(redirect_uri: str | None = None):
    """
    Inicia o fluxo de autenticação do Google.
    """
    # Determinar redirect_uri baseado no ambiente
    if not redirect_uri:
        redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/google/callback")
    
    flow = get_google_oauth_flow(redirect_uri)
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'  # Força mostrar tela de consentimento
    )
    
    return {"authorization_url": authorization_url}

@router.get("/google/callback")
def google_callback(code: str, state: str | None = None, db: Session = Depends(get_db)):
    """
    Recebe o código de autorização do Google e autentica o usuário.
    """
    try:
        # Determinar redirect_uri
        redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/google/callback")
        flow = get_google_oauth_flow(redirect_uri)
        
        # Trocar código por token
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        # Obter informações do usuário do Google
        service = build('oauth2', 'v2', credentials=credentials)
        user_info = service.userinfo().get().execute()
        
        email = user_info.get('email')
        nome = user_info.get('name', '')
        foto = user_info.get('picture', '')
        google_id = user_info.get('id')
        
        # Verificar se o email é autorizado
        if email != ALLOWED_EMAIL:
            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
            return RedirectResponse(f"{frontend_url}/?error=unauthorized")
        
        # Buscar ou criar usuário
        user = db.query(UserModel).filter(UserModel.email == email).first()  # type: ignore
        
        if not user:
            user = UserModel(
                email=email,
                nome=nome,
                google_id=google_id
            )
            db.add(user)
        else:
            user.nome = nome
            user.google_id = google_id
        
        # Salvar tokens do Google
        user.google_access_token = str(credentials.token) if credentials.token else None
        user.google_refresh_token = str(credentials.refresh_token) if credentials.refresh_token else user.google_refresh_token
        user.google_calendar_token = str(credentials.token) if credentials.token else None  # Compatibilidade com Calendar
        
        db.commit()
        db.refresh(user)
        
        # Criar JWT token (assume remember_me = True)
        token = create_access_token({
            "sub": user.email,
            "id": user.id,
            "nome": nome,
            "foto": foto
        }, remember_me=True)
        
        # Redirecionar para frontend com token
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        return RedirectResponse(f"{frontend_url}/?token={token}")
        
    except Exception as e:
        print(f"Erro no callback do Google: {e}")
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        return RedirectResponse(f"{frontend_url}/?error=auth_failed")

@router.get("/me")
def get_current_user(token: str, db: Session = Depends(get_db)):
    """
    Retorna informações do usuário autenticado baseado no token JWT.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("id")
        
        user = db.query(UserModel).filter(UserModel.id == user_id).first()  # type: ignore
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        return {
            "id": user.id,
            "email": user.email,
            "nome": user.nome or payload.get("nome", ""),
            "foto": payload.get("foto", "")
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
