# 🚀 GUIA RÁPIDO: CONFIGURAR RAILWAY E TESTAR

Siga estes passos na ordem para completar o deploy:

---

## 📍 PASSO 1: Railway - Configurar Variáveis

1. Acesse: https://railway.app/
2. Entre no seu projeto backend
3. Vá em **"Variables"**
4. Adicione TODAS estas variáveis (copie do seu `.env` local):

```
DATABASE_URL=<copie-do-seu-env-local>
ALLOWED_ORIGINS=https://insightful-light-production.up.railway.app
ALLOWED_ORIGIN_REGEX=^https://.*\.railway\.app$
SECRET_KEY=troque-esta-chave-em-producao-por-uma-forte
DEBUG=False
COMISSAO_PERCENTAGEM=0.05
IVA_TAXA=0.23
GOOGLE_CLIENT_ID=<copie-do-seu-env-local>
GOOGLE_CLIENT_SECRET=<copie-do-seu-env-local>
GOOGLE_REDIRECT_URI=https://insightful-light-production.up.railway.app/api/auth/google/callback
```

⚠️ **IMPORTANTE:** Copie as credenciais reais do arquivo `backend/.env` local

5. Clique em **"Deploy"** se não iniciar automaticamente

---

## 📍 PASSO 2: Google Console - Configurar OAuth

1. Acesse: https://console.cloud.google.com/
2. Vá em **APIs & Services > Credentials**
3. Clique no seu OAuth Client ID
4. Em **"Authorized JavaScript origins"**, adicione:
   ```
   https://insightful-light-production.up.railway.app
   ```
5. Em **"Authorized redirect URIs"**, adicione:
   ```
   https://insightful-light-production.up.railway.app/api/auth/google/callback
   ```
6. Clique em **"Save"**

---

## 📍 PASSO 3: Aguardar Deploy

1. Volte ao Railway
2. Vá na aba **"Deployments"**
3. Aguarde o deploy terminar (veja os logs)
4. Procure pela mensagem: **"✅ Base de dados inicializada"**

---

## 📍 PASSO 4: Testar em Produção

### Teste 1: API Docs
Acesse: https://insightful-light-production.up.railway.app/docs
✅ Deve carregar a documentação da API

### Teste 2: Healthcheck
Acesse: https://insightful-light-production.up.railway.app/health
✅ Deve retornar: `{"status":"ok"}`

### Teste 3: Login Google
Acesse: https://insightful-light-production.up.railway.app/api/auth/login
✅ Deve redirecionar para a página de login do Google

### Teste 4: Login Completo
1. No frontend (ou API), clique em "Login com Google"
2. Escolha uma conta Google
3. Autorize a aplicação
✅ Deve redirecionar de volta e fazer login

---

## ✅ Checklist

- [ ] Configurei as variáveis no Railway
- [ ] Configurei os URIs no Google Console
- [ ] O deploy do Railway terminou sem erros
- [ ] `/docs` carrega corretamente
- [ ] `/health` retorna `{"status":"ok"}`
- [ ] Login Google funciona

---

## 🆘 Se algo falhar:

1. **Verifique os logs do Railway**: Procure por erros em vermelho
2. **Teste cada URL individualmente**: Comece por `/health` e depois `/docs`
3. **Verifique as variáveis**: Certifique-se que não há typos
4. **Reinicie o deploy**: No Railway, clique em "Redeploy"

---

## 📞 Precisa de ajuda?

Se algo não funcionar, me avise qual passo falhou e qual erro apareceu!
