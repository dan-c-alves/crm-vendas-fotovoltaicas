# 🔧 Configuração Google Cloud Console para OAuth

## 📋 Checklist de Configuração

### 1. Acessar Google Cloud Console
1. Acesse: https://console.cloud.google.com/
2. Faça login com: **danilocalves86@gmail.com**
3. Selecione ou crie um projeto (ex: "CRM Fotovoltaico")

---

### 2. Ativar APIs Necessárias
1. No menu lateral, vá em: **APIs & Services** → **Library**
2. Busque e ative as seguintes APIs:
   - ✅ **Google Calendar API**
   - ✅ **Google+ API** (ou People API)

---

### 3. Criar Credenciais OAuth 2.0

#### Passo 3.1: Configurar OAuth Consent Screen
1. Vá em: **APIs & Services** → **OAuth consent screen**
2. Escolha: **External** (teste)
3. Preencha:
   - **App name**: CRM Vendas Fotovoltaicas
   - **User support email**: danilocalves86@gmail.com
   - **Developer contact**: danilocalves86@gmail.com
4. Clique em **Save and Continue**

5. Em **Scopes**, adicione:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/calendar.events`
6. Clique em **Save and Continue**

7. Em **Test users**, adicione:
   - ✅ `danilocalves86@gmail.com`
8. Clique em **Save and Continue**

#### Passo 3.2: Criar Client ID
1. Vá em: **APIs & Services** → **Credentials**
2. Clique em **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Escolha: **Web application**
4. Preencha:

**Nome**: CRM Fotovoltaico Web Client

**Origens JavaScript autorizadas** (clique em + ADD URI):
```
https://insightful-light-production.up.railway.app
https://crm-vendas-fotovoltaicas-production.up.railway.app
http://localhost:3000
```

**URIs de redirecionamento autorizados** (clique em + ADD URI):
```
https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback
http://localhost:8000/api/auth/google/callback
```

5. Clique em **CREATE**
6. **COPIE e SALVE**:
   - ✅ Client ID (começa com algo como `668333374251-...`)
   - ✅ Client Secret

---

### 4. Configurar Variáveis no Railway

#### Backend Service:
1. Acesse: https://railway.app/
2. Selecione o projeto: **crm-vendas-fotovoltaicas**
3. Clique no serviço: **backend**
4. Vá na aba: **Variables**
5. Adicione/Verifique as seguintes variáveis:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=<SEU_CLIENT_ID_AQUI>
GOOGLE_CLIENT_SECRET=<SEU_CLIENT_SECRET_AQUI>
GOOGLE_REDIRECT_URI=https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback

# Frontend URL (para redirect após OAuth)
FRONTEND_URL=https://insightful-light-production.up.railway.app

# Database (já deve estar configurado)
DATABASE_URL=postgresql://postgres.jzezbecvjquqxjnilvya:8LmfrB...@aws-0-sa-east-1.pooler.supabase.com:6543/postgres

# Outros
SECRET_KEY=<alguma_chave_secreta_aleatoria>
COMISSAO_PERCENTAGEM=0.05
IVA_TAXA=0.23
```

6. Clique em **Save** após adicionar cada variável
7. O Railway fará **redeploy automático**

#### Frontend Service:
1. Clique no serviço: **frontend**
2. Vá na aba: **Variables**
3. Verifique:

```bash
NEXT_PUBLIC_API_URL=https://crm-vendas-fotovoltaicas-production.up.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://jzezbecvjquqxjnilvya.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua_anon_key>
```

---

### 5. Testar a Integração

#### Após Railway terminar o deploy:

1. Acesse: https://insightful-light-production.up.railway.app/settings
2. Clique em: **Conectar Google Calendar**
3. Você será redirecionado para: `https://accounts.google.com/o/oauth2/auth?...`
4. Faça login com: **danilocalves86@gmail.com**
5. Autorize as permissões solicitadas
6. Será redirecionado de volta para: `https://insightful-light-production.up.railway.app/?token=...`
7. A página de Configurações deve mostrar: ✅ **"Conectado com sucesso!"**

---

### 6. Verificar se Funcionou

#### Teste 1: Verificar Status
```bash
# Acesse no navegador:
https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/calendar/status

# Resposta esperada:
{
  "connected": true,
  "email": "danilocalves86@gmail.com",
  "message": "Google Calendar conectado"
}
```

#### Teste 2: Criar Tarefa
1. Vá em: **Tarefas**
2. Crie uma nova tarefa com data futura
3. Abra o Google Calendar: https://calendar.google.com
4. O evento deve aparecer como: `FOLLOW-UP: [Nome] (Telefone)`

---

## 🔍 Troubleshooting

### Erro: "redirect_uri_mismatch"
**Causa**: URI de redirecionamento não está configurado no Google Cloud Console

**Solução**:
1. Volte para Google Cloud Console → Credentials
2. Edite o OAuth Client
3. Adicione exatamente: `https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback`
4. Salve e tente novamente

### Erro: "access_denied"
**Causa**: Email não está na lista de test users

**Solução**:
1. Volte para Google Cloud Console → OAuth consent screen
2. Na seção **Test users**, adicione: `danilocalves86@gmail.com`
3. Salve e tente novamente

### Erro: "invalid_client"
**Causa**: Client ID ou Secret incorretos

**Solução**:
1. Verifique as variáveis no Railway
2. Copie novamente do Google Cloud Console
3. Cole exatamente (sem espaços extras)
4. Salve e aguarde redeploy

### Calendário não sincroniza
**Causa**: Token expirado ou sem permissões

**Solução**:
1. Vá em Settings
2. Clique em "Reconectar Google Calendar"
3. Autorize novamente

---

## 📞 URLs Importantes

- **Google Cloud Console**: https://console.cloud.google.com/
- **Railway Dashboard**: https://railway.app/
- **Frontend (CRM)**: https://insightful-light-production.up.railway.app
- **Backend (API)**: https://crm-vendas-fotovoltaicas-production.up.railway.app
- **Google Calendar**: https://calendar.google.com

---

## ✅ Checklist Final

Antes de testar, confirme:

- [ ] APIs ativadas no Google Cloud Console
- [ ] OAuth Consent Screen configurado
- [ ] Test user adicionado (danilocalves86@gmail.com)
- [ ] Client ID criado
- [ ] Client Secret copiado
- [ ] Origens JavaScript autorizadas incluem o frontend Railway
- [ ] URIs de redirecionamento incluem o backend Railway + /api/auth/google/callback
- [ ] GOOGLE_CLIENT_ID configurado no Railway (backend)
- [ ] GOOGLE_CLIENT_SECRET configurado no Railway (backend)
- [ ] GOOGLE_REDIRECT_URI configurado no Railway (backend)
- [ ] FRONTEND_URL configurado no Railway (backend)
- [ ] Railway terminou o redeploy (sem erros)

---

**🎉 Após completar todos os passos, a integração estará funcionando!**
