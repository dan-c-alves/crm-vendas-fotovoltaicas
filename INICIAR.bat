@echo off
REM Script de inicialização do CRM Vendas Fotovoltaicas
REM Para Windows 11 Pro

cls
echo ============================================
echo   CRM Vendas Fotovoltaicas
echo   Sistema de Gestao de Vendas
echo ============================================
echo.

REM Limpar processos anteriores
echo Parando processos anteriores...
taskkill /F /IM python.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao esta instalado!
    echo Baixe em: https://www.python.org/downloads/
    pause
    exit /b 1
 )

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao esta instalado!
    echo Baixe em: https://nodejs.org/
    pause
    exit /b 1
 )

echo ✓ Python detectado
echo ✓ Node.js detectado
echo.

REM Criar pasta data se nao existir
if not exist "data" mkdir data

REM Inicializar Backend
echo.
echo ============================================
echo   Iniciando Backend (FastAPI)
echo ============================================
echo.

cd backend

REM Criar ambiente virtual se nao existir
if not exist "venv" (
    echo Criando ambiente virtual...
    python -m venv venv
)

REM Ativar ambiente virtual
call venv\Scripts\activate.bat

REM Instalar dependências
echo Instalando dependências Python...
pip install -r requirements.txt -q

REM Iniciar servidor backend
echo.
echo Backend iniciando em http://localhost:8000
echo Documentacao da API: http://localhost:8000/docs
echo.
start cmd /k "call venv\Scripts\activate.bat && uvicorn main:app --reload --host 127.0.0.1 --port 8000"

REM Aguardar um pouco para o backend iniciar
timeout /t 3 /nobreak

REM Inicializar Frontend
echo.
echo ============================================
echo   Iniciando Frontend (Next.js )
echo ============================================
echo.

cd ..\frontend

REM Instalar dependências se node_modules nao existir
if not exist "node_modules" (
    echo Instalando dependências Node.js...
    call npm install
)

REM Iniciar servidor frontend
echo.
echo Frontend iniciando em http://localhost:3000

echo.
start cmd /k "npm run dev -- --port 3000"

REM Aguardar um pouco para o frontend iniciar
timeout /t 5 /nobreak

REM Abrir o navegador automaticamente
echo.
echo Abrindo o navegador...
start http://localhost:3000

echo.
echo ============================================
echo   CRM VENDAS FOTOVOLTAICAS INICIADO!
echo ============================================
echo.
echo ✓ Backend: http://localhost:8000
echo ✓ Frontend: http://localhost:3000
echo ✓ API Docs: http://localhost:8000/docs
echo.
echo.

pause
