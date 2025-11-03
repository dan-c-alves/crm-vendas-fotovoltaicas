# backend/config/settings.py

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Configurações de segurança
SECRET_KEY = os.getenv("SECRET_KEY", "sua-chave-secreta-aqui-mude-em-producao")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

# Configurações da Base de Dados
# PostgreSQL do Railway (interno) ou Supabase (público)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:wSWYpISACPeNCDjTwuiYcuCsQUQFWxRe@postgres.railway.internal:5432/railway")

# Configurações de CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,https://crm-fotovoltaicas.railway.app,https://jzezbecvjquqxjnilvya.supabase.co").split(',')
# Regex opcional para permitir domínios dinâmicos (ex.: qualquer subdomínio do Railway)
# Exemplo de uso em produção temporária: ALLOWED_ORIGIN_REGEX="^https://.*\\.railway\\.app$"
ALLOWED_ORIGIN_REGEX = os.getenv("ALLOWED_ORIGIN_REGEX")  # None por padrão se não definido

# --- CONFIGURAÇÕES DE NEGÓCIO ---
COMISSAO_PERCENTAGEM = float(os.getenv("COMISSAO_PERCENTAGEM", "0.05"))  # 5%
IVA_TAXA = float(os.getenv("IVA_TAXA", "0.23"))  # 23%

# --- CONFIGURAÇÕES DE GOOGLE CALENDAR ---
# Nunca coloque credenciais reais no código. Deixe vazio por padrão e use variáveis de ambiente.
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
# URL de callback para OAuth (defina no ambiente do Railway)
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "")
SCOPES = ["https://www.googleapis.com/auth/calendar.events"]

# --- CONFIGURAÇÕES DE CLOUDINARY ---
# Defina estas chaves apenas por variáveis de ambiente em produção.
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "")
