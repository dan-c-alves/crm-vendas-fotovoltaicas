@echo off
REM Script para parar todos os serviços do CRM

echo ============================================
echo   PARANDO CRM VENDAS FOTOVOLTAICAS
echo ============================================
echo.

echo Parando servidor backend (Python)...
taskkill /F /IM python.exe /T >nul 2>&1

echo Parando servidor frontend (Node.js)...
taskkill /F /IM node.exe /T >nul 2>&1

echo Aguardando processos terminarem...
timeout /t 3 /nobreak >nul

echo.
echo ============================================
echo   SERVIÇOS PARADOS
echo ============================================
echo.
echo Todos os serviços do CRM foram parados.
echo.
echo Para reiniciar, execute: INICIAR.bat
echo.

pause