# 🚨 AÇÃO NECESSÁRIA: Executar Migração SQL no Supabase

## ❌ Problema Identificado

O backend está falhando porque **faltam colunas no banco de dados do Supabase**.

Erro atual:
```
column leads.contador_tentativas does not exist
column leads.proxima_acao does not exist
column leads.tarefa_concluida does not exist  
column leads.google_event_id does not exist
column users.google_calendar_token does not exist
```

## ✅ Solução: Executar SQL no Supabase

### Passo 1: Abrir SQL Editor

1. Acesse: https://supabase.com/dashboard/project/jzezbecvjquqxjnilvya/sql
2. Faça login na sua conta Supabase

### Passo 2: Copiar e Executar SQL

1. Abra o arquivo: `supabase/migracao_completa.sql`
2. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
3. Cole no SQL Editor do Supabase
4. Clique em **"RUN"** ou pressione Ctrl+Enter

### Passo 3: Verificar Resultado

Após executar, você deve ver:

```
✅ 4 colunas adicionadas na tabela leads
✅ 1 coluna adicionada na tabela users  
✅ 2 índices criados
✅ Query de verificação executada
```

## 📋 O que será adicionado

**Tabela `leads`:**
- `proxima_acao` (TIMESTAMPTZ) - Data e hora da próxima ação/tarefa
- `tarefa_concluida` (BOOLEAN) - Se a tarefa foi concluída
- `google_event_id` (TEXT) - ID do evento no Google Calendar
- `contador_tentativas` (INTEGER) - Número de tentativas de contato

**Tabela `users`:**
- `google_calendar_token` (TEXT) - Token de autenticação do Google

## 🔄 Depois da Migração

Após executar a migração SQL:

1. ✅ O backend deixará de dar erro 500
2. ✅ Poderá adicionar datas aos leads
3. ✅ Leads com datas aparecerão na página Tarefas
4. ✅ O campo de data ficará visível no formulário

## 🧪 Como Testar

Depois de executar a migração no Supabase:

```powershell
# Reiniciar o backend (se ainda não estiver rodando)
cd backend
python main.py

# Em outro terminal, executar o teste
python backend\test_api_date.py
```

O teste irá:
1. ✅ Adicionar data a um lead (amanhã às 14:00)
2. ✅ Verificar que foi salvo no banco
3. ✅ Buscar tarefas pendentes
4. ✅ Mostrar URLs para testar no navegador

## 📞 Precisa de Ajuda?

Se encontrar algum erro ao executar o SQL:
1. Copie a mensagem de erro completa
2. Cole aqui no chat
3. Vou ajudar a resolver!

---

**IMPORTANTE:** Este é um passo OBRIGATÓRIO. O sistema não funcionará sem estas colunas no banco de dados!
