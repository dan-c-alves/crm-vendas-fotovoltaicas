# 🚨 URGENTE: Configurar Root Directory no Railway

## ❌ Problema Identificado

O serviço **backend** no Railway está tentando executar a partir da **raiz do repositório** em vez da pasta `/backend`.

Por isso você vê a página padrão do Railway em vez da API FastAPI.

---

## ✅ Solução: Configurar Root Directory

### Passo 1: Abrir Dashboard do Railway
1. Acesse: https://railway.app
2. Entre no seu projeto
3. Clique no serviço **backend** (o que tem a URL `1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app`)

### Passo 2: Configurar Settings
1. Clique em **Settings** (ícone de engrenagem no topo)
2. Role até a seção **Service Settings** ou **Build & Deploy**
3. Encontre o campo **Root Directory**
4. Digite: `backend`
5. Clique em **Save** ou o botão para aplicar

### Passo 3: Redeploy
1. Ainda no serviço backend, clique em **Deployments** (no topo)
2. Clique nos três pontinhos `...` do último deployment
3. Clique em **Redeploy**

---

## 🧪 Testar Após Configurar

### Teste 1: Endpoint Raiz
```
https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/
```

✅ **Deve retornar**:
```json
{"message":"Bem-vindo à CRM Vendas Fotovoltaicas API"}
```

❌ **NÃO deve mostrar**: Página com "✨ Home of the Railway API ✨"

---

### Teste 2: Health Check
```
https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/health
```

✅ **Deve retornar**:
```json
{"status":"ok"}
```

---

### Teste 3: Documentação da API
```
https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/docs
```

✅ **Deve abrir**: Interface Swagger UI da FastAPI

---

### Teste 4: Endpoint de Leads
```
https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/api/leads
```

✅ **Deve retornar**: Array JSON (vazio ou com leads)

---

## 📋 Configurações Completas do Serviço Backend

### Build Settings
- **Builder**: NIXPACKS (automático para Python)
- **Build Command**: (deixe vazio, Nixpacks detecta automaticamente)
- **Install Command**: (deixe vazio)

### Deploy Settings
- **Root Directory**: `backend` ⚠️ **IMPORTANTE**
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Healthcheck Path**: `/health`
- **Healthcheck Timeout**: 300 segundos
- **Restart Policy**: On Failure

### Variables (Environment)
Certifique-se de que tem todas estas variáveis:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/railway
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-secret-aqui
GOOGLE_REDIRECT_URI=https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app/api/auth/google/callback
COMISSAO_PERCENTAGEM=5
IVA_TAXA=23
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret
```

---

## 🔍 Como Verificar se Está Correto

### No Dashboard do Railway:
1. Clique no serviço **backend**
2. Vá em **Settings**
3. Procure por **Root Directory** ou **Service Settings**
4. Deve estar escrito: `backend`

### Nos Logs:
1. Vá em **Deployments** → Clique no último deploy
2. Vá em **Logs**
3. Deve ver linhas como:
   ```
   🚀 Iniciando CRM API...
   DATABASE_URL: postgresql://postgres...
   Conectando e inicializando o banco de dados...
   ✅ Base de dados inicializada
   INFO:     Application startup complete.
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

❌ **Se vir erros como**:
- `Cannot find module 'main'`
- `No such file or directory: main.py`
- **→ O Root Directory ainda não está configurado!**

---

## 💡 Alternativa: Usar nixpacks.toml

Se o Railway não tiver a opção de Root Directory visível, você pode criar um arquivo:

`backend/nixpacks.toml`:
```toml
[phases.setup]
nixPkgs = ["python310", "postgresql"]

[phases.install]
cmds = ["pip install -r requirements.txt"]

[start]
cmd = "uvicorn main:app --host 0.0.0.0 --port $PORT"
```

Mas o ideal é usar o Root Directory no painel.

---

## ❓ Precisa de Ajuda?

Se após configurar ainda não funcionar:
1. **Tire prints** dos Settings do serviço backend
2. **Copie os logs** do último deployment
3. Me envie para análise
