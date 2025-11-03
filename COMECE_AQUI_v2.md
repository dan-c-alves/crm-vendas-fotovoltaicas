# 🚀 GUIA RÁPIDO - Como Começar

## 📋 Pré-requisitos Instalados

- ✅ Python 3.9+
- ✅ Node.js 18+
- ✅ PostgreSQL (Railway/Supabase)

---

## 🏃 Início Rápido (Desenvolvimento Local)

### 1️⃣ Backend

```powershell
# Navegar para backend
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual (Windows PowerShell)
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Testar conexão com PostgreSQL
python scripts\test_db_connection.py

# Se a tabela 'tarefa_concluida' não existir, executar:
python scripts\add_tarefa_concluida_column.py

# Iniciar servidor backend
python main.py
```

✅ Backend rodando em: **http://localhost:8000**

---

### 2️⃣ Frontend

Abra um **novo terminal PowerShell**:

```powershell
# Navegar para frontend
cd frontend

# Instalar dependências
npm install

# Configurar variável de ambiente (temporário)
$env:NEXT_PUBLIC_API_URL="http://localhost:8000"

# Iniciar servidor Next.js
npm run dev
```

✅ Frontend rodando em: **http://localhost:3000**

---

## 🔧 Configuração Google Calendar (Opcional, mas Recomendado)

### Passo 1: Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Crie novo projeto: "CRM Vendas Fotovoltaicas"
3. Ative a API: **Google Calendar API**
4. Vá em **"APIs & Services" → "OAuth consent screen"**:
   - User Type: **External**
   - App name: **CRM Vendas Fotovoltaicas**
   - User support email: **seu@email.com**
   - Scopes: Adicione `https://www.googleapis.com/auth/calendar.events`
5. Vá em **"Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"**:
   - Application type: **Web application**
   - Name: **CRM Backend**
   - Authorized redirect URIs: `http://localhost:8000/api/auth/google/callback`
6. **Copie** o `CLIENT_ID` e `CLIENT_SECRET`

### Passo 2: Atualizar backend/config/settings.py

Edite o arquivo `backend/config/settings.py` e substitua:

```python
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "SEU_CLIENT_ID_AQUI")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "SEU_CLIENT_SECRET_AQUI")
```

Por:

```python
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "cole_seu_client_id_aqui")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "cole_seu_client_secret_aqui")
```

### Passo 3: Testar Integração

1. Acesse: http://localhost:3000/settings
2. Clique em **"Conectar Google Calendar"**
3. Autorize a aplicação
4. Deve voltar para `/settings` com mensagem **"Conectado!"**

---

## 🧪 Testar Sistema de Tarefas

1. **Criar Lead com Data**:
   - Vá em: http://localhost:3000/leads
   - Clique "Adicionar Lead"
   - Preencha nome, telefone
   - **Defina "Próxima Ação"** com data/hora (ex: amanhã às 14:00)
   - Salve

2. **Ver Tarefa**:
   - Vá em: http://localhost:3000/tarefas
   - O lead deve aparecer na lista

3. **Google Calendar** (se configurado):
   - Abra Google Calendar
   - Deve ter um evento "FOLLOW-UP: [Nome do Lead]"

4. **Marcar como Concluída**:
   - Em /tarefas, clique no botão ✅ "Concluído"
   - Tarefa desaparece da lista
   - Evento é removido do Google Calendar

---

## 🌐 Deploy para Produção (Railway)

Siga o guia completo em: **`RAILWAY_DEPLOY.md`**

Resumo rápido:

1. Conecte GitHub ao Railway
2. Crie 2 serviços: **Backend (Python)** e **Frontend (Next.js)**
3. Configure variáveis de ambiente (ver `RAILWAY_DEPLOY.md`)
4. Deploy automático
5. Execute migração: `python backend/scripts/add_tarefa_concluida_column.py`
6. Configure Google Calendar com URL de produção

---

## 📁 Estrutura do Projeto

```
crm-vendas-fotovoltaicas/
├── backend/
│   ├── main.py              # ← Inicia FastAPI
│   ├── requirements.txt     # ← Dependências Python
│   ├── app/
│   │   └── database.py      # ← Conexão PostgreSQL
│   ├── config/
│   │   └── settings.py      # ← Variáveis de ambiente
│   ├── models/
│   │   ├── lead.py          # ← Modelo Lead (com tarefa_concluida)
│   │   └── user.py          # ← Modelo User (token Google)
│   ├── routes/
│   │   ├── leads.py         # ← Endpoints leads + Google Calendar
│   │   └── auth.py          # ← OAuth Google Calendar
│   └── scripts/
│       ├── test_db_connection.py         # ← Testar PostgreSQL
│       └── add_tarefa_concluida_column.py # ← Migração
│
├── frontend/
│   ├── package.json
│   └── src/
│       ├── app/
│       │   ├── page.tsx           # ← Dashboard
│       │   ├── leads/page.tsx     # ← Gestão Leads
│       │   ├── tarefas/page.tsx   # ← Lista Tarefas ✨
│       │   └── settings/page.tsx  # ← Conectar Google ✨
│       └── components/
│           └── Sidebar.tsx        # ← Menu (sem Vendas)
│
├── RAILWAY_DEPLOY.md              # ← Guia deploy produção
├── IMPLEMENTACAO_SISTEMA_TAREFAS.md # ← Documentação completa
└── .github/
    └── copilot-instructions.md    # ← Instruções para AI
```

---

## 🐛 Troubleshooting Rápido

### Backend não inicia

```powershell
# Verificar se todas as dependências estão instaladas
pip install -r requirements.txt

# Testar conexão com banco
python scripts\test_db_connection.py
```

### Frontend não conecta ao backend

```powershell
# Certificar que variável está definida
$env:NEXT_PUBLIC_API_URL="http://localhost:8000"

# Reiniciar Next.js
npm run dev
```

### Tarefas não aparecem

```powershell
# Executar migration
cd backend
python scripts\add_tarefa_concluida_column.py
```

---

## 📞 Comandos Úteis

```powershell
# Backend - Ativar ambiente virtual
cd backend; venv\Scripts\activate

# Backend - Ver logs
python main.py

# Frontend - Dev mode
cd frontend; npm run dev

# Frontend - Build produção
cd frontend; npm run build

# Testar PostgreSQL
cd backend; python scripts\test_db_connection.py
```

---

## ✅ Checklist de Verificação

- [ ] Backend rodando em http://localhost:8000
- [ ] Frontend rodando em http://localhost:3000
- [ ] PostgreSQL conectado (teste com `test_db_connection.py`)
- [ ] Campo `tarefa_concluida` existe na tabela `leads`
- [ ] Google Calendar configurado (opcional)
- [ ] Consegue criar lead com data
- [ ] Lead aparece em /tarefas
- [ ] Consegue marcar tarefa como concluída

---

**🎉 Pronto! Sistema funcionando!**

Para deploy em produção, consulte: `RAILWAY_DEPLOY.md`
