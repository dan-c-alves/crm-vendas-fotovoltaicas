-- =======================================
-- RECRIAR TABELA LEADS COM ESTRUTURA CORRETA
-- =======================================

-- 1. Remover tabela existente se houver
DROP TABLE IF EXISTS public.leads CASCADE;

-- 2. Criar tipos enumerados
DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM (
        'Entrada de Lead',
        'Em Análise', 
        'Proposta Enviada',
        'Em Negociação',
        'Ganho',
        'Perdido',
        'Cancelado'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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

-- 3. Criar tabela com TODAS as colunas necessárias
CREATE TABLE public.leads (
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
    taxa_iva DECIMAL(5,4) DEFAULT 0.23,
    comissao_percentagem DECIMAL(5,4) DEFAULT 0.05,
    status lead_status DEFAULT 'Entrada de Lead',
    motivo_perda TEXT,
    proxima_acao TEXT,
    tags TEXT,
    url_imagem_cliente TEXT,
    data_entrada TIMESTAMPTZ DEFAULT NOW(),
    data_atualizacao TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Criar índices
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_telefone ON public.leads(telefone);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_data_entrada ON public.leads(data_entrada);

-- 5. Habilitar RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas
CREATE POLICY "Enable read access for all users" ON public.leads
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.leads
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.leads
    FOR DELETE USING (true);

-- 7. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON public.leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Inserir um lead de teste
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
    'João Silva - TESTE NOVO',
    'joao.novo@email.com',
    '912345678',
    'Rua das Flores, 123, Lisboa',
    'Website'::lead_origem,
    'Sistema fotovoltaico para casa de 150m²',
    15000.00,
    'Entrada de Lead'::lead_status
);

-- 9. Verificar resultado
SELECT 
    'Tabela recriada com sucesso!' as status,
    COUNT(*) as total_leads
FROM public.leads;