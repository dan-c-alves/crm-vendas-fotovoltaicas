# 🔧 SOLUÇÃO PARA O ERRO 404 NO LOGIN/REGISTRO

## ❌ PROBLEMA IDENTIFICADO - ATUALIZADO

**ERRO ATUAL: 500 Internal Server Error**

O erro mudou de 404 para 500, o que significa:

1. ✅ As variáveis de ambiente foram configuradas (ou usou o fallback 'dev-secret')
2. ✅ A rota `/api/auth/register` existe e está sendo chamada
3. ❌ **A tabela `users` no Supabase NÃO TEM os campos necessários**

**Causa raiz:** Os campos `password_hash` e `username` não foram criados na tabela users do Supabase, então quando o código tenta inserir um usuário, o Supabase retorna erro porque esses campos não existem

---

## ✅ SOLUÇÃO: 2 PASSOS OBRIGATÓRIOS

### ⚠️ IMPORTANTE: FAÇA OS 2 PASSOS NA ORDEM!

---

### 📊 PASSO 1: CONFIGURAR BANCO DE DADOS (SUPABASE) - **MAIS IMPORTANTE**

1. **Acesse o Supabase:**
   - Vá para: https://supabase.com/dashboard
   - Faça login
   - Selecione o projeto: `jzezbecvjquqxjnilvya`

2. **Abra o SQL Editor:**
   - Clique em **"SQL Editor"** no menu lateral
   - Clique em **"New query"**

3. **Execute o script:**
   - Abra o arquivo `SCRIPT_DEFINITIVO_USERS.sql`
   - **Copie TODO o conteúdo**
   - Cole no SQL Editor
   - Clique em **"Run"** ou pressione `Ctrl+Enter`

4. **Verifique o resultado:**
   - Deve aparecer várias tabelas com resultados
   - Procure por: `tem_senha: ✅ SIM`
   - Se aparecer ❌ NÃO = executar novamente

---

### 🚂 PASSO 2: CONFIGURAR VARIÁVEIS NO RAILWAY (OPCIONAL)

**Nota:** Este passo é opcional se você já configurou as variáveis. Se o erro 500 persistir após o Passo 1, então configure as variáveis.

1. **Acesse o Railway:**
   - Vá para: https://railway.app/dashboard
   - Encontre o projeto CRM

2. **Configure o Frontend:**

1. **Clique no serviço FRONTEND** (insightful-light-production)
2. Vá na aba **"Variables"**
3. Clique em **"Raw Editor"** (botão no canto superior direito)
4. **Cole este conteúdo:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://jzezbecvjquqxjnilvya.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_KIe4WPCL9_rW0zbr7yvj1A_LmS5pANL
APP_JWT_SECRET=crm-vendas-fotovoltaicas-secret-key-2024-railway
NEXT_PRIVATE_JWT_SECRET=crm-vendas-fotovoltaicas-secret-key-2024-railway
NEXT_PUBLIC_API_URL=https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app
NEXT_PUBLIC_APP_NAME=CRM Vendas Fotovoltaicas
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
```

5. Clique em **"Save"** ou **"Update Variables"**
6. O Railway vai fazer **redeploy automático** (aguarde 2-3 minutos)

---

## 🧪 TESTAR DEPOIS DO DEPLOY

### Teste 1: Verificar se o frontend está no ar

Acesse: https://insightful-light-production.up.railway.app

- ✅ Página deve carregar sem erros
- ✅ Não deve aparecer "Application error"

### Teste 2: Criar nova conta

1. Vá para: https://insightful-light-production.up.railway.app/register
2. Preencha:
   - Nome: `Teste CRM`
   - Email: `teste@crm.com`
   - Senha: `123456`
3. Clique em "Criar Conta"
4. **Resultado esperado:**
   - ✅ Mensagem: "Conta criada com sucesso!"
   - ✅ Redireciona para /login
   - ❌ Se aparecer erro 404: aguarde mais 1 minuto e tente novamente

### Teste 3: Login com seu usuário admin

1. Vá para: https://insightful-light-production.up.railway.app/login
2. Preencha:
   - Email: `danilocalves86@gmail.com`
   - Senha: `101010`
3. Clique em "Entrar"
4. **Resultado esperado:**
   - ✅ Mensagem: "Sessão iniciada"
   - ✅ Redireciona para página inicial (/)
   - ✅ Consegue navegar para /leads e /tarefas

---

## 🔍 SE AINDA DER ERRO 404

### Verificação 1: Conferir variáveis no Railway

1. Entre no serviço Frontend
2. Vá em "Variables"
3. Verifique se `APP_JWT_SECRET` está lá
4. Se não estiver, adicione novamente

### Verificação 2: Forçar redeploy

1. No serviço Frontend do Railway
2. Vá na aba "Deployments"
3. Clique nos 3 pontinhos (...) do último deploy
4. Clique em "Redeploy"

### Verificação 3: Ver logs de erro

1. No serviço Frontend do Railway
2. Vá na aba "Logs" ou "Deployments"
3. Procure por erros como:
   - `MODULE_NOT_FOUND`
   - `Cannot find module`
   - `jwt is not defined`

---

## 📊 STATUS ESPERADO APÓS A CORREÇÃO

✅ Frontend: https://insightful-light-production.up.railway.app
✅ Backend: https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/health
✅ Supabase: Usuário admin criado (danilocalves86@gmail.com / 101010)
✅ Login funcionando
✅ Registro funcionando
✅ JWT tokens sendo gerados
✅ Navegação /leads e /tarefas funcionando

---

## 🆘 SE NADA FUNCIONAR

Vou precisar que você me mande:

1. **Screenshot das variáveis do Railway** (Frontend service)
2. **Logs do último deploy** (aba Deployments > View Logs)
3. **Erro completo do console do navegador** (F12 > Console)

Com essas informações consigo identificar exatamente o que está errado.

---

Boa sorte! 🚀
