# Documentação da API

## Base URL
```
http://localhost:8000
```

## Autenticação
Atualmente, a API não requer autenticação. Em produção, recomenda-se adicionar JWT.

## Endpoints

### Health Check
```
GET /health
```

Resposta:
```json
{
  "status": "ok",
  "message": "CRM API está funcionando"
}
```

---

## Leads

### Listar Leads
```
GET /api/leads/?skip=0&limit=20&status=Ganho&search=João
```

**Parâmetros:**
- `skip` (int): Número de registos a saltar (padrão: 0)
- `limit` (int): Número de registos a retornar (padrão: 20, máx: 100)
- `status` (string, opcional): Filtrar por status
- `search` (string, opcional): Buscar por nome ou email

**Resposta:**
```json
{
  "total": 104,
  "page": 1,
  "page_size": 20,
  "total_pages": 6,
  "data": [
    {
      "id": 1,
      "nome_lead": "João Silva",
      "email": "joao@email.com",
      "telefone": "912345678",
      "morada": "Rua Principal, 123",
      "status": "Ganho",
      "valor_venda_com_iva": 5000.00,
      "taxa_iva": 0.23,
      "comissao_valor": 203.25,
      "data_entrada": "2025-10-01T10:00:00",
      "data_atualizacao": "2025-10-15T14:30:00",
      "ativo": true
    }
  ]
}
```

### Obter Lead Específico
```
GET /api/leads/{id}
```

**Resposta:**
```json
{
  "id": 1,
  "nome_lead": "João Silva",
  "email": "joao@email.com",
  ...
}
```

### Criar Lead
```
POST /api/leads/
Content-Type: application/json

{
  "nome_lead": "Maria Santos",
  "email": "maria@email.com",
  "telefone": "912345678",
  "morada": "Avenida Principal, 456",
  "status": "Entrada de Lead",
  "valor_venda_com_iva": 3500.00,
  "taxa_iva": 0.23,
  "comissao_percentagem": 0.05,
  "notas_conversa": "Cliente interessado em painéis solares",
  "origem": "Website"
}
```

**Resposta:** (201 Created)
```json
{
  "id": 105,
  "nome_lead": "Maria Santos",
  ...
}
```

### Atualizar Lead
```
PUT /api/leads/{id}
Content-Type: application/json

{
  "status": "Ganho",
  "valor_venda_com_iva": 5000.00,
  "notas_conversa": "Venda confirmada"
}
```

**Resposta:** (200 OK)
```json
{
  "id": 1,
  "nome_lead": "João Silva",
  ...
}
```

### Eliminar Lead
```
DELETE /api/leads/{id}
```

**Resposta:** (204 No Content)

---

## Filtros e Buscas

### Leads por Status
```
GET /api/leads/status/{status}
```

**Exemplo:**
```
GET /api/leads/status/Ganho
```

### Buscar Leads
```
GET /api/leads/search/?q=João
```

---

## Análises

### Estatísticas Gerais
```
GET /api/leads/analytics/stats
```

**Resposta:**
```json
{
  "total_leads": 104,
  "total_vendas": 16,
  "valor_total_vendas": 80000.00,
  "comissao_total": 3250.00,
  "taxa_conversao": 15.38,
  "valor_medio_venda": 5000.00,
  "comissao_media": 203.25
}
```

### Distribuição por Status
```
GET /api/leads/analytics/distribuicao
```

**Resposta:**
```json
{
  "Entrada de Lead": 30,
  "Contactados": 25,
  "Levantamento Técnico": 15,
  "Em Orçamentação": 10,
  "Proposta Entregue": 8,
  "Follow-up": 5,
  "Negociação": 3,
  "Hot Lead": 2,
  "Ganho": 16,
  "Perdidos": 5,
  "Não Atende": 3
}
```

### Vendas por Mês
```
GET /api/leads/analytics/vendas-mes
```

**Resposta:**
```json
{
  "2025-10": 15000.00,
  "2025-09": 20000.00,
  "2025-08": 12000.00,
  ...
}
```

### Comissões por Mês
```
GET /api/leads/analytics/comissoes-mes
```

**Resposta:**
```json
{
  "2025-10": 612.50,
  "2025-09": 816.67,
  "2025-08": 490.00,
  ...
}
```

### Funil de Vendas
```
GET /api/leads/funil/vendas
```

**Resposta:**
```json
{
  "Entrada de Lead": 30,
  "Contactados": 25,
  "Levantamento Técnico": 15,
  "Em Orçamentação": 10,
  "Proposta Entregue": 8,
  "Follow-up": 5,
  "Negociação": 3,
  "Hot Lead": 2,
  "Ganho": 16,
  "Perdidos": 5,
  "Não Atende": 3
}
```

---

## Calculadora

### Calcular Comissão
```
POST /api/leads/calculadora/comissao
Content-Type: application/json

{
  "valor_com_iva": 5000.00,
  "taxa_iva": 0.23,
  "percentagem": 0.05
}
```

**Resposta:**
```json
{
  "valor_com_iva": 5000.00,
  "valor_sem_iva": 4065.04,
  "iva": 934.96,
  "taxa_iva": 0.23,
  "comissao": 203.25,
  "percentagem_comissao": 0.05
}
```

---

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Requisição bem-sucedida, sem conteúdo |
| 400 | Bad Request - Requisição inválida |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## Exemplo de Uso com cURL

### Listar leads
```bash
curl http://localhost:8000/api/leads/
```

### Criar lead
```bash
curl -X POST http://localhost:8000/api/leads/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome_lead": "João Silva",
    "email": "joao@email.com",
    "status": "Entrada de Lead"
  }'
```

### Atualizar lead
```bash
curl -X PUT http://localhost:8000/api/leads/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "Ganho"}'
```

### Eliminar lead
```bash
curl -X DELETE http://localhost:8000/api/leads/1
```

---

## Exemplo de Uso com Python

```python
import requests

API_URL = "http://localhost:8000"

# Listar leads
response = requests.get(f"{API_URL}/api/leads/")
leads = response.json()

# Criar lead
new_lead = {
    "nome_lead": "João Silva",
    "email": "joao@email.com",
    "status": "Entrada de Lead"
}
response = requests.post(f"{API_URL}/api/leads/", json=new_lead)
created_lead = response.json()

# Atualizar lead
update_data = {"status": "Ganho"}
response = requests.put(f"{API_URL}/api/leads/1", json=update_data)

# Eliminar lead
response = requests.delete(f"{API_URL}/api/leads/1")
```

---

## Exemplo de Uso com JavaScript

```javascript
const API_URL = "http://localhost:8000";

// Listar leads
fetch(`${API_URL}/api/leads/`)
  .then(res => res.json())
  .then(data => console.log(data));

// Criar lead
const newLead = {
  nome_lead: "João Silva",
  email: "joao@email.com",
  status: "Entrada de Lead"
};

fetch(`${API_URL}/api/leads/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newLead)
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Rate Limiting

Atualmente, não há rate limiting. Em produção, recomenda-se implementar.

## Versão da API

Versão atual: **1.0.0**

