# Guia de Instalação Rápida

## ⚡ Instalação em 5 Minutos

### Windows 11 Pro + VS Code

#### 1. Backend (Python)

1. **Abrir PowerShell no VS Code:**
   - Pressione `Ctrl + ~`

2. **Navegar para a pasta backend:**
   ```powershell
   cd backend
   ```

3. **Criar ambiente virtual:**
   ```powershell
   python -m venv venv
   ```

4. **Ativar ambiente virtual:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

5. **Instalar dependências:**
   ```powershell
   pip install -r requirements.txt
   ```

6. **Executar servidor:**
   ```powershell
   python main.py
   ```

   ✅ Backend em execução em `http://localhost:8000`

#### 2. Frontend (Next.js)

1. **Abrir novo terminal no VS Code:**
   - Pressione `Ctrl + Shift + ~`

2. **Navegar para a pasta frontend:**
   ```powershell
   cd frontend
   ```

3. **Instalar dependências:**
   ```powershell
   npm install
   ```

4. **Executar servidor de desenvolvimento:**
   ```powershell
   npm run dev
   ```

   ✅ Frontend em execução em `http://localhost:3000`

### macOS/Linux

#### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

#### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🌐 Acesso

### Local
- **Dashboard**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Telemóvel (mesma rede)
- **Dashboard**: http://192.168.1.185:3000

## ✅ Verificação

1. **Abrir o dashboard:**
   - Visite http://localhost:3000
   - Deverá ver o dashboard com as métricas

2. **Testar API:**
   ```bash
   curl http://localhost:8000/health
   ```

   Resposta esperada:
   ```json
   {"status": "ok", "message": "CRM API está funcionando"}
   ```

## 🚀 Próximos Passos

1. **Migrar dados antigos** (ver `MIGRACAO_DADOS.md`)
2. **Personalizar configurações** (ver `CONFIGURACAO.md`)
3. **Treinar utilizadores** (ver `TUTORIAL.md`)

## 🆘 Problemas Comuns

### Erro: "Port already in use"
A porta já está em uso. Altere em `main.py` (backend) ou `next.config.js` (frontend).

### Erro: "ModuleNotFoundError"
Certifique-se que o ambiente virtual está ativado.

### Erro: "CORS error"
Verifique `ALLOWED_ORIGINS` em `backend/config/settings.py`.

## 📞 Suporte

Para mais ajuda, consulte a documentação completa em `README.md`.

