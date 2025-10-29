# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from routes import leads, auth, upload
from config.settings import ALLOWED_ORIGINS

print("🚀 Iniciando CRM API...")

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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir Rotas
app.include_router(leads.router)
app.include_router(auth.router)
app.include_router(upload.router)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à CRM Vendas Fotovoltaicas API"}
