-- =====================================================
-- SCRIPT DEFINITIVO - CONFIGURAR TABELA USERS
-- =====================================================
-- Execute este script COMPLETO no SQL Editor do Supabase
-- Ele vai:
-- 1. Verificar a estrutura atual
-- 2. Adicionar campos faltantes
-- 3. Criar índices para performance
-- 4. Inserir usuário admin
-- 5. Mostrar resultado final

-- PASSO 1: Ver estrutura atual
SELECT 'ESTRUTURA ATUAL DA TABELA USERS:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- PASSO 2: Adicionar campos se não existirem
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username VARCHAR(255);

-- PASSO 3: Criar índice único no username (opcional mas recomendado)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username 
ON users(username) 
WHERE username IS NOT NULL;

-- PASSO 4: Limpar dados antigos do admin se existirem
DELETE FROM users WHERE email = 'danilocalves86@gmail.com';

-- PASSO 5: Inserir usuário admin com TODOS os campos
INSERT INTO users (
    email, 
    nome, 
    username, 
    password_hash,
    data_criacao,
    data_atualizacao
)
VALUES (
    'danilocalves86@gmail.com', 
    'Danilo', 
    'danilo', 
    '$2b$10$g.FpRr.mus0G8hGHXOOTe.fhgzg12mcnSOogz/YDteujuMjtNW8Qa',
    NOW(),
    NOW()
);

-- PASSO 6: Verificar resultado
SELECT 'RESULTADO FINAL:' as info;
SELECT 
    id, 
    email, 
    nome, 
    username,
    CASE 
        WHEN password_hash IS NOT NULL THEN '✅ SIM' 
        ELSE '❌ NÃO' 
    END as tem_senha,
    LENGTH(password_hash) as tamanho_hash,
    data_criacao
FROM users
ORDER BY id;

-- PASSO 7: Contar total de usuários
SELECT 'TOTAL DE USUÁRIOS:' as info, COUNT(*) as total FROM users;

-- =====================================================
-- SE TUDO DEU CERTO, VOCÊ DEVE VER:
-- =====================================================
-- ✅ email: danilocalves86@gmail.com
-- ✅ nome: Danilo
-- ✅ username: danilo
-- ✅ tem_senha: SIM
-- ✅ tamanho_hash: 60 (bcrypt sempre gera 60 caracteres)
-- =====================================================

-- =====================================================
-- SE DER ERRO:
-- =====================================================
-- Erro "column already exists" = NORMAL, ignore
-- Erro "relation does not exist" = tabela users não existe!
--   Solução: crie a tabela primeiro com o script de criação
-- Erro "unique constraint" no username = username já existe
--   Solução: use DELETE antes do INSERT (já está no script)
-- =====================================================
