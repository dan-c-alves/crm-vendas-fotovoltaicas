# Autenticação simples (Frontend + Supabase)

Este projeto inclui uma autenticação leve baseada em:
- API Routes do Next.js (server-side)
- Hash de senha com bcryptjs
- JWT em cookie httpOnly (7 dias)
- Tabela `users` no Supabase com colunas `username` e `password_hash`

## 1) Migrar o Supabase

No Supabase, abra o SQL Editor e execute:

- `docs/MIGRACAO_AUTENTICACAO.sql`

Isso adiciona as colunas necessárias à tabela `users`.

## 2) Variáveis de ambiente (Frontend)

Defina um segredo para o JWT (em `.env.local`):

- `APP_JWT_SECRET` (ou `NEXT_PRIVATE_JWT_SECRET`) — valor forte, aleatório

Exemplo `.env.local` (Windows PowerShell):

APP_JWT_SECRET="coloque-um-segredo-aleatorio-aqui"
NEXT_PUBLIC_SUPABASE_URL="https://<PROJETO>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<chave-anon>"
NEXT_PUBLIC_API_URL="http://localhost:8000"

## 3) Fluxos

- Registo: /register (apenas Nome + Email). O username é derivado do email (antes do `@`).
- Login: /login (Email ou Username + Senha).
- Trocar senha: /settings (seção Conta).
- Logout: /settings botão "Terminar Sessão".

Rotas protegidas: `/leads`, `/tarefas`, `/settings` (middleware redireciona para `/login` se não autenticado).

## 4) Endpoints

- POST `/api/auth/register` → body: `{ nome, email }` (opcional: `username`, `password`) — cria utilizador e inicia sessão
- POST `/api/auth/login` → body: `{ identifier, password }` (identifier = email OU username)
- GET `/api/auth/me` → estado da sessão
- POST `/api/auth/logout` → termina sessão
- POST `/api/auth/change-password` → body: `{ newPassword }` (requer sessão)

## 5) Criar utilizador danilo/123456

Opção A (recomendado):
1. Acesse `/register` e crie o utilizador com nome e email (ex.: danilo@example.com)
2. Vá em `/settings` e defina a senha como `123456`
3. Faça login em `/login` com `danilo` (username gerado) ou com o email

Opção B (SQL direto):
- Gere uma hash bcrypt de `123456` (pelo endpoint de registo ou qualquer gerador seguro)
- Insira no Supabase conforme instruções comentadas em `docs/MIGRACAO_AUTENTICACAO.sql`

## 6) Deploy

- Depois do build (`npm run build`), lembre-se de definir `APP_JWT_SECRET` e as variáveis do Supabase no ambiente de produção.
- Em Vercel, configure as Environment Variables correspondentes.

