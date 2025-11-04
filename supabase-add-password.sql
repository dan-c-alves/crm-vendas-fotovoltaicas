-- Script para adicionar campo password_hash e username na tabela users
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar campo password_hash se não existir
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- 2. Adicionar campo username se não existir
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username VARCHAR(255);

-- 3. Adicionar campo senha_hash (para compatibilidade com backend)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS senha_hash VARCHAR(255);

-- 4. Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
