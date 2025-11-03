# ✅ Checklist: Configuração completa do Supabase

Execute estes passos no Supabase para garantir que o sistema de Tarefas funcione corretamente.

## Passo 1: Executar migração do schema

1. Acesse: https://supabase.com/dashboard/project/jzezbecvjquqxjnilvya/sql
2. Clique em "New query"
3. Copie e cole o código abaixo:

```sql
-- Supabase: garantir colunas necessárias na tabela leads
-- Execute no SQL Editor do Supabase (Postgres)

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS proxima_acao timestamptz NULL,
  ADD COLUMN IF NOT EXISTS tarefa_concluida boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS google_event_id text NULL;

-- Índice opcional para consultas por data de tarefa
CREATE INDEX IF NOT EXISTS idx_leads_proxima_acao ON public.leads (proxima_acao);
-- Índice opcional para filtrar tarefas pendentes
CREATE INDEX IF NOT EXISTS idx_leads_tarefa_concluida ON public.leads (tarefa_concluida);
```

4. Clique em "Run" (ou Ctrl+Enter)
5. Verifique a mensagem de sucesso

## Passo 2: Verificar colunas criadas

Execute no SQL Editor:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'leads' AND table_schema = 'public'
ORDER BY ordinal_position;
```

Confirme que as colunas aparecem:
- `proxima_acao` (timestamp with time zone, YES, null)
- `tarefa_concluida` (boolean, NO, false)
- `google_event_id` (text, YES, null)

## Passo 3: Testar insert/update

Execute no SQL Editor para confirmar que as colunas funcionam:

```sql
-- Teste: inserir lead com próxima ação
INSERT INTO public.leads (nome_lead, email, telefone, proxima_acao, tarefa_concluida)
VALUES ('Teste Sistema', 'teste@example.com', '912345678', NOW() + INTERVAL '1 day', false)
RETURNING id, nome_lead, proxima_acao, tarefa_concluida;

-- Verificar
SELECT id, nome_lead, proxima_acao, tarefa_concluida, google_event_id
FROM public.leads
WHERE nome_lead = 'Teste Sistema';

-- Apagar teste (opcional)
DELETE FROM public.leads WHERE nome_lead = 'Teste Sistema';
```

## ✅ Conclusão

Se todos os passos acima funcionaram sem erro:
- ✅ Schema do Supabase está pronto
- ✅ Sistema de Tarefas pode criar/concluir/reagendar
- ✅ Integração com Google Calendar está preparada

## Próximos passos

- Testar localmente: `npm run dev` no frontend
- Criar lead com "Próxima Ação" definida
- Verificar que aparece na página Tarefas
- Conectar Google OAuth (Settings) para sincronizar eventos
