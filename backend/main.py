# backend/main.py

from dotenv import load_dotenv
import os

# Carregar variáveis de ambiente do .env
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from routes import leads, auth, upload
from routes import calendar as calendar_routes
from config.settings import ALLOWED_ORIGINS, ALLOWED_ORIGIN_REGEX

print("🚀 Iniciando CRM API...")
print(f"DATABASE_URL: {os.getenv('DATABASE_URL', 'NÃO CONFIGURADO')[:50]}...")

# Inicializar a base de dados
init_db()

app = FastAPI(
    title="CRM Vendas Fotovoltaicas API",
    description="API para gestão de leads, vendas e métricas.",
    version="1.0.0",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir Rotas
app.include_router(leads.router)
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(calendar_routes.router)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à CRM Vendas Fotovoltaicas API"}

# Endpoint de healthcheck para deploy (Railway)
@app.get("/health")
def healthcheck():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
