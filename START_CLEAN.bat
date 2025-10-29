@echo off
REM Script simplificado para iniciar CRM sem conflitos

cls
echo ============================================
echo   INICIANDO CRM VENDAS FOTOVOLTAICAS
echo ============================================
echo.

REM Parar todos os processos
echo Parando processos anteriores...
taskkill /F /IM python.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 3 /nobreak >nul

REM Ir para backend e iniciar
echo Iniciando Backend...
cd backend
start cmd /k "call venv\Scripts\activate.bat && python main.py"
timeout /t 5 /nobreak

REM Ir para frontend e iniciar
echo Iniciando Frontend...
cd ..\frontend
start cmd /k "npm run dev"

echo.
echo ============================================
echo   SERVIDORES INICIADOS!
echo ============================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3001 (ou 3000)
echo.
echo Aguarde alguns segundos e acesse o frontend
echo.

pause