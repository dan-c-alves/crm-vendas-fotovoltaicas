# 🔍 DIAGNÓSTICO COMPLETO - Análise de Configurações Google OAuth

## 📊 ANÁLISE DAS SUAS CONFIGURAÇÕES (baseado nas imagens)

### ✅ Origens JavaScript Autorizadas - CORRETAS
```
✅ https://crm-vendas-fotovoltaicas-production.up.railway.app
✅ https://insightful-light-production.up.railway.app  
✅ http://localhost:3000
```

**Função**: Permite que o frontend inicie a requisição OAuth
**Relação com portas**: 
- Port 3000 = Frontend Next.js rodando localmente
- Railway apps = Frontend/Backend em produção

---

## ❗ PROBLEMA IDENTIFICADO

### 🔴 Confusão entre Frontend e Backend

Você está confundindo:

#### Frontend (Next.js) - Porta 3000
- **Local**: `http://localhost:3000`
- **Produção**: `https://insightful-light-production.up.railway.app`
- **Função**: Interface do usuário (onde você acessa)

#### Backend (FastAPI) - Porta 8000  
- **Local**: `http://localhost:8000`
- **Produção**: `https://crm-vendas-fotovoltaicas-production.up.railway.app`
- **Função**: API que processa o OAuth

---

## 🎯 O FLUXO CORRETO DO OAUTH

```
1. USUÁRIO acessa Frontend (porta 3000)
   ↓
2. Clica em "Conectar Google Calendar"
   ↓
3. Frontend redireciona para: Backend/api/auth/google/login (porta 8000)
   ↓
4. Backend redireciona para: Google OAuth
   ↓
5. Usuário autoriza no Google
   ↓
6. Google redireciona PARA O BACKEND: /api/auth/google/callback (porta 8000)
   ↓
7. Backend processa e redireciona PARA O FRONTEND com token (porta 3000)
```

---

## ✅ CONFIGURAÇÃO CORRETA

### Origens JavaScript (já está correto):
```
✅ Frontend produção: https://insightful-light-production.up.railway.app
✅ Backend produção:  https://crm-vendas-fotovoltaicas-production.up.railway.app
✅ Frontend local:    http://localhost:3000
```

### URIs de Redirecionamento (DEVE SER O BACKEND):
```
✅ https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback
✅ http://localhost:8000/api/auth/google/callback
```

**ATENÇÃO**: O callback SEMPRE vai para o BACKEND (porta 8000), NÃO para o frontend (porta 3000)!

---

## 🚨 ERRO COMUM

### ❌ ERRADO - Callback para Frontend:
```
❌ https://insightful-light-production.up.railway.app/api/auth/google/callback
❌ http://localhost:3000/api/auth/google/callback
```

### ✅ CORRETO - Callback para Backend:
```
✅ https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback
✅ http://localhost:8000/api/auth/google/callback
```

---

## 📝 VARIÁVEIS DO RAILWAY - Backend Service

No Railway, serviço **backend**, configure:

```bash
# Google OAuth - BACKEND
GOOGLE_CLIENT_ID=668333374251-9tejkukncp1d320g51jtu4h7hqr9tvd.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<SEU_SECRET_AQUI>

# Callback vai PARA O BACKEND (porta 8000 em produção)
GOOGLE_REDIRECT_URI=https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback

# Depois do callback, backend redireciona PARA O FRONTEND (porta 3000)
FRONTEND_URL=https://insightful-light-production.up.railway.app

# Database
DATABASE_URL=<sua_connection_string_supabase>

# Segurança
SECRET_KEY=<chave_aleatoria>
```

---

## 🧪 TESTE PASSO A PASSO

### 1. Verificar configuração do backend

Abra no navegador:
```
https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/test-config
```

**Resposta esperada**:
```json
{
  "google_client_id": "668333374251-9tejkuk...",
  "google_client_secret": "SET",
  "redirect_uri": "https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback",
  "frontend_url": "https://insightful-light-production.up.railway.app",
  "scopes": [...]
}
```

**Se aparecer diferente**: variáveis não configuradas no Railway!

### 2. Testar o fluxo OAuth

1. Acesse: `https://insightful-light-production.up.railway.app/settings`
2. Clique: **"Conectar Google Calendar"**
3. URL deve mudar para: `https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/login`
4. Depois redireciona para: `https://accounts.google.com/o/oauth2/auth?...`
5. Após autorizar, volta para: `https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback?code=...`
6. Por fim, redireciona para: `https://insightful-light-production.up.railway.app/?token=...`

### 3. Se der erro "redirect_uri_mismatch"

**Significa**: O URI que o backend está usando NÃO está no Google Cloud Console

**Causa comum**:
- Backend está usando: `https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback`
- Google Cloud tem: `https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/` (FALTA /google/callback)

**Solução**: Adicionar `/google/callback` no final do URI no Google Cloud Console

---

## 📋 CHECKLIST DE VERIFICAÇÃO

### Google Cloud Console:
- [ ] APIs ativadas (Calendar + People)
- [ ] Test user adicionado: danilocalves86@gmail.com
- [ ] Origens JavaScript incluem:
  - [ ] `https://crm-vendas-fotovoltaicas-production.up.railway.app`
  - [ ] `https://insightful-light-production.up.railway.app`
  - [ ] `http://localhost:3000`
- [ ] URIs de redirecionamento incluem:
  - [ ] `https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback`
  - [ ] `http://localhost:8000/api/auth/google/callback`

### Railway - Backend Service:
- [ ] `GOOGLE_CLIENT_ID` configurado
- [ ] `GOOGLE_CLIENT_SECRET` configurado  
- [ ] `GOOGLE_REDIRECT_URI` = `https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback`
- [ ] `FRONTEND_URL` = `https://insightful-light-production.up.railway.app`
- [ ] `DATABASE_URL` configurado
- [ ] `SECRET_KEY` configurado
- [ ] Serviço fez redeploy após adicionar variáveis

### Testes:
- [ ] `/api/auth/google/test-config` retorna configurações corretas
- [ ] Clicar em "Conectar Google Calendar" redireciona para Google
- [ ] Após autorizar, volta para o CRM com token
- [ ] `/api/auth/calendar/status` retorna `connected: true`

---

## 🔧 COMANDOS DE DIAGNÓSTICO

### Ver configuração atual:
```bash
curl https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/test-config
```

### Ver status da conexão:
```bash
curl https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/calendar/status
```

### Ver se backend está rodando:
```bash
curl https://crm-vendas-fotovoltaicas-production.up.railway.app/health
```

---

## 💡 RESUMO DA CONFUSÃO PORTA 3000 vs 8000

### Porta 3000 (Frontend - Next.js):
- **O que é**: Interface do usuário (HTML/CSS/JavaScript)
- **Onde roda**: 
  - Local: `http://localhost:3000`
  - Produção: `https://insightful-light-production.up.railway.app`
- **Não processa OAuth**: Apenas inicia e recebe resultado

### Porta 8000 (Backend - FastAPI):
- **O que é**: API/Servidor (Python)
- **Onde roda**:
  - Local: `http://localhost:8000`
  - Produção: `https://crm-vendas-fotovoltaicas-production.up.railway.app`
- **Processa OAuth**: Recebe callback do Google e cria token

### Por que isso confunde?

No Railway:
- Ambos serviços usam porta 443 (HTTPS)
- Mas têm URLs diferentes:
  - Frontend: `insightful-light-production.up.railway.app`
  - Backend: `crm-vendas-fotovoltaicas-production.up.railway.app`

Localmente:
- Frontend: porta 3000
- Backend: porta 8000

**O callback do Google SEMPRE vai para o BACKEND!**

---

## 🎯 AÇÃO IMEDIATA

1. **Confirme no Google Cloud Console**:
   - URI de redirecionamento: `https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback`
   - (NÃO use o domínio do frontend `insightful-light`)

2. **Configure no Railway (backend)**:
   ```
   GOOGLE_REDIRECT_URI=https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback
   ```

3. **Teste**:
   ```
   https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/test-config
   ```

4. **Se tudo estiver correto, tente conectar**:
   ```
   https://insightful-light-production.up.railway.app/settings
   ```

---

**A chave é**: Callback vai para o BACKEND (crm-vendas-fotovoltaicas), não para o FRONTEND (insightful-light)! 🔑
