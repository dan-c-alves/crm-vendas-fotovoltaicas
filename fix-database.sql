-- =======================================
-- SCRIPT PARA CORRIGIR ESTRUTURA DA TABELA LEADS
-- ADICIONAR COLUNA comissao_percentagem QUE ESTÁ FALTANDO
-- =======================================

-- 1. Verificar se a coluna existe
DO $$ 
BEGIN
    -- Tentar adicionar a coluna comissao_percentagem se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'comissao_percentagem'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.leads ADD COLUMN comissao_percentagem DECIMAL(5,4) DEFAULT 0.05;
    END IF;
END $$;

-- 2. Verificar se outras colunas importantes existem
DO $$ 
BEGIN
    -- Adicionar interesse se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'interesse'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.leads ADD COLUMN interesse TEXT;
    END IF;
    
    -- Adicionar motivo_perda se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'motivo_perda'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.leads ADD COLUMN motivo_perda TEXT;
    END IF;
    
    -- Adicionar proxima_acao se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'proxima_acao'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.leads ADD COLUMN proxima_acao TEXT;
    END IF;
    
    -- Adicionar tags se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'tags'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.leads ADD COLUMN tags TEXT;
    END IF;
    
    -- Adicionar url_imagem_cliente se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'url_imagem_cliente'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.leads ADD COLUMN url_imagem_cliente TEXT;
    END IF;
END $$;

-- 3. Verificar a estrutura resultante
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND table_schema = 'public'
ORDER BY ordinal_position;