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
