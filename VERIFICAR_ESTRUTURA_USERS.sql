-- ================================================
-- VERIFICAR ESTRUTURA DA TABELA USERS NO SUPABASE
-- ================================================
-- Execute este script no SQL Editor do Supabase para verificar
-- se os campos password_hash e username foram criados

-- 1. Ver todas as colunas da tabela users
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 2. Ver estrutura completa da tabela
\d users;

-- 3. Se os campos NÃO existirem, execute novamente:
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255);

-- 4. Verificar se o usuário admin existe
SELECT id, email, nome, username, 
       CASE WHEN password_hash IS NOT NULL THEN 'SIM' ELSE 'NÃO' END as tem_senha
FROM users 
WHERE email = 'danilocalves86@gmail.com';

-- ================================================
-- DIAGNÓSTICO COMUM:
-- ================================================
-- Se a coluna password_hash NÃO aparecer na listagem,
-- significa que o script anterior não foi executado
-- ou teve algum erro.
--
-- SOLUÇÃO: Execute os comandos ALTER TABLE acima
-- ================================================
