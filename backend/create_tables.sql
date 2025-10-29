-- Criar tabela de leads
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    nome_lead VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(50),
    morada TEXT,
    status VARCHAR(100) DEFAULT 'Entrada de Lead',
    origem VARCHAR(100),
    interesse TEXT,
    observacoes TEXT,
    data_entrada TIMESTAMP DEFAULT NOW(),
    data_ultima_interacao TIMESTAMP,
    proxima_acao TEXT,
    valor_estimado_projeto DECIMAL(10,2),
    valor_venda_sem_iva DECIMAL(10,2),
    valor_venda_com_iva DECIMAL(10,2),
    taxa_iva DECIMAL(5,2) DEFAULT 23.00,
    comissao_percentual DECIMAL(5,2),
    comissao_valor DECIMAL(10,2),
    descricao_sistema TEXT,
    potencia_sistema DECIMAL(8,2),
    tipo_instalacao VARCHAR(100),
    notas_conversa TEXT,
    ficheiros_anexos TEXT,
    data_agendamento TIMESTAMP,
    vendedor VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de usuários (para futuro sistema de login)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    google_id VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_data_entrada ON leads(data_entrada);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_telefone ON leads(telefone);

-- Inserir alguns dados de teste
INSERT INTO leads (
    nome_lead, email, telefone, morada, status, origem, interesse, 
    valor_venda_com_iva, comissao_valor, notas_conversa
) VALUES 
(
    'João Silva', 
    'joao.silva@email.com', 
    '+351 912 345 678', 
    'Rua das Flores, 123, Lisboa', 
    'Ganho', 
    'Website', 
    'Sistema residencial 5kW',
    8500.00,
    340.00,
    'Cliente muito interessado, fechou negócio rapidamente.'
),
(
    'Maria Santos', 
    'maria.santos@email.com', 
    '+351 923 456 789', 
    'Avenida Central, 456, Porto', 
    'Interessado', 
    'Referência', 
    'Sistema comercial 10kW',
    15000.00,
    600.00,
    'Aguardando orçamento final.'
),
(
    'Pedro Costa', 
    'pedro.costa@email.com', 
    '+351 934 567 890', 
    'Travessa do Sol, 789, Braga', 
    'Hot Lead', 
    'Facebook', 
    'Sistema residencial 3kW',
    5500.00,
    220.00,
    'Muito interessado, agendar visita técnica.'
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();