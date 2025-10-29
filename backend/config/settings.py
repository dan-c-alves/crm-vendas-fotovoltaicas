# backend/config/settings.py

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Configurações de segurança
SECRET_KEY = os.getenv("SECRET_KEY", "sua-chave-secreta-aqui-mude-em-producao")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

# Configurações da Base de Dados
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR.parent / 'data' / 'crm_vendas.db'}")

# Configurações de CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000" ).split(',')

# --- CONFIGURAÇÕES DE NEGÓCIO ---
COMISSAO_PERCENTAGEM = float(os.getenv("COMISSAO_PERCENTAGEM", "0.05"))  # 5%
IVA_TAXA = float(os.getenv("IVA_TAXA", "0.23"))  # 23%

# --- NOVAS CONFIGURAÇÕES DE GOOGLE CALENDAR ---
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "SEU_CLIENT_ID_AQUI")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "SEU_CLIENT_SECRET_AQUI")
# Este deve ser o URL do seu Backend em produção
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/google/callback" )
SCOPES = ["https://www.googleapis.com/auth/calendar.events"]

# --- NOVAS CONFIGURAÇÕES DE CLOUDINARY ---
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "SEU_CLOUD_NAME" )
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "SEU_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "SEU_API_SECRET")
