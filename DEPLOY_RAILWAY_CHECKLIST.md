# ✅ Checklist de Deploy - Railway + Supabase + Google OAuth

**Data:** 5 de novembro de 2025  
**Status:** ✅ Código validado e pronto para produção

---

## 📋 Resumo da Validação

### ✅ Testes Realizados (Localmente)
- [x] **Sintaxe Python:** Sem erros em `main.py`, `models/`, `routes/`, `config/`
- [x] **Importações:** Todas as dependências resolvidas (dotenv, bcrypt, jwt, pytz)
- [x] **Variáveis de ambiente:** `.env` configurado corretamente
- [x] **Estrutura do banco:** Models `User` e `Lead` com campos OAuth prontos
- [x] **CORS:** Configurado para Railway e localhost
- [x] **Git:** Código sincronizado com GitHub (branch `main`)

---

## 🚀 Deploy no Railway (Backend FastAPI)

### 1. Configurar Variáveis de Ambiente no Railway

Acesse o painel do Railway e adicione as seguintes variáveis de ambiente:

```env
# Banco de Dados (Supabase)
DATABASE_URL=<sua-connection-string-supabase>

# CORS (adicione o domínio do frontend em produção)
ALLOWED_ORIGINS=https://insightful-light-production.up.railway.app,https://<seu-frontend-url>
ALLOWED_ORIGIN_REGEX=^https://.*\.railway\.app$

# Segurança
SECRET_KEY=<gere-uma-chave-secreta-forte-para-producao>
DEBUG=False

# Negócio
COMISSAO_PERCENTAGEM=0.05
IVA_TAXA=0.23

# Google OAuth
GOOGLE_CLIENT_ID=<seu-google-client-id>
GOOGLE_CLIENT_SECRET=<seu-google-client-secret>
GOOGLE_REDIRECT_URI=https://insightful-light-production.up.railway.app/api/auth/google/callback

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 2. Confirmar Deploy Automático

- O Railway detecta automaticamente o `main.py` e executa `python main.py`.
- Após fazer push para `main`, o deploy é acionado automaticamente.
- Verifique os logs do Railway para confirmar que o servidor está rodando sem erros.

### 3. Testar Endpoints

Após o deploy, acesse:

- **Docs da API:** `https://insightful-light-production.up.railway.app/docs`
- **Healthcheck:** `https://insightful-light-production.up.railway.app/health`
- **Login Google:** `https://insightful-light-production.up.railway.app/api/auth/login`

---

## 🗄️ Banco de Dados (Supabase)

### 1. Confirmar Migração de Tabelas

As tabelas `users` e `leads` devem ter os seguintes campos:

**Tabela `users`:**
- `id`, `email`, `nome`, `password_hash`
- `google_id`, `google_access_token`, `google_refresh_token`
- `google_calendar_token` (legacy)
- `data_criacao`, `data_atualizacao`

**Tabela `leads`:**
- Campos padrão (nome, email, telefone, status, valores, comissão)
- `url_imagem_cliente`, `google_event_id`, `tarefa_concluida`
- `ativo` (soft delete)

### 2. Executar Migrações (se necessário)

Se as colunas OAuth não existirem, rode localmente:

```bash
cd backend
python scripts/add_google_oauth_columns.py
```

---

## 🔐 Google Cloud Console (OAuth)

### 1. Configurar URIs Autorizadas

No Google Cloud Console (APIs & Services > Credentials > OAuth 2.0 Client):

**Origens JavaScript autorizadas:**
```
https://insightful-light-production.up.railway.app
```

**URIs de redirecionamento autorizadas:**
```
https://insightful-light-production.up.railway.app/api/auth/google/callback
```

### 2. Confirmar Credenciais

- Client ID e Client Secret devem estar configurados nas variáveis de ambiente do Railway
- Não commite credenciais no código (use variáveis de ambiente)

---

## 🌐 Frontend (Next.js)

### 1. Configurar Variável de Ambiente

No painel do seu provedor de frontend (Vercel, Railway, etc.):

```env
NEXT_PUBLIC_API_URL=https://insightful-light-production.up.railway.app
```

### 2. Rebuild e Deploy

Após configurar a variável, faça rebuild do frontend para que a API URL seja atualizada.

---

## 🧪 Testes Finais em Produção

### 1. Testar Login Google

1. Acesse o frontend em produção
2. Clique em "Login com Google"
3. Autorize a aplicação
4. Verifique se você é redirecionado corretamente e o usuário é criado no banco

### 2. Testar API de Leads

```bash
curl https://insightful-light-production.up.railway.app/api/leads
```

### 3. Verificar Logs

- **Railway:** Logs do backend para erros de CORS, autenticação ou banco
- **Supabase:** Logs de queries para verificar operações no banco

---

## 📝 Notas Importantes

- **Segurança:** Troque `SECRET_KEY` por uma chave forte em produção.
- **CORS:** Adicione apenas domínios confiáveis em `ALLOWED_ORIGINS`.
- **Banco:** O `DATABASE_URL` do Supabase é público mas requer autenticação.
- **OAuth:** Mantenha `GOOGLE_CLIENT_SECRET` privado (não commite no Git).

---

## ✅ Status Atual

- [x] Código validado sem erros
- [x] Git sincronizado com GitHub
- [x] `.env` configurado localmente
- [ ] Variáveis configuradas no Railway (aguardando ação manual)
- [ ] Deploy testado em produção (aguardando configuração)
- [ ] Login Google testado em produção (aguardando configuração)

---

**Próximos Passos:**
1. Configure as variáveis de ambiente no Railway (seção 1 acima)
2. Aguarde o deploy automático terminar
3. Teste os endpoints e o login Google
4. Reporte qualquer erro para ajuste

Se encontrar erros durante o deploy, verifique:
- Logs do Railway para erros de Python
- Variáveis de ambiente (typos ou valores incorretos)
- Configuração do Google OAuth (URIs corretas)
