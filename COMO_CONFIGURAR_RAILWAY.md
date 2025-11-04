# 🚂 Como Configurar as Variáveis no Railway

## 📋 Passo a Passo (Backend)

### 1. Abrir o Serviço Backend no Railway
- Acesse: https://railway.app/project/SEU-PROJETO
- Clique no serviço **Backend** (crm-vendas-fotovoltaicas)

### 2. Ir para Settings → Variables
- No menu lateral, clique em **Settings**
- Role até a seção **Variables**

### 3. Copiar e Colar as Variáveis
Copie **TODAS** as linhas abaixo e cole no campo de variáveis do Railway:

```env
DATABASE_URL=postgresql://postgres.jzezbecvjquqxjnilvya:Dan31018858%2A@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require
SECRET_KEY=1f7a9c3e5b2d4a8f0c6b1e3d7a9c2f5e8b4d1a7c3e9f2b6d0a4c8e1f3b7d9a2
ALLOWED_ORIGINS=http://localhost:3000
ALLOWED_ORIGIN_REGEX=^https://.*\.railway\.app$
COMISSAO_PERCENTAGEM=0.05
IVA_TAXA=0.23
```

**IMPORTANTE:**
- ✅ A senha já está URL-encoded (`%2A` no lugar de `*`)
- ✅ Usando Connection Pooler do Supabase (porta 6543) com `sslmode=require`
- ✅ CORS configurado para aceitar qualquer domínio `.railway.app`

### 4. Salvar e Redeploy
- Clique em **Deploy** (ou espere o redeploy automático)
- Aguarde ~2-3 minutos

### 5. Testar o Backend
Abra no navegador (substitua pelo seu domínio):
```
https://SEU-BACKEND.railway.app/health
```

✅ **Deve retornar:** `{"status":"ok"}`

---

## 🎯 Próximos Passos

### Depois do backend OK:

1. **Copiar o domínio do backend**
   - Exemplo: `https://crm-vendas-fotovoltaicas-production.up.railway.app`

2. **Configurar o Frontend**
   - Criar variáveis no serviço Frontend:
   ```env
   NEXT_PUBLIC_API_URL=https://SEU-BACKEND.railway.app
   NEXT_PUBLIC_SUPABASE_URL=https://jzezbecvjquqxjnilvya.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_DO_SUPABASE
   APP_JWT_SECRET=a6f8e2b1c9d4a7f3e8b5c2d1a9f6e3b8
   ```

3. **Testar a aplicação completa**
   - Abrir o domínio do frontend
   - Testar `/register` → criar utilizador `danilo` / senha `123456`
   - Testar `/login` → fazer login
   - Testar `/leads` → criar lead
   - Testar `/tarefas` → ver tarefa criada automaticamente

---

## 🐛 Se der erro de conexão ao DB

### Alternativa 1: Usar driver explícito
Mudar a DATABASE_URL para:
```
postgresql+psycopg2://postgres.jzezbecvjquqxjnilvya:Dan31018858%2A@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require
```

### Alternativa 2: Usar conexão direta (não recomendado)
```
postgresql://postgres.jzezbecvjquqxjnilvya:Dan31018858%2A@db.jzezbecvjquqxjnilvya.supabase.co:5432/postgres?sslmode=require
```

---

## 📝 Notas Técnicas

- **Por que remover `?pgbouncer=true`?**
  - O driver `psycopg2` do Python não reconhece esse parâmetro (específico de alguns clients JS)
  - Em vez disso, usamos `sslmode=require` que é padrão libpq/psycopg2

- **Por que usar o Pooler?**
  - Mais estável para containers (IPv4)
  - Gerencia conexões automaticamente
  - Evita problemas de timeout

- **CORS Regex**
  - `^https://.*\.railway\.app$` aceita qualquer subdomínio do Railway
  - Após deploy final, pode trocar por domínio exato para mais segurança
