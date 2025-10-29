# 📁 Estrutura Completa do Projeto CRM Vendas Fotovoltaicas

## 🎯 Visão Geral

Este documento descreve a estrutura completa do projeto, com todos os ficheiros e pastas organizados de forma clara para facilitar a abertura no VS Code.

## 📂 Árvore de Pastas

```
crm-vendas-fotovoltaicas/
│
├── backend/                          # Backend Python/FastAPI
│   ├── app/
│   │   ├── __init__.py              # Inicialização do módulo
│   │   ├── database.py              # Configuração da base de dados
│   │   └── schemas.py               # Schemas Pydantic
│   │
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py              # Configurações da aplicação
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   └── lead.py                  # Modelos SQLAlchemy
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   └── leads.py                 # Rotas da API
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   └── calculators.py           # Utilitários de cálculo
│   │
│   ├── scripts/
│   │   ├── __init__.py
│   │   └── migrate_data.py          # Script de migração
│   │
│   ├── main.py                      # Arquivo principal da API
│   ├── requirements.txt             # Dependências Python
│   ├── .env.example                 # Variáveis de ambiente (exemplo)
│   └── .gitignore
│
├── frontend/                         # Frontend Next.js/React
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Layout raiz
│   │   │   ├── page.tsx             # Dashboard
│   │   │   ├── leads/
│   │   │   │   └── page.tsx         # Página de Leads
│   │   │   ├── vendas/
│   │   │   │   └── page.tsx         # Página de Vendas
│   │   │   ├── metas/
│   │   │   │   └── page.tsx         # Página de Metas
│   │   │   └── settings/
│   │   │       └── page.tsx         # Configurações
│   │   │
│   │   ├── components/
│   │   │   ├── Layout.tsx           # Layout principal
│   │   │   ├── Sidebar.tsx          # Barra lateral
│   │   │   ├── Header.tsx           # Cabeçalho
│   │   │   ├── MetricCard.tsx       # Card de métrica
│   │   │   ├── FunnelChart.tsx      # Gráfico funil
│   │   │   ├── TrendChart.tsx       # Gráfico tendência
│   │   │   ├── LeadsTable.tsx       # Tabela de leads
│   │   │   └── index.ts             # Exports
│   │   │
│   │   ├── context/
│   │   │   └── store.ts             # Zustand store
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css          # Estilos globais
│   │   │
│   │   └── utils/
│   │       └── api.ts               # Cliente HTTP
│   │
│   ├── public/                      # Ficheiros estáticos
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── .gitignore
│
├── data/                            # Base de dados (criada automaticamente)
│   └── crm_vendas.db
│
├── docs/                            # Documentação
│   ├── INSTALACAO_RAPIDA.md
│   ├── MIGRACAO_DADOS.md
│   └── API.md
│
├── .gitignore
└── README.md                        # Documentação principal
```

## 🚀 Como Abrir no VS Code

### 1. Abrir a Pasta do Projeto
```bash
# Abrir VS Code na pasta do projeto
code /home/ubuntu/crm-vendas-fotovoltaicas
```

### 2. Estrutura no Explorer do VS Code

No painel **Explorer** do VS Code (Ctrl+Shift+E), verá:

```
📁 crm-vendas-fotovoltaicas
 ├── 📁 backend
 │   ├── 📁 app
 │   ├── 📁 config
 │   ├── 📁 models
 │   ├── 📁 routes
 │   ├── 📁 utils
 │   ├── 📁 scripts
 │   ├── main.py
 │   ├── requirements.txt
 │   └── .env.example
 ├── 📁 frontend
 │   ├── 📁 src
 │   │   ├── 📁 app
 │   │   ├── 📁 components
 │   │   ├── 📁 context
 │   │   ├── 📁 styles
 │   │   └── 📁 utils
 │   ├── 📁 public
 │   ├── package.json
 │   ├── next.config.js
 │   ├── tsconfig.json
 │   └── ...
 ├── 📁 data
 ├── 📁 docs
 ├── .gitignore
 └── README.md
```

## 📋 Ficheiros Principais

### Backend

| Ficheiro | Descrição |
|----------|-----------|
| `backend/main.py` | Servidor FastAPI principal |
| `backend/app/database.py` | Configuração da base de dados |
| `backend/models/lead.py` | Modelos de dados (Lead, Meta, Notificação) |
| `backend/routes/leads.py` | Rotas da API |
| `backend/utils/calculators.py` | Cálculos de comissões e análises |
| `backend/config/settings.py` | Configurações da aplicação |

### Frontend

| Ficheiro | Descrição |
|----------|-----------|
| `frontend/src/app/page.tsx` | Dashboard principal |
| `frontend/src/app/leads/page.tsx` | Gestão de leads |
| `frontend/src/app/vendas/page.tsx` | Gestão de vendas |
| `frontend/src/app/metas/page.tsx` | Metas e gamificação |
| `frontend/src/components/Layout.tsx` | Layout principal |
| `frontend/src/utils/api.ts` | Cliente HTTP para API |
| `frontend/src/styles/globals.css` | Estilos Glassmorphism |

## 🔧 Configuração Inicial

### 1. Backend

1. Copiar `.env.example` para `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Editar `backend/.env` com as suas configurações

3. Instalar dependências:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. Executar servidor:
   ```bash
   python main.py
   ```

### 2. Frontend

1. Copiar `.env.example` para `.env.local`:
   ```bash
   cp frontend/.env.example frontend/.env.local
   ```

2. Editar `frontend/.env.local` com as suas configurações

3. Instalar dependências:
   ```bash
   cd frontend
   npm install
   ```

4. Executar servidor:
   ```bash
   npm run dev
   ```

## 📊 Dados Iniciais

Os dados antigos (104 leads, 16 vendas) podem ser migrados usando:

```bash
cd backend
python scripts/migrate_data.py
```

## 🌐 Acesso

- **Dashboard**: http://localhost:3000
- **API**: http://localhost:8000
- **Docs API**: http://localhost:8000/docs
- **Telemóvel (mesma rede)**: http://192.168.1.185:3000

## 📝 Notas Importantes

1. **Estrutura Clara**: Cada módulo tem uma responsabilidade específica
2. **Fácil Manutenção**: Código bem organizado e comentado
3. **Escalável**: Pronto para adicionar novas funcionalidades
4. **Responsivo**: Funciona em desktop e telemóvel
5. **Moderno**: Design Glassmorphism com Dark Mode

## 🆘 Troubleshooting

### Erro: "Module not found"
Certifique-se que instalou todas as dependências:
```bash
pip install -r requirements.txt  # Backend
npm install                      # Frontend
```

### Erro: "Port already in use"
A porta já está em uso. Altere em `main.py` ou `next.config.js`.

### Erro: "CORS error"
Verifique `ALLOWED_ORIGINS` em `backend/config/settings.py`.

## 📞 Suporte

Para dúvidas, consulte:
- `README.md` - Documentação principal
- `docs/INSTALACAO_RAPIDA.md` - Guia rápido
- `docs/API.md` - Documentação da API
- `docs/MIGRACAO_DADOS.md` - Migração de dados

---

**Versão**: 1.0.0  
**Status**: ✅ Pronto para uso

