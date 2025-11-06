# ✅ Checklist Final - Google OAuth

## 🔍 Status das Configurações (baseado nas suas imagens)

### ✅ CORRETO - Google Cloud Console

#### APIs Ativadas:
- ✅ **Google Calendar API** - Ativada
- ✅ **Google+ API** - Ativada

#### Origens JavaScript Autorizadas:
- ✅ `https://crm-vendas-fotovoltaicas-production.up.railway.app`
- ✅ `https://insightful-light-production.up.railway.app`
- ✅ `http://localhost:3000`

#### Client ID Criado:
- ✅ **Nome**: CRM Backend
- ✅ **ID**: `668333374251-9tejkukncp1d320g51jtu4h7hqr9tvd.apps.googleusercontent.com`
- ✅ **Data**: 3 de novembro de 2025

---

### ❌ ERRO ENCONTRADO - URIs de Redirecionamento

#### URI 1 - INCORRETO:
```
❌ https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/
```

**FALTA**: `/google/callback` no final!

#### Deve ser:
```
✅ https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback
```

#### URI 2 - CORRETO:
```
✅ http://localhost:8000/api/auth/google/callback
```

---

## 🔧 Como Corrigir

### Passo 1: Voltar para Edição
1. Clique no Client ID: **CRM Backend**
2. Na seção **"URIs de redirecionamento autorizados"**
3. Clique em **EDITAR** (ícone de lápis)

### Passo 2: Corrigir o URI 1
**REMOVA**:
```
https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/
```

**ADICIONE**:
```
https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback
```

### Passo 3: Manter o URI 2
```
http://localhost:8000/api/auth/google/callback
```

### Passo 4: Salvar
- Clique em **"Salvar"**
- Aguarde a mensagem: "Cliente OAuth atualizado"

---

## 📋 Próximo Passo: Configurar Railway

Após corrigir o Google Cloud Console, configure as variáveis no Railway:

### Backend Service - Variáveis Necessárias:

```bash
GOOGLE_CLIENT_ID=668333374251-9tejkukncp1d320g51jtu4h7hqr9tvd.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<COPIAR_DO_GOOGLE_CLOUD_CONSOLE>
GOOGLE_REDIRECT_URI=https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback
FRONTEND_URL=https://insightful-light-production.up.railway.app
```

**Onde encontrar o Client Secret?**
1. No Google Cloud Console, clique no Client ID
2. No lado direito, em "Chaves secretas do cliente"
3. Copie o valor mostrado

---

## 🧪 Como Testar (após correções)

### Teste 1: Verificar Configuração
Acesse no navegador:
```
https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/test-config
```

Resposta esperada:
```json
{
  "google_client_id": "668333374251-9tejkuk...",
  "google_client_secret": "SET",
  "redirect_uri": "https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback",
  "frontend_url": "https://insightful-light-production.up.railway.app",
  "scopes": [...]
}
```

### Teste 2: Conectar Calendar
1. Acesse: https://insightful-light-production.up.railway.app/settings
2. Clique: **"Conectar Google Calendar"**
3. Será redirecionado para Google
4. Faça login com: **danilocalves86@gmail.com**
5. Autorize as permissões
6. Será redirecionado de volta para o CRM
7. Deve mostrar: ✅ **"Conectado com sucesso!"**

### Teste 3: Verificar Status
Acesse:
```
https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/calendar/status
```

Resposta esperada:
```json
{
  "connected": true,
  "email": "danilocalves86@gmail.com",
  "message": "Google Calendar conectado"
}
```

---

## 🚨 Se ainda der erro "redirect_uri_mismatch"

### Significa que o URI ainda está errado

**Verifique**:
1. No Google Cloud Console, o URI deve terminar com `/google/callback`
2. No Railway, a variável `GOOGLE_REDIRECT_URI` deve ser idêntica
3. Aguarde 5 minutos após salvar no Google (cache)

### Comparação Final:

| Lugar | URI Correto |
|-------|-------------|
| Google Cloud Console | `https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback` |
| Railway (variável) | `https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback` |
| Código (settings.py) | Lê da variável `GOOGLE_REDIRECT_URI` |

---

## 📝 Resumo da Correção

### Antes (ERRADO):
```
❌ .../api/auth/
```

### Depois (CORRETO):
```
✅ .../api/auth/google/callback
```

**A diferença**: falta `google/callback` no final!

---

## ✅ Checklist Final

- [ ] URI corrigido no Google Cloud Console
- [ ] Salvo no Google Cloud Console
- [ ] `GOOGLE_CLIENT_ID` configurado no Railway
- [ ] `GOOGLE_CLIENT_SECRET` configurado no Railway
- [ ] `GOOGLE_REDIRECT_URI` configurado no Railway (com `/google/callback`)
- [ ] `FRONTEND_URL` configurado no Railway
- [ ] Railway fez redeploy
- [ ] Teste 1: `/api/auth/google/test-config` retorna sucesso
- [ ] Teste 2: Conectar Calendar funciona
- [ ] Teste 3: `/api/auth/calendar/status` retorna connected: true

---

**Após completar todos os itens, a integração estará 100% funcional!** 🎉
