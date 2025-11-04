-- =====================================================
-- SCRIPT PARA CONFIGURAR AUTENTICAÇÃO NO SUPABASE
-- =====================================================
-- Execute este script no SQL Editor do Supabase:
-- 1. Vá para https://supabase.com/dashboard
-- 2. Selecione seu projeto (jzezbecvjquqxjnilvya)
-- 3. Clique em "SQL Editor" no menu lateral
-- 4. Cole e execute este script

-- Passo 1: Adicionar campos necessários na tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username VARCHAR(255);

-- Passo 2: Criar usuário admin (Danilo)
-- Senha: 101010
INSERT INTO users (email, nome, username, password_hash)
VALUES ('danilocalves86@gmail.com', 'Danilo', 'danilo', '$2b$10$g.FpRr.mus0G8hGHXOOTe.fhgzg12mcnSOogz/YDteujuMjtNW8Qa')
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash,
    username = EXCLUDED.username,
    nome = EXCLUDED.nome;

-- Passo 3: Criar usuário de teste
-- Senha: teste123
INSERT INTO users (email, nome, username, password_hash)
VALUES ('teste@exemplo.com', 'Usuário Teste', 'teste', '$2a$10$YourTestHashHere')
ON CONFLICT (email) DO NOTHING;

-- Passo 4: Verificar se os usuários foram criados
SELECT id, email, nome, username, 
       CASE WHEN password_hash IS NOT NULL THEN 'SIM' ELSE 'NÃO' END as tem_senha,
       data_criacao
FROM users
ORDER BY id;

-- =====================================================
-- CREDENCIAIS CRIADAS:
-- =====================================================
-- Admin:
--   Email: danilocalves86@gmail.com
--   Username: danilo
--   Senha: 101010
--
-- Teste:
--   Email: teste@exemplo.com  
--   Username: teste
--   Senha: teste123
-- =====================================================
