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
# Remova a importação de config.settings se ela contiver ALLOWED_ORIGINS/REGEX

print("🚀 Iniciando CRM API...")
print(f"DATABASE_URL: {os.getenv('DATABASE_URL', 'NÃO CONFIGURADO')[:50]}...")

app = FastAPI(
    title="CRM Vendas Fotovoltaicas API",
    description="API para gestão de leads, vendas e métricas.",
    version="1.0.0",
)

# Inicializar a base de dados como evento de startup
@app.on_event("startup")
def on_startup():
    print("Conectando e inicializando o banco de dados...")
    init_db()

# Configurar CORS com as origens explícitas
origins = [
    "https://insightful-light-production.up.railway.app", # O seu Frontend
    "http://localhost:3000", # Desenvolvimento local
    "https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app", # O seu próprio Backend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

@app.get("/health")
def healthcheck():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
