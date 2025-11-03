-- MIGRAÇÃO: Adicionar autenticação simples (username + password_hash) à tabela users
-- Execute no Supabase SQL Editor

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users (username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- OPCIONAL: Criar o utilizador 'danilo' com senha '123456'
-- NOTA: a hash deve ser gerada pela aplicação; como referência, pode usar uma hash bcrypt de '123456'.
-- Hash gerada (bcrypt, custo 10) para '123456': $2a$10$W7b8r1w2QvJjJm3Jzv3fE.1b5h5j2V4G8m0lY2S7kHkS0n0Z0RzE.
-- Substitua abaixo por uma hash válida emitida pela aplicação, se preferir não usar esta de exemplo.
-- INSERT INTO public.users (email, nome, username, password_hash)
-- VALUES ('danilo@example.com', 'Danilo', 'danilo', '$2a$10$W7b8r1w2QvJjJm3Jzv3fE.1b5h5j2V4G8m0lY2S7kHkS0n0Z0RzE.');

-- DICA: Alternativamente, crie o utilizador via endpoint POST /api/auth/register e depois defina a senha em /settings.
