# Migração rápida no Supabase (Leads)

Use este script para garantir que as colunas exigidas pelo sistema de Tarefas existam na tabela `leads` no Supabase.

## Passos

1. Acesse seu projeto Supabase > SQL Editor
2. Copie o conteúdo do arquivo `supabase/ensure_leads_schema.sql`
3. Cole no editor e execute
4. Verifique se os campos aparecem na tabela `leads`:
   - `proxima_acao` (timestamptz)
   - `tarefa_concluida` (boolean, default false)
   - `google_event_id` (text)

## Observações
- Índices opcionais são criados para melhorar performance em consultas de tarefas.
- Não remove nem altera dados existentes; apenas adiciona colunas caso faltem.
- Se você usa o backend com PostgreSQL próprio (Railway), há também um script de migração em `backend/scripts/add_tarefa_concluida_column.py`.
