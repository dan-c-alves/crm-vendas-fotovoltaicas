# 🚀 GUIA VISUAL: CONFIGURAR RAILWAY (PASSO A PASSO)

## ✅ SUPABASE JÁ ESTÁ PRONTO!

Tabelas criadas:
- ✅ users (16 colunas)
- ✅ leads (26 colunas)
- ✅ metas
- ✅ notificacoes

---

## 🎯 AGORA: CONFIGURAR RAILWAY

### 📍 PASSO 1: Ir para a aba Variables

Você está em **"Settings"**, mas precisa clicar em **"Variables"**!

```
[Deployments] [Variables] [Metrics] [Settings]
                  ↑
              CLIQUE AQUI
```

---

### 📍 PASSO 2: Adicionar Variáveis

Clique em **"+ New Variable"** ou **"Raw Editor"**

Se usar **Raw Editor**, cole TUDO de uma vez:

```env
ALLOWED_ORIGINS=http://localhost:3000,https://insightful-light-production.up.railway.app
DATABASE_URL=<copie-do-arquivo-backend/.env-local>
SECRET_KEY=mude-esta-chave-em-producao-por-uma-forte-123456
DEBUG=False
COMISSAO_PERCENTAGEM=0.05
IVA_TAXA=0.23
GOOGLE_CLIENT_ID=<copie-do-arquivo-backend/.env-local>
GOOGLE_CLIENT_SECRET=<copie-do-arquivo-backend/.env-local>
GOOGLE_REDIRECT_URI=https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/api/auth/google/callback
ALLOWED_ORIGIN_REGEX=^https://.*\.railway\.app$
```

⚠️ **Copie as credenciais reais do arquivo `backend/.env` local**

---

### 📍 PASSO 3: Salvar e Aguardar

1. Clique em **"Deploy"** ou aguarde o redeploy automático
2. Vá na aba **"Logs"**
3. Aguarde ver esta mensagem:

```
🚀 Iniciando CRM API...
DATABASE_URL: postgresql://postgre...
CORS allow_origins: ['http://localhost:3000', 'https://insightful-light-production.up.railway.app']
✅ Base de dados inicializada
```

---

### 📍 PASSO 4: Verificar se funcionou

Abra no navegador:

**Teste 1:** https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/health
```json
{"status":"ok"}
```

**Teste 2:** https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/docs
```
Deve carregar a documentação da API
```

---

### 📍 PASSO 5: Testar Login Google

1. Vá no frontend: https://insightful-light-production.up.railway.app
2. Clique em "Login com Google"
3. **O erro de CORS deve sumir!**

---

## 🔍 TROUBLESHOOTING

### Se o erro de CORS continuar:

1. **Verifique se você está na aba Variables** (não Settings!)
2. **Confirme que `ALLOWED_ORIGINS` tem o domínio do frontend**
3. **Force um redeploy**: Deployments > ⋯ > Redeploy

### Se não achar a aba Variables:

Pode ser que o Railway mudou a UI. Procure por:
- **"Environment Variables"**
- **"Environment"**
- **"Variables"** (ao lado de Deployments/Metrics)

---

## 📊 STATUS ATUAL

- ✅ Supabase: Tabelas criadas (4 tabelas)
- ✅ Código: Pushed para GitHub
- ⏳ Railway: **Aguardando você configurar as variáveis**
- ⏳ Login Google: Vai funcionar após configurar Railway

---

## 🎬 RESUMO RÁPIDO

1. **Railway** > Clique no serviço backend
2. **Variables** > Cole todas as variáveis acima
3. **Save** > Aguarde redeploy (2-3 min)
4. **Logs** > Verifique se aparece "CORS allow_origins: ['http://localhost:3000', 'https://insightful-light-production...']"
5. **Teste** > Tente login Google novamente

---

**Depois de configurar, o erro de CORS vai sumir e o login vai funcionar!** ✅
