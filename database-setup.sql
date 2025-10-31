-- =======================================
-- SCRIPT DE CONFIGURAÇÃO SIMPLIFICADO DO BANCO SUPABASE
-- Projeto: crm-vendas-fotovoltaicas-v2
-- FOCO: RESOLVER PROBLEMA DE CRIAÇÃO DE LEADS
-- =======================================

-- 1. LIMPAR DADOS EXISTENTES
-- =======================================

-- Remover dados existentes
DELETE FROM public.leads;

-- Resetar a sequência do ID
ALTER SEQUENCE leads_id_seq RESTART WITH 1;

-- 2. CRIAR TIPOS ENUMERADOS (Database Enumerated Types)
-- =======================================

-- Tipo para status dos leads (só cria se não existir)
DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM (
        'Entrada de Lead',
        'Em Análise',
        'Proposta Enviada',
        'Em Negociação',
        'Vendido',
        'Perdido',
        'Cancelado'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tipo para origem dos leads (só cria se não existir)
DO $$ BEGIN
    CREATE TYPE lead_origem AS ENUM (
        'Website',
        'Facebook',
        'Instagram',
        'Google Ads',
        'Indicação',
        'Telefone',
        'Email',
        'Evento',
        'Outros'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CRIAR TABELA LEADS
-- =======================================

CREATE TABLE IF NOT EXISTS public.leads (
    id BIGSERIAL PRIMARY KEY,
    nome_lead VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    morada TEXT,
    origem lead_origem DEFAULT 'Website',
    interesse TEXT,
    notas_conversa TEXT,
    valor_venda_com_iva DECIMAL(10,2),
    valor_proposta DECIMAL(10,2),
    taxa_iva DECIMAL(4,4) DEFAULT 0.23,
    comissao_percentagem DECIMAL(4,4) DEFAULT 0.05,
    status lead_status DEFAULT 'Entrada de Lead',
    data_entrada TIMESTAMPTZ DEFAULT NOW(),
    data_atualizacao TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CRIAR ÍNDICES PARA PERFORMANCE
-- =======================================

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_telefone ON public.leads(telefone);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_data_entrada ON public.leads(data_entrada);

-- 5. HABILITAR RLS (Row Level Security)
-- =======================================

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 6. CRIAR POLÍTICAS DE SEGURANÇA (só se não existirem)
-- =======================================

-- Política para SELECT (leitura)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.leads;
CREATE POLICY "Enable read access for all users" ON public.leads
    FOR SELECT USING (true);

-- Política para INSERT (criação)
DROP POLICY IF EXISTS "Enable insert for all users" ON public.leads;
CREATE POLICY "Enable insert for all users" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Política para UPDATE (atualização)
DROP POLICY IF EXISTS "Enable update for all users" ON public.leads;
CREATE POLICY "Enable update for all users" ON public.leads
    FOR UPDATE USING (true);

-- Política para DELETE (exclusão)
DROP POLICY IF EXISTS "Enable delete for all users" ON public.leads;
CREATE POLICY "Enable delete for all users" ON public.leads
    FOR DELETE USING (true);

-- 7. TRIGGER PARA ATUALIZAR updated_at
-- =======================================

-- Primeiro, remover trigger se já existir
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;

-- Criar ou substituir a função
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar o trigger
CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON public.leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. INSERIR APENAS UM LEAD DE TESTE
-- =======================================

-- Inserir apenas 1 lead para testar
INSERT INTO public.leads (
    nome_lead, 
    email, 
    telefone, 
    morada, 
    origem, 
    interesse, 
    valor_venda_com_iva, 
    status
) VALUES (
    'João Silva - TESTE',
    'joao.teste@email.com',
    '912345678',
    'Rua das Flores, 123, Lisboa',
    'Website'::lead_origem,
    'Sistema fotovoltaico para casa de 150m²',
    15000.00,
    'Entrada de Lead'::lead_status
);

-- 9. VERIFICAR SE FUNCIONOU
-- =======================================

SELECT 
    'Tabela limpa e configurada!' as status,
    COUNT(*) as total_leads,
    ARRAY_AGG(DISTINCT status) as status_disponiveis
FROM public.leads;