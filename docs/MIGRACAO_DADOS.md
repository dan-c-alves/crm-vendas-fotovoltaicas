# Migração de Dados do CRM Antigo

Este documento explica como migrar os dados do seu CRM antigo para o novo sistema.

## 📋 Dados Disponíveis

Você tem:
- **104 leads** no total
- **16 vendas** fechadas (status = "Ganho")
- Base de dados SQLite: `crm_database.db`

## 🔄 Processo de Migração

### Opção 1: Migração Automática (Recomendado)

1. **Copiar a base de dados antiga:**
   ```bash
   cp /caminho/antigo/crm_database.db /home/ubuntu/crm-vendas-fotovoltaicas/data/crm_vendas.db
   ```

2. **Executar script de migração:**
   ```bash
   cd backend
   python -c "from app.database import init_db; init_db()"
   ```

### Opção 2: Importação via API

1. **Exportar dados da base de dados antiga:**
   ```bash
   sqlite3 crm_database.db "SELECT * FROM leads" > leads.csv
   ```

2. **Usar script de importação:**
   ```bash
   cd backend
   python scripts/import_leads.py leads.csv
   ```

## 📊 Mapeamento de Campos

| Campo Antigo | Campo Novo | Notas |
|---|---|---|
| id | id | Mantém-se igual |
| nome_lead | nome_lead | Sem alterações |
| email | email | Sem alterações |
| telefone | telefone | Sem alterações |
| morada | morada | Sem alterações |
| status | status | Sem alterações |
| valor_venda_com_iva | valor_venda_com_iva | Sem alterações |
| taxa_iva | taxa_iva | Padrão: 0.23 (23%) |
| notas_conversa | notas_conversa | Sem alterações |
| proxima_acao | proxima_acao | Sem alterações |
| motivo_perda | motivo_perda | Sem alterações |
| contador_tentativas | contador_tentativas | Sem alterações |
| data_entrada | data_entrada | Sem alterações |
| data_atualizacao | data_atualizacao | Sem alterações |

## ✅ Verificação Pós-Migração

Após a migração, verifique:

1. **Número de leads:**
   ```bash
   curl http://localhost:8000/api/leads/analytics/stats
   ```

2. **Dados de vendas:**
   ```bash
   curl http://localhost:8000/api/leads/funil/vendas
   ```

3. **Cálculo de comissões:**
   ```bash
   curl -X POST http://localhost:8000/api/leads/calculadora/comissao \
     -H "Content-Type: application/json" \
     -d '{"valor_com_iva": 5000, "taxa_iva": 0.23, "percentagem": 0.05}'
   ```

## 🔧 Troubleshooting

### Erro: "Ficheiro não encontrado"
Certifique-se que o caminho para `crm_database.db` está correto.

### Erro: "Tabela já existe"
Execute `DROP TABLE leads;` na base de dados antiga antes de importar.

### Dados incompletos
Verifique se todos os campos estão mapeados corretamente.

## 📝 Exemplo de Dados Migrados

Após a migração bem-sucedida, deverá ter:

```json
{
  "total_leads": 104,
  "total_vendas": 16,
  "valor_total_vendas": 5000.00,
  "comissao_total": 203.25,
  "taxa_conversao": 15.38
}
```

## 🆘 Suporte

Se encontrar problemas durante a migração, contacte o suporte.

