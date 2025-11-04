# 🔐 Configuração Google OAuth - CRM Fotovoltaico

## ✅ O que foi implementado

- ✅ Login com conta Google (botão "Entrar com Google")
- ✅ Verificação de email autorizado (apenas danilocalves86@gmail.com)
- ✅ Token JWT com validade de 30 dias (opção "Lembrar-me")
- ✅ Integração automática com Google Calendar
- ✅ Exibição de nome e foto do Google no header
- ✅ Botão "Sair" que limpa autenticação
- ✅ Proteção de rotas (/leads, /tarefas, /settings)

---

## 📋 Configurações Necessárias

### 1. **Google Cloud Console**

Adicione as seguintes URIs de redirecionamento:

```
http://localhost:8000/api/auth/google/callback
https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/api/auth/google/callback
```

**Como fazer:**
1. Vá em: https://console.cloud.google.com/apis/credentials?project=crm-vendas-fotovoltaicas
2. Clique no cliente OAuth (668333374251-...)
3. Em "URIs de redirecionamento autorizados", adicione a URI do backend Railway
4. Clique em **Salvar**

---

### 2. **Variáveis de Ambiente - Railway Backend**

Adicione estas variáveis no projeto Railway (backend):

```bash
GOOGLE_CLIENT_ID=<seu-client-id-aqui>
GOOGLE_CLIENT_SECRET=<seu-client-secret-aqui>
GOOGLE_REDIRECT_URI=https://<seu-backend>.railway.app/api/auth/google/callback
FRONTEND_URL=https://<seu-frontend>.railway.app
SECRET_KEY=sua-chave-secreta-super-segura-aqui-mude-em-producao
```

**Valores reais (não commitar no Git):**
- Ver arquivo `client_secret_2_668333374251-9tejkukncp1d320g51jltu4h7hqr9tvd.apps.googleusercontent.com.json` baixado do Google Cloud Console

**Como fazer:**
1. Vá no Railway: https://railway.app
2. Selecione o projeto do **backend**
3. Vá em **Variables**
4. Adicione cada variável acima
5. Clique em **Deploy** (ou aguarde redeploy automático)

---

### 3. **Variáveis de Ambiente - Railway Frontend**

Adicione esta variável no projeto Railway (frontend):

```bash
NEXT_PUBLIC_API_URL=https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app
```

**Como fazer:**
1. Vá no Railway: https://railway.app
2. Selecione o projeto do **frontend**
3. Vá em **Variables**
4. Adicione a variável acima
5. Clique em **Deploy**

---

### 4. **Migração do Banco de Dados**

Execute o script para adicionar as colunas necessárias:

**Local (desenvolvimento):**
```powershell
cd backend
python scripts/add_google_oauth_columns.py
```

**Produção (Railway):**
O script será executado automaticamente no próximo deploy, pois as tabelas são criadas via SQLAlchemy.

Ou execute manualmente no SQL Editor do Supabase:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_access_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_refresh_token TEXT;
```

---

## 🧪 Como Testar

### **Local (desenvolvimento):**

1. **Backend:**
   ```powershell
   cd backend
   python main.py
   ```

2. **Frontend:**
   ```powershell
   cd frontend
   $env:NEXT_PUBLIC_API_URL="http://localhost:8000"
   npm run dev
   ```

3. Abra: http://localhost:3000
4. Clique em "Entrar com Google"
5. Faça login com danilocalves86@gmail.com
6. Você será redirecionado para /leads
7. Teste navegar entre páginas (não deve pedir login novamente)
8. Clique em "Sair" e confirme que volta para tela de login

### **Produção (Railway):**

1. Aguarde deploy do backend e frontend
2. Acesse: https://insightful-light-production.up.railway.app/
3. Clique em "Entrar com Google"
4. Faça login com danilocalves86@gmail.com
5. Teste funcionalidades

---

## 🔒 Segurança

- ✅ Apenas o email **danilocalves86@gmail.com** pode acessar
- ✅ Outros emails receberão mensagem: "Acesso negado"
- ✅ Token JWT com expiração de 30 dias
- ✅ Integração com Google Calendar automática
- ✅ Tokens do Google armazenados com segurança no banco

---

## 🐛 Solução de Problemas

### **Erro: "redirect_uri_mismatch"**
- Verifique se a URI no Google Cloud Console está EXATAMENTE igual à variável GOOGLE_REDIRECT_URI
- URIs devem incluir protocolo (https://) e porta se necessário

### **Erro: "Acesso negado"**
- Verifique se está usando o email danilocalves86@gmail.com
- Para permitir outros emails, edite `ALLOWED_EMAIL` em `backend/routes/auth.py`

### **Token expira muito rápido**
- O token dura 30 dias com "Lembrar-me" marcado
- Para alterar, edite `create_access_token()` em `backend/routes/auth.py`

### **Não redireciona após login**
- Verifique a variável `FRONTEND_URL` no backend Railway
- Verifique a variável `NEXT_PUBLIC_API_URL` no frontend Railway

---

## 📝 Próximos Passos

1. ✅ Adicionar URIs de redirecionamento no Google Cloud Console
2. ✅ Configurar variáveis no Railway (backend e frontend)
3. ✅ Executar migração do banco de dados
4. ✅ Fazer commit e push das alterações
5. ✅ Aguardar deploy automático
6. ✅ Testar login em produção

---

## 🎯 Benefícios

- **Mais Seguro**: Autenticação do Google é muito confiável
- **Mais Prático**: Não precisa lembrar senha
- **Integração Calendar**: Token usado automaticamente para criar eventos
- **Profissional**: Experiência de login moderna
- **Restrição de Acesso**: Apenas você pode entrar

---

**⚠️ Credenciais:**
- Ver arquivo JSON baixado do Google Cloud Console
- **NUNCA** commitar credenciais no Git
- Usar apenas variáveis de ambiente no Railway
- Email Autorizado: `danilocalves86@gmail.com`
