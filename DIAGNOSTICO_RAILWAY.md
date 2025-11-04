# 🔍 Diagnóstico e Testes no Railway

## ✅ Status Atual
- **Backend**: ✅ Funcionando em `https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app`
- **Frontend**: ❌ Erro 404 em `https://insightful-light-production.up.railway.app`

---

## 🔧 Passo 1: Verificar Logs do Frontend

### 1.1 Abrir o Dashboard do Railway
- Clique no serviço **insightful-light** (frontend)
- Clique na aba **Logs** (no topo)

### 1.2 Procurar por estas mensagens:
```
✅ BOM (aplicação iniciou):
- "ready - started server on 0.0.0.0:3000"
- "Listening on port 3000"
- "Server listening on http://0.0.0.0:3000"

❌ PROBLEMAS:
- "Error: Cannot find module..."
- "Module not found"
- "ENOENT: no such file or directory"
- "Failed to load .next"
- Processo reiniciando continuamente
```

**📸 Me envie um print dos logs se houver erros**

---

## 🔧 Passo 2: Verificar Settings do Frontend

### 2.1 Ir em Settings → General
Verificar:
- ✅ **Root Directory**: deve estar vazio ou `/`
- ✅ **Build Command**: `docker build -t frontend .`
- ✅ **Start Command**: deixar vazio (usa o CMD do Dockerfile)

### 2.2 Ir em Settings → Variables
Verificar se tem todas estas variáveis:
```
NEXT_PUBLIC_API_URL=https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://jzezbecvjquqxjnilvya.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6ZXpiZWN2anF1cXhqbmlsdnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NDg4MTIsImV4cCI6MjA3NzMyNDgxMn0.EqzSB-9uViwysuahjJhJKljI3jTk48ZDsAHsHAeK6dk
APP_JWT_SECRET=a6f8e2b1c9d4a7f3e8b5c2d1a9f6e3b8
```

**⚠️ IMPORTANTE**: Se faltarem variáveis, adicione e clique em **Redeploy**

---

## 🔧 Passo 3: Testar o Backend (já está OK)

Abra em uma nova aba:
```
https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/health
```

✅ **Esperado**: `{"status":"ok"}`

Teste outros endpoints:
```
https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/
```

✅ **Esperado**: `{"message":"Bem-vindo à CRM Vendas Fotovoltaicas API"}`

---

## 🧪 Passo 4: Quando o Frontend Estiver OK

### 4.1 Testar a Página Inicial
Abra:
```
https://insightful-light-production.up.railway.app
```

✅ **Esperado**: Ver a página de dashboard ou login

---

### 4.2 Criar Utilizador (Registro)
1. Vá para: `https://insightful-light-production.up.railway.app/register`
2. Preencha:
   - **Nome**: `Danilo`
   - **Email**: `danilo@crm.com`
   - **Senha**: `123456`
   - **Confirmar senha**: `123456`
3. Clique em **Registrar**

✅ **Esperado**: Mensagem de sucesso e redirecionamento para login

---

### 4.3 Fazer Login
1. Vá para: `https://insightful-light-production.up.railway.app/login`
2. Preencha:
   - **Email**: `danilo@crm.com`
   - **Senha**: `123456`
3. Clique em **Entrar**

✅ **Esperado**: Redirecionamento para dashboard

---

### 4.4 Criar um Lead
1. No menu, clique em **Leads**
2. Clique no botão **+ Novo Lead**
3. Preencha:
   - **Nome**: `João Silva`
   - **Email**: `joao@example.com`
   - **Telefone**: `912345678`
   - **Status**: `Entrada de Lead`
   - **Origem**: `Website`
   - **Próxima Ação**: Escolha uma data futura
4. Clique em **Salvar**

✅ **Esperado**: Lead criado com sucesso

---

### 4.5 Verificar Tarefas
1. No menu, clique em **Tarefas**
2. Verifique se o lead "João Silva" aparece na lista

✅ **Esperado**: Ver a tarefa criada automaticamente com a data escolhida

---

### 4.6 Concluir uma Tarefa
1. Na lista de tarefas, clique no checkbox ao lado do lead
2. Confirme a conclusão

✅ **Esperado**: Tarefa marcada como concluída e removida da lista

---

## 🐛 Problemas Comuns

### Problema 1: Frontend retorna 404
**Causa**: Build não completou ou PORT incorreto
**Solução**: 
1. Ver logs do deploy
2. Verificar se há erros de build
3. Redeploy do frontend

### Problema 2: "Failed to fetch" ao fazer login/registro
**Causa**: `NEXT_PUBLIC_API_URL` incorreto ou CORS
**Solução**:
1. Verificar se `NEXT_PUBLIC_API_URL` aponta para o backend correto
2. No Backend, adicionar o domínio do frontend em `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=http://localhost:3000,https://insightful-light-production.up.railway.app
   ```

### Problema 3: Erro de autenticação
**Causa**: `APP_JWT_SECRET` diferente entre frontend/backend
**Solução**: Usar o mesmo secret em ambos

### Problema 4: Erro ao conectar com Supabase
**Causa**: Chaves do Supabase incorretas
**Solução**: Verificar no painel do Supabase as chaves corretas

---

## 📝 Checklist Final

- [ ] Backend /health retorna OK
- [ ] Backend / retorna mensagem de boas-vindas
- [ ] Frontend abre sem erro 404
- [ ] Consegue registrar utilizador
- [ ] Consegue fazer login
- [ ] Consegue criar lead
- [ ] Consegue ver lead em Tarefas
- [ ] Consegue concluir tarefa

---

## 💡 Próximos Passos Após Tudo Funcionar

1. **Melhorar segurança do CORS**
   - Trocar `ALLOWED_ORIGIN_REGEX` por domínio exato do frontend

2. **Configurar domínio customizado** (opcional)
   - No Railway: Settings → Domains → Add Custom Domain

3. **Configurar Google Calendar** (opcional)
   - Adicionar credenciais do Google OAuth

4. **Configurar Cloudinary** (opcional)
   - Para upload de imagens de clientes
