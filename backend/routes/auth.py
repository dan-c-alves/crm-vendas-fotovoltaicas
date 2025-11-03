# backend/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials

from app.database import get_db
from models.user import User as UserModel
from config.settings import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    SCOPES
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

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
