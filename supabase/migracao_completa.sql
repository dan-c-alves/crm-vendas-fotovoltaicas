-- Migração completa para Supabase - Sistema de Tarefas CRM
-- Execute este SQL no Supabase SQL Editor: https://supabase.com/dashboard/project/jzezbecvjquqxjnilvya/sql

-- ============================================================
-- 1. ADICIONAR COLUNAS NA TABELA LEADS
-- ============================================================

-- Próxima ação (data/hora da tarefa)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS proxima_acao TIMESTAMPTZ NULL;

-- Flag para indicar se a tarefa foi concluída
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS tarefa_concluida BOOLEAN NOT NULL DEFAULT false;

-- ID do evento no Google Calendar (para sincronização)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS google_event_id TEXT NULL;

-- Contador de tentativas de contato
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS contador_tentativas INTEGER NOT NULL DEFAULT 0;

-- Flag de controle (para soft delete)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT true;

-- ============================================================
-- 2. ADICIONAR COLUNA NA TABELA USERS
-- ============================================================

-- Token de autenticação do Google Calendar
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_calendar_token TEXT NULL;

-- Datas de auditoria (se não existirem)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS data_criacao TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS data_atualizacao TIMESTAMPTZ DEFAULT NOW();

-- ============================================================
-- 3. CRIAR ÍNDICES PARA MELHORAR PERFORMANCE
-- ============================================================

-- Índice para buscar tarefas pendentes rapidamente
CREATE INDEX IF NOT EXISTS idx_leads_tarefas_pendentes 
ON leads(proxima_acao, tarefa_concluida) 
WHERE ativo = true AND proxima_acao IS NOT NULL AND tarefa_concluida = false;

-- Índice para buscar por google_event_id
CREATE INDEX IF NOT EXISTS idx_leads_google_event 
ON leads(google_event_id) 
WHERE google_event_id IS NOT NULL;

-- ============================================================
-- 4. VERIFICAÇÃO
-- ============================================================

-- Listar todas as colunas da tabela leads
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

-- Listar todas as colunas da tabela users
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Contar leads com e sem próxima ação
SELECT 
    COUNT(*) AS total_leads,
    COUNT(proxima_acao) AS leads_com_data,
    COUNT(CASE WHEN tarefa_concluida = true THEN 1 END) AS tarefas_concluidas,
    COUNT(CASE WHEN proxima_acao IS NOT NULL AND tarefa_concluida = false THEN 1 END) AS tarefas_pendentes
FROM leads
WHERE ativo = true;
