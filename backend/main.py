# backend/main.py

from dotenv import load_dotenv
import os

# Carregar variáveis de ambiente do .env
load_dotenv()

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.database import init_db
from routes import leads, auth, upload
from routes import calendar as calendar_routes
from config.settings import ALLOWED_ORIGINS, ALLOWED_ORIGIN_REGEX

print("🚀 Iniciando CRM API...")
print(f"DATABASE_URL: {os.getenv('DATABASE_URL', 'NÃO CONFIGURADO')[:50]}...")
print(f"CORS allow_origins: {ALLOWED_ORIGINS}")
print(f"CORS allow_origin_regex: {ALLOWED_ORIGIN_REGEX}")
print(f"⚠️  IMPORTANTE: Certifique-se de que o frontend está em ALLOWED_ORIGINS!")

# Inicializar a base de dados
init_db()

app = FastAPI(
    title="CRM Vendas Fotovoltaicas API",
    description="API para gestão de leads, vendas e métricas.",
    version="1.0.0",
)

# Middleware customizado para FORÇAR CORS correto (sobrescreve headers do Railway)
class ForceCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin", "")

        # Verificar se a origem está na lista permitida
        allowed = False
        if origin:
            # Check exact match
            if origin in ALLOWED_ORIGINS:
                allowed = True
            # Check regex match (qualquer .railway.app)
            if not allowed and ALLOWED_ORIGIN_REGEX:
                import re
                if re.match(ALLOWED_ORIGIN_REGEX, origin):
                    allowed = True

        # Tratar preflight OPTIONS imediatamente (antes de atingir handlers)
        if request.method == "OPTIONS":
            if allowed:
                print(f"✅ CORS (preflight) permitido para: {origin}")
                return Response(
                    status_code=200,
                    headers={
                        "Access-Control-Allow-Origin": origin,
                        "Access-Control-Allow-Credentials": "true",
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Origin, X-Requested-With",
                        "Access-Control-Max-Age": "3600",
                    },
                )
            print(f"⚠️  CORS (preflight) bloqueado para: {origin}")
            return Response(status_code=403)

        # Requisições normais seguem para o próximo handler
        response = await call_next(request)

        # FORÇAR headers CORS corretos (sobrescreve qualquer header do Railway)
        if allowed:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept, Origin, X-Requested-With"
            response.headers["Access-Control-Max-Age"] = "3600"
            print(f"✅ CORS permitido para: {origin}")
        else:
            if origin:
                print(f"⚠️  CORS bloqueado para: {origin}")

        return response

# Adicionar middleware customizado PRIMEIRO (para sobrescrever Railway)
app.add_middleware(ForceCORSMiddleware)

# Configurar CORS padrão do FastAPI (backup)
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

# Handler global para OPTIONS (preflight CORS)
@app.options("/{full_path:path}")
async def options_handler(request: Request):
    """Handler para requisições OPTIONS (CORS preflight)"""
    origin = request.headers.get("origin", "")
    
    # Verificar se origem é permitida
    allowed = origin in ALLOWED_ORIGINS
    
    if not allowed and ALLOWED_ORIGIN_REGEX:
        import re
        allowed = bool(re.match(ALLOWED_ORIGIN_REGEX, origin))
    
    if allowed:
        return Response(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Origin, X-Requested-With",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Max-Age": "3600",
            }
        )
    
    return Response(status_code=403)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
