-- =======================================
-- SCRIPT PARA VERIFICAR ESTRUTURA ATUAL DA TABELA LEADS
-- =======================================

-- 1. Verificar se a tabela existe
SELECT 
    EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'leads'
    ) as tabela_existe;

-- 2. Verificar estrutura completa da tabela
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar tipos enumerados existentes
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value,
    e.enumsortorder as sort_order
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname IN ('lead_status', 'lead_origem')
ORDER BY t.typname, e.enumsortorder;

-- 4. Verificar dados existentes na tabela
SELECT 
    COUNT(*) as total_registros,
    ARRAY_AGG(DISTINCT status) as status_existentes
FROM public.leads;