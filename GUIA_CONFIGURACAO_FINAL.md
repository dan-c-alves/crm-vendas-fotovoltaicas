# 🚀 GUIA COMPLETO - CONFIGURAÇÃO FINAL DO CRM

## ✅ O QUE JÁ ESTÁ PRONTO

### Backend (FastAPI)
- ✅ Deployed no Railway: https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/health
- ✅ Conectado ao Supabase PostgreSQL
- ✅ Modelo User atualizado com campo `senha_hash`
- ✅ Rotas de autenticação criadas: `/api/auth/register` e `/api/auth/login`
- ✅ Dependências adicionadas: `bcrypt` e `pyjwt`

### Frontend (Next.js)
- ✅ Deployed no Railway: https://insightful-light-production.up.railway.app
- ✅ UI moderna com gradientes azuis
- ✅ Mensagem de sucesso ao criar conta: "Conta criada com sucesso!"
- ✅ Bug corrigido: agora envia `password` em vez de `senha` para a API
- ✅ Validação de senha mínima (6 caracteres)

---

## 📋 O QUE VOCÊ PRECISA FAZER AGORA

### Passo 1: Configurar o Banco de Dados no Supabase

1. **Acesse o Supabase Dashboard:**
   - Vá para: https://supabase.com/dashboard
   - Faça login e selecione seu projeto: `jzezbecvjquqxjnilvya`

2. **Abra o SQL Editor:**
   - Clique em **"SQL Editor"** no menu lateral esquerdo

3. **Execute o Script SQL:**
   - Copie o conteúdo do arquivo `EXECUTAR_NO_SUPABASE.sql`
   - Cole no SQL Editor
   - Clique em **"Run"** ou pressione `Ctrl+Enter`

**O script irá:**
- ✅ Adicionar campos `password_hash` e `username` na tabela `users`
- ✅ Criar seu usuário admin (danilocalves86@gmail.com / 101010)
- ✅ Criar usuário de teste (teste@exemplo.com / teste123)
- ✅ Mostrar lista de usuários criados

---

### Passo 2: Deploy das Alterações no Backend

O backend precisa ser atualizado com as novas dependências (`bcrypt` e `pyjwt`).

**Execute no terminal:**

```powershell
cd backend
git add .
git commit -m "Adicionar autenticação com senha"
git push
```

Se você já está conectado ao Railway via Git, o deploy será automático.

**OU faça o deploy manual:**

1. Vá para o Railway Dashboard: https://railway.app/dashboard
2. Selecione o serviço backend
3. Clique em **"Deployments"**
4. Clique em **"Redeploy"**

---

### Passo 3: Deploy das Alterações no Frontend

O frontend precisa ser atualizado com a correção do bug (password em vez de senha).

**Execute no terminal:**

```powershell
cd frontend
git add .
git commit -m "Corrigir envio de senha no registro"
git push
```

**OU redeploy manual no Railway:**

1. Vá para o Railway Dashboard
2. Selecione o serviço frontend
3. Clique em **"Redeploy"**

---

## 🧪 Passo 4: Testar o Sistema

### Teste 1: Criar Nova Conta
1. Acesse: https://insightful-light-production.up.railway.app/register
2. Preencha:
   - Nome: `Teste Novo`
   - Email: `novo@teste.com`
   - Senha: `123456`
3. Clique em **"Criar Conta"**
4. **Deve aparecer:** "Conta criada com sucesso!" (toast verde)
5. **Deve redirecionar para:** `/login`

### Teste 2: Login com Usuário Admin
1. Acesse: https://insightful-light-production.up.railway.app/login
2. Preencha:
   - Email: `danilocalves86@gmail.com`
   - Senha: `101010`
3. Clique em **"Entrar"**
4. **Deve redirecionar para:** `/leads` (dashboard)

### Teste 3: Verificar Funcionalidades
- ✅ Dashboard mostra estatísticas de vendas
- ✅ Página Leads permite criar/editar leads
- ✅ Página Tarefas mostra próximas ações
- ✅ Logout funciona corretamente

---

## 🔧 TROUBLESHOOTING

### Problema: "Email já registrado"
**Solução:** Use outro email ou delete o usuário existente no Supabase:
```sql
DELETE FROM users WHERE email = 'seu@email.com';
```

### Problema: "Senha inválida" ao fazer login
**Causa:** A tabela users não tem o campo `password_hash` ainda
**Solução:** Execute o script `EXECUTAR_NO_SUPABASE.sql`

### Problema: Página em branco após login
**Causa:** Problema com autenticação ou redirecionamento
**Solução:** 
1. Abra o Console do navegador (F12)
2. Veja os erros na aba "Console"
3. Verifique se o cookie `app_token` foi criado (aba "Application" > "Cookies")

### Problema: Backend retorna 500 no registro
**Causa:** Dependências `bcrypt` ou `pyjwt` não instaladas
**Solução:** 
1. Redeploy do backend no Railway
2. Verifique os logs de build no Railway Dashboard

---

## 📊 CREDENCIAIS CRIADAS

### Usuário Admin (Você)
- **Email:** danilocalves86@gmail.com
- **Username:** danilo
- **Senha:** 101010

### Usuário de Teste
- **Email:** teste@exemplo.com
- **Username:** teste  
- **Senha:** teste123

---

## 📁 ARQUIVOS IMPORTANTES

- **EXECUTAR_NO_SUPABASE.sql** - Script SQL para configurar o banco
- **backend/models/user.py** - Modelo User com senha_hash e métodos de autenticação
- **backend/routes/auth.py** - Rotas /register e /login
- **backend/requirements.txt** - Dependências atualizadas (bcrypt, pyjwt)
- **frontend/src/app/register/page.tsx** - Página de registro com mensagem de sucesso

---

## 🎉 PRÓXIMOS PASSOS

Após tudo funcionar:

1. **Criar seus primeiros leads:**
   - Acesse `/leads`
   - Clique em "Novo Lead"
   - Preencha os dados e salve

2. **Configurar Google Calendar (opcional):**
   - Acesse `/settings`
   - Clique em "Conectar Google Calendar"
   - Autorize o acesso

3. **Testar fluxo completo:**
   - Criar lead → Agendar tarefa → Ver no calendário

---

## ❓ DÚVIDAS?

Se algo não funcionar:
1. Verifique os logs do Railway (backend e frontend)
2. Verifique o SQL Editor do Supabase (se o script rodou com sucesso)
3. Teste os endpoints diretamente:
   - Backend Health: https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/health
   - Backend Docs: https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/docs

---

Boa sorte! 🚀
