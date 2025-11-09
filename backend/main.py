# backend/main.py

from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager

# Carregar variáveis de ambiente do .env
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

print("🚀 Iniciando CRM API...")
print(f"DATABASE_URL: {os.getenv('DATABASE_URL', 'NÃO CONFIGURADO')[:50]}...")

# Configurar CORS com as origens explícitas
ALLOWED_ORIGINS = [
    "https://insightful-light-production.up.railway.app",  # Frontend
    "http://localhost:3000",  # Dev local
    "https://crm-vendas-fotovoltaicas-production.up.railway.app",  # Backend
]

# Middleware que GARANTE headers CORS corretos sobrescrevendo qualquer outro
class ForceCorrectCORSMiddleware(BaseHTTPMiddleware):
    """
    Este middleware SEMPRE sobrescreve os headers CORS na resposta final,
    garantindo que o Railway proxy não injete headers incorretos.
    """
    async def dispatch(self, request: Request, call_next):
        # Capturar a origem da requisição
        origin = request.headers.get("origin", "")
        
        # Se for uma requisição OPTIONS (preflight), responder imediatamente
        if request.method == "OPTIONS":
            response = Response(status_code=200)
            if origin in ALLOWED_ORIGINS:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Credentials"] = "true"
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
                response.headers["Access-Control-Allow-Headers"] = "*"
                response.headers["Access-Control-Max-Age"] = "3600"
            return response
        
        # Processar a requisição normalmente
        response = await call_next(request)
        
        # FORÇAR headers CORS corretos SEMPRE (última palavra)
        if origin in ALLOWED_ORIGINS:
            # Remover qualquer header CORS existente
            if "access-control-allow-origin" in response.headers:
                del response.headers["access-control-allow-origin"]
            if "Access-Control-Allow-Origin" in response.headers:
                del response.headers["Access-Control-Allow-Origin"]
            
            # Adicionar os headers corretos
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "*"
        
        return response

# Gerenciador de ciclo de vida com lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Conectando e inicializando o banco de dados...")
    from app.database import init_db
    init_db()
    yield
    # Shutdown (se necessário)
    print("Encerrando aplicação...")

app = FastAPI(
    title="CRM Vendas Fotovoltaicas API",
    description="API para gestão de leads, vendas e métricas.",
    version="1.0.0",
    lifespan=lifespan
)

# IMPORTANTE: Adicionar nosso middleware PRIMEIRO (ele será executado por ÚLTIMO na resposta)
app.add_middleware(ForceCorrectCORSMiddleware)

# Incluir Rotas
from routes import leads, auth, upload
from routes import calendar as calendar_routes

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
