#!/bin/bash

# Script de inicialização do CRM Vendas Fotovoltaicas
# Para macOS/Linux

clear

echo "============================================"
echo "  CRM Vendas Fotovoltaicas"
echo "  Sistema de Gestao de Vendas"
echo "============================================"
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ ERRO: Python3 não está instalado!"
    echo "Instale em: https://www.python.org/downloads/"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ ERRO: Node.js não está instalado!"
    echo "Instale em: https://nodejs.org/"
    exit 1
fi

echo "✓ Python detectado: $(python3 --version)"
echo "✓ Node.js detectado: $(node --version)"
echo ""

# Criar pasta data se não existir
mkdir -p data

# Inicializar Backend
echo ""
echo "============================================"
echo "  Iniciando Backend (FastAPI)"
echo "============================================"
echo ""

cd backend

# Criar ambiente virtual se não existir
if [ ! -d "venv" ]; then
    echo "Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativar ambiente virtual
source venv/bin/activate

# Instalar dependências
echo "Instalando dependências Python..."
pip install -r requirements.txt -q

# Iniciar servidor backend em background
echo ""
echo "Backend iniciando em http://localhost:8000"
echo "Documentação da API: http://localhost:8000/docs"
echo ""
python main.py &
BACKEND_PID=$!

# Aguardar um pouco para o backend iniciar
sleep 3

# Inicializar Frontend
echo ""
echo "============================================"
echo "  Iniciando Frontend (Next.js)"
echo "============================================"
echo ""

cd ../frontend

# Instalar dependências se node_modules não existir
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências Node.js..."
    npm install
fi

# Iniciar servidor frontend
echo ""
echo "Frontend iniciando em http://localhost:3000"
echo ""
npm run dev

# Cleanup ao sair
trap "kill $BACKEND_PID" EXIT

