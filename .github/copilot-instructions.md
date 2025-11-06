# Instruções rápidas para agentes de código (Copilot / AI)

Objetivo: tornar um agente de código produtivo rapidamente neste repositório.

- Stack principal: Frontend Next.js (TypeScript) + Backend Python (FastAPI + SQLAlchemy). API REST entre eles. DB: PostgreSQL (Railway/Supabase).

- Arquitetura e pontos de entrada úteis:
  - Backend: `backend/main.py` (inicia FastAPI; chama `app.database.init_db()` no startup).
  - DB init: `backend/app/database.py` (cria tabelas chamando `Base.metadata.create_all`). Ao adicionar um novo modelo, importe seu `Base` aqui para que a tabela seja criada.
  - Models: `backend/models/` (ex.: `lead.py`, `user.py`). Padrões: `Base = declarative_base()` e método `to_dict()` em cada entidade.
  - Rotas: `backend/routes/` — `leads.py` contém a maior parte da lógica de domínio (criação/atualização de leads, cálculo de comissões, integração com Google Calendar).
  - Config: `backend/config/settings.py` contém variáveis importantes (DATABASE_URL, ALLOWED_ORIGINS, COMISSAO_PERCENTAGEM, IVA_TAXA, GOOGLE_* e CLOUDINARY_*).
  - Frontend: `frontend/` (Next.js). Cliente HTTP e chamadas à API ficam em `frontend/src/utils/api.ts`. Variável de ambiente: `NEXT_PUBLIC_API_URL`.

- Convenções e padrões específicos ao projeto:
  - Soft delete: leads têm `ativo` booleano em `models/lead.py`. Não remova entradas do DB — marque `ativo = False`.
  - Comissão: sempre 5% sobre o valor sem IVA (implementado em `utils/calculators.py` e usado em `routes/leads.py`). Taxa de IVA padrão: 23% (config em `settings.py`).
  - Google Calendar: o token do Google é armazenado na tabela `users` (registro padrão criado com id=1). Código assume `user.id == 1` para operações de calendário. Ver `utils/calendar.py` e a lógica em `routes/leads.py`.
  - Uploads/imagens: Cloudinary é usado tanto no frontend quanto no backend. Chaves em `settings.py`.
  - Timezones: `routes/leads.py` converte ISO strings para timezone `Europe/Lisbon` e depois utiliza `replace(tzinfo=None)` antes de salvar — atenção a datas timezone-aware vs naive.

- Fluxos de desenvolvimento / comandos (Windows PowerShell):
  - Backend (rápido):
    cd backend; python -m venv venv; venv\Scripts\activate; pip install -r requirements.txt; python main.py
    (servidor: http://localhost:8000)
  - Frontend:
    cd frontend; npm install; $env:NEXT_PUBLIC_API_URL="http://localhost:8000"; npm run dev
    (servidor Next: http://localhost:3000)
  - Migração DB (adicionar campo tarefa_concluida):
    cd backend; python scripts\add_tarefa_concluida_column.py

- Dicas práticas ao editar código:
  - Se adicionar um novo modelo SQLAlchemy, importe o Base correspondente em `backend/app/database.py` ou as tabelas não serão criadas automaticamente.
  - Alterações ao cálculo de comissão devem atualizar `utils/calculators.py` e a utilização em `routes/leads.py` para manter consistência.
  - Ao mexer na integração Google Calendar, teste com o utilizador padrão (id=1) ou atualize a lógica de lookup de token.
  - Evite mudanças que assumam que `proxima_acao` é timezone-aware; o código atual armazena sem tz.
  - **Google OAuth**: Client ID e Secret devem estar nas variáveis de ambiente do Railway. URIs de redirect: `https://crm-vendas-fotovoltaicas-production.up.railway.app/api/auth/google/callback`. Ver `GOOGLE_CLOUD_SETUP.md` para configuração completa.

- Arquivos que exemplificam padrões importantes:
  - `backend/routes/leads.py` — lógica de negócio + integração externa (Google Calendar)
  - `backend/app/database.py` — inicialização do DB e criação de tabelas
  - `backend/models/lead.py` — esquema, to_dict e campos especiais (google_event_id, url_imagem_cliente, ativo)
  - `backend/config/settings.py` — feature flags / segredos (GOOGLE_* e CLOUDINARY_*)
  - `frontend/src/utils/api.ts` — cliente HTTP consumindo a API

- Restrições e armadilhas conhecidas:
  - O projeto agora usa PostgreSQL (Railway/Supabase); `DATABASE_URL` deve apontar para servidor PostgreSQL.
  - `init_db()` é chamado no import/startup; cuidado ao executar migrações manuais — o repositório não tem Alembic configurado.
  - O token do Google é guardado em texto no DB (`google_calendar_token`) — trate como sensível.
  - Sistema de tarefas: campo `tarefa_concluida` controla se tarefa aparece na lista. `proxima_acao=None` + `tarefa_concluida=True` = tarefa concluída.
  - Página "Vendas" foi removida da aplicação (apenas Dashboard, Leads, Tarefas e Configurações).

Se algo aqui estiver incompleto ou você quiser que eu inclua exemplos de PR/commit, testes rápidos ou instruções para adicionar um novo endpoint, diga o que quer detalhar e eu atualizo o ficheiro.
