# Variáveis de Ambiente - Railway (Backend)

## Copie e cole estas variáveis na seção "Variables" do Railway

```env
# Database (PostgreSQL Railway - interno)
DATABASE_URL=postgresql://postgres:wSWYpISACPeNCDjTwuiYcuCsQUQFWxRe@postgres.railway.internal:5432/railway

# CORS (adicione os domínios do frontend)
ALLOWED_ORIGINS=http://localhost:3000,https://crm-fotovoltaicas.railway.app,https://jzezbecvjquqxjnilvya.supabase.co

# Segurança
SECRET_KEY=your-super-secret-key-change-this-in-production
DEBUG=False

# Comissão e IVA
COMISSAO_PERCENTAGEM=0.05
IVA_TAXA=0.23

# Google Calendar (IMPORTANTE: Configure no Google Cloud Console)
GOOGLE_CLIENT_ID=SEU_CLIENT_ID_AQUI
GOOGLE_CLIENT_SECRET=SEU_CLIENT_SECRET_AQUI
GOOGLE_REDIRECT_URI=https://crm-fotovoltaicas.railway.app/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=ds9rww3yk
CLOUDINARY_API_KEY=285935917929754
CLOUDINARY_API_SECRET=XXRqnnq8mL_NRCd4l9vaDqP3ELA
```

---

## Variáveis de Ambiente - Frontend (Next.js)

```env
# Supabase (novas chaves "publishable")
NEXT_PUBLIC_SUPABASE_URL=https://jzezbecvjquqxjnilvya.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_KIe4WPCL9_rW0zbr7yvj1A_LmS5pANL

# API URL (Backend Railway)
NEXT_PUBLIC_API_URL=https://crm-fotovoltaicas.railway.app

# Node Environment
NODE_ENV=production

# Porta (opcional, Railway gerencia automaticamente)
PORT=3000
```

---

## Como Configurar Google Calendar OAuth

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto (ou use existente)
3. Ative a API "Google Calendar API"
4. Configure OAuth Consent Screen:
   - User Type: External
   - App name: CRM Vendas Fotovoltaicas
   - User support email: seu@email.com
   - Scopes: `https://www.googleapis.com/auth/calendar.events`
5. Crie credenciais OAuth 2.0:
   - Application type: Web application
   - Name: CRM Backend
   - Authorized redirect URIs: `https://crm-fotovoltaicas.railway.app/api/auth/google/callback`
6. Copie CLIENT_ID e CLIENT_SECRET
7. Cole nas variáveis de ambiente do Railway

---

## Passos para Deploy

### Backend (Railway)

1. Conectar repositório GitHub ao Railway
2. Selecionar serviço: Backend Python
3. Adicionar variáveis de ambiente acima
4. Railway detecta automaticamente `requirements.txt`
5. Build command: `pip install -r requirements.txt`
6. Start command: `python main.py` ou `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel/Railway)

1. Conectar repositório GitHub
2. Selecionar pasta: `frontend/`
3. Framework: Next.js
4. Adicionar variáveis de ambiente
5. Build command: `npm run build`
6. Output directory: `.next`

### Migração do Banco de Dados

Após deploy do backend, execute:

```bash
# Conectar via Railway CLI ou pela interface web
python backend/scripts/add_tarefa_concluida_column.py
```

---

## Testando a Integração Google Calendar

1. Acesse: https://SEU-FRONTEND.railway.app/settings
2. Clique em "Conectar Google Calendar"
3. Autorize a aplicação
4. Crie um lead com data/hora agendada
5. Verifique se aparece no Google Calendar do telemóvel

---

## Troubleshooting

### Erro de CORS
- Adicione o domínio correto em `ALLOWED_ORIGINS`

### Google Calendar não sincroniza
- Verifique se o token foi salvo (`users` tabela)
- Confira se CLIENT_ID e CLIENT_SECRET estão corretos
- Verifique logs do Railway para erros de API

### Database connection failed
- Confirme DATABASE_URL está correto
- Railway pode ter regenerado credenciais - verifique na aba "Variables" do Postgres

---

## URLs Importantes

- Backend API: https://crm-fotovoltaicas.railway.app
- Frontend: https://SEU-FRONTEND.railway.app
- Google Cloud Console: https://console.cloud.google.com
- Railway Dashboard: https://railway.app/dashboard
