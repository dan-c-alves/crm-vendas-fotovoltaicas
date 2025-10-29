# CRM Vendas Fotovoltaicas - Sistema Inovador

Um sistema completo de gestão de vendas fotovoltaicas com design moderno (Glassmorphism + Dark Mode), desenvolvido com **Next.js/React** no frontend e **Python/FastAPI** no backend.

## 🎯 Características Principais

- **Dashboard Interativo**: Visualização em tempo real de métricas e tendências
- **Gestão de Leads**: Controle completo do funil de vendas
- **Cálculo Automático de Comissões**: 5% sobre o valor sem IVA (com IVA de 23%)
- **Análise de Vendas**: Gráficos avançados e relatórios
- **Sistema de Metas**: Acompanhamento de objetivos e gamificação
- **Design Glassmorphism**: Interface moderna com Dark Mode
- **Responsivo**: Funciona perfeitamente em desktop e telemóvel
- **API RESTful**: Backend robusto com FastAPI

## 📁 Estrutura de Pastas

```
crm-vendas-fotovoltaicas/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py          # Configuração da BD
│   │   └── schemas.py           # Validação de dados
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py          # Configurações
│   ├── models/
│   │   ├── __init__.py
│   │   └── lead.py              # Modelos de dados
│   ├── routes/
│   │   ├── __init__.py
│   │   └── leads.py             # Rotas da API
│   ├── utils/
│   │   ├── __init__.py
│   │   └── calculators.py       # Cálculos e análises
│   ├── main.py                  # Aplicação principal
│   └── requirements.txt         # Dependências Python
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Layout raiz
│   │   │   ├── page.tsx         # Dashboard
│   │   │   ├── leads/
│   │   │   │   └── page.tsx     # Página de Leads
│   │   │   ├── vendas/
│   │   │   │   └── page.tsx     # Página de Vendas
│   │   │   ├── metas/
│   │   │   │   └── page.tsx     # Página de Metas
│   │   │   └── settings/
│   │   │       └── page.tsx     # Configurações
│   │   ├── components/
│   │   │   ├── Layout.tsx       # Layout principal
│   │   │   ├── Sidebar.tsx      # Barra lateral
│   │   │   ├── Header.tsx       # Cabeçalho
│   │   │   ├── MetricCard.tsx   # Card de métrica
│   │   │   ├── FunnelChart.tsx  # Gráfico funil
│   │   │   ├── TrendChart.tsx   # Gráfico tendência
│   │   │   ├── LeadsTable.tsx   # Tabela de leads
│   │   │   └── index.ts         # Exports
│   │   ├── context/
│   │   │   └── store.ts         # Zustand store
│   │   ├── styles/
│   │   │   └── globals.css      # Estilos globais
│   │   └── utils/
│   │       └── api.ts           # Cliente HTTP
│   ├── public/                  # Ficheiros estáticos
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── data/                        # Base de dados
│   └── crm_vendas.db
│
├── docs/                        # Documentação
├── .gitignore
└── README.md
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- **Node.js** 18+ (para frontend)
- **Python** 3.9+ (para backend)
- **npm** ou **pnpm** (gestor de pacotes Node)
- **pip** (gestor de pacotes Python)

### Backend (Python/FastAPI)

1. **Navegar para a pasta do backend:**
   ```bash
   cd backend
   ```

2. **Criar ambiente virtual:**
   ```bash
   python -m venv venv
   ```

3. **Ativar ambiente virtual:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Instalar dependências:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Executar servidor:**
   ```bash
   python main.py
   ```

   O servidor estará disponível em: `http://localhost:8000`

### Frontend (Next.js/React)

1. **Navegar para a pasta do frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependências:**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Criar ficheiro `.env.local`:**
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Executar servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```

   A aplicação estará disponível em: `http://localhost:3000`

## 🔧 Configuração Inicial

### 1. Migrar Dados Existentes

Se tem dados de um CRM anterior, pode importá-los. Consulte a documentação em `/docs/MIGRACAO_DADOS.md`.

### 2. Configurar Comissões

As comissões são calculadas automaticamente:
- **Percentagem**: 5% (configurável em `backend/config/settings.py`)
- **Cálculo**: Comissão = (Valor com IVA / 1.23) × 0.05
- **Exemplo**: Venda de €5000 → Comissão de €203.25

### 3. Personalizar Configurações

Edite `backend/config/settings.py` para:
- Alterar percentagem de comissão
- Modificar taxa de IVA
- Configurar CORS
- Definir variáveis de ambiente

## 📊 Funcionalidades Detalhadas

### Dashboard
- Métricas em tempo real (leads, vendas, comissões)
- Gráficos interativos (funil, tendências)
- Taxa de conversão
- Informações rápidas

### Gestão de Leads
- Lista completa de leads
- Filtros por status
- Busca por nome/email
- Edição e eliminação
- Histórico de ações

### Gestão de Vendas
- Visualização de vendas fechadas
- Análise de tendências
- Cálculo de comissões
- Exportação de dados

### Metas e Gamificação
- Definição de metas mensais
- Acompanhamento de progresso
- Sistema de pontos
- Badges e conquistas

### Calculadora de Comissões
- Cálculo em tempo real
- Suporte a múltiplas taxas de IVA
- Histórico de cálculos
- Exportação de propostas

## 🌐 Acesso Remoto

### Acesso Local
- **Desktop**: `http://localhost:3000`
- **Telemóvel (mesma rede)**: `http://192.168.1.185:3000`

### Acesso Remoto (com ngrok ou similar)
```bash
# No terminal do frontend
ngrok http 3000
```

Utilize o URL fornecido pelo ngrok para aceder remotamente.

## 📱 Responsividade

A aplicação foi desenvolvida com design responsivo:
- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado
- **Telemóvel**: Menu hamburger, tabelas otimizadas

## 🔒 Segurança

- Variáveis de ambiente para dados sensíveis
- CORS configurado
- Validação de entrada com Pydantic
- Soft delete para dados (não elimina permanentemente)

## 📚 API Endpoints

### Leads
- `GET /api/leads/` - Listar leads (paginado)
- `GET /api/leads/{id}` - Obter lead específico
- `POST /api/leads/` - Criar novo lead
- `PUT /api/leads/{id}` - Atualizar lead
- `DELETE /api/leads/{id}` - Eliminar lead

### Análises
- `GET /api/leads/analytics/stats` - Estatísticas gerais
- `GET /api/leads/analytics/distribuicao` - Distribuição por status
- `GET /api/leads/analytics/vendas-mes` - Vendas por mês
- `GET /api/leads/analytics/comissoes-mes` - Comissões por mês
- `GET /api/leads/funil/vendas` - Dados do funil

### Calculadora
- `POST /api/leads/calculadora/comissao` - Calcular comissão

## 🛠️ Troubleshooting

### Erro de CORS
Verifique `ALLOWED_ORIGINS` em `backend/config/settings.py`

### Erro de Conexão à BD
Certifique-se que a pasta `data/` existe e tem permissões de escrita

### Erro ao carregar dados
Verifique se o backend está em execução em `http://localhost:8000`

## 📖 Documentação Adicional

- [Guia de Instalação Detalhado](./docs/INSTALACAO.md)
- [Migração de Dados](./docs/MIGRACAO_DADOS.md)
- [API Reference](./docs/API.md)
- [Guia de Desenvolvimento](./docs/DESENVOLVIMENTO.md)

## 🤝 Contribuições

Para sugestões ou melhorias, contacte o desenvolvedor.

## 📄 Licença

Todos os direitos reservados © 2025

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou contacte o suporte.

---

**Versão**: 1.0.0  
**Última atualização**: Outubro 2025  
**Status**: ✅ Pronto para produção

