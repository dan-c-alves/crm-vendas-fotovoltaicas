"""
Script para testar a API de leads com data de próxima ação
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000"

def test_add_date():
    """Testa adicionar data a um lead via API"""
    
    # 1. Listar leads existentes
    print("\n=== BUSCANDO LEADS ===")
    response = requests.get(f"{BASE_URL}/api/leads")
    if response.status_code != 200:
        print(f"❌ Erro ao buscar leads: {response.status_code}")
        print(f"Resposta: {response.text}")
        return
    
    data = response.json()
    leads = data.get('leads', [])
    
    if not leads:
        print("❌ Nenhum lead encontrado! Criando lead de teste...")
        
        # Criar um lead de teste
        new_lead = {
            "nome_lead": "João Silva - Teste",
            "email": "joao.teste@exemplo.com",
            "telefone": "912345678",
            "status": "Entrada de Lead",
            "origem": "Website",  # Usar valor válido do ENUM
            "valor_venda_com_iva": 6150,
            "valor_proposta": 5000
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=new_lead)
        if response.status_code not in [200, 201]:
            print(f"❌ Erro ao criar lead: {response.status_code}")
            print(f"Resposta: {response.text}")
            return
        
        created_lead = response.json()
        print(f"✅ Lead de teste criado! ID: {created_lead.get('id')}")
        
        # Usar o lead recém-criado
        leads = [created_lead]
    
    print(f"✅ Encontrados {len(leads)} leads")
    for lead in leads[:3]:  # Mostrar apenas os 3 primeiros
        nome = lead.get('nome_lead', lead.get('nome_cliente', 'Sem nome'))
        print(f"  - ID: {lead['id']} | Nome: {nome} | Status: {lead['status']}")
        if lead.get('proxima_acao'):
            print(f"    └─ Próxima ação: {lead['proxima_acao']}")
    
    # 2. Pegar o primeiro lead
    lead = leads[0]
    lead_id = lead['id']
    nome = lead.get('nome_lead', lead.get('nome_cliente', 'Lead Teste'))
    print(f"\n=== ATUALIZANDO LEAD {lead_id} - {nome} ===")
    
    # 3. Data futura (amanhã às 14:00)
    data_futura = datetime.now() + timedelta(days=1)
    data_futura = data_futura.replace(hour=14, minute=0, second=0, microsecond=0)
    data_iso = data_futura.isoformat()
    
    print(f"Data a adicionar: {data_iso}")
    
    # 4. Atualizar o lead
    update_data = {
        "nome_lead": lead.get('nome_lead', lead.get('nome_cliente', 'Lead Teste')),
        "email": lead.get('email', ''),
        "telefone": lead.get('telefone', ''),
        "status": lead.get('status', 'Entrada de Lead'),
        "proxima_acao": data_iso,
        "tarefa_concluida": False
    }
    
    # Adicionar outros campos obrigatórios
    for key in ['origem', 'notas_conversa', 'valor_venda_com_iva', 'valor_proposta', 'morada']:
        if key in lead:
            update_data[key] = lead[key]
    
    print(f"\nEnviando atualização...")
    print(f"Payload: {json.dumps(update_data, indent=2, ensure_ascii=False)}")
    
    response = requests.put(
        f"{BASE_URL}/api/leads/{lead_id}",
        json=update_data
    )
    
    if response.status_code not in [200, 201]:
        print(f"❌ Erro ao atualizar lead: {response.status_code}")
        print(f"Resposta: {response.text}")
        return
    
    print(f"✅ Lead atualizado!")
    
    # 5. Verificar o lead atualizado
    print(f"\n=== VERIFICANDO LEAD ATUALIZADO ===")
    response = requests.get(f"{BASE_URL}/api/leads/{lead_id}")
    if response.status_code == 200:
        updated_lead = response.json()
        nome = updated_lead.get('nome_lead', updated_lead.get('nome_cliente', 'Lead'))
        print(f"ID: {updated_lead['id']}")
        print(f"Nome: {nome}")
        print(f"Próxima ação: {updated_lead.get('proxima_acao', 'NÃO DEFINIDA')}")
        print(f"Tarefa concluída: {updated_lead.get('tarefa_concluida', 'NÃO DEFINIDA')}")
    
    # 6. Buscar tarefas pendentes
    print(f"\n=== VERIFICANDO ENDPOINT DE TAREFAS ===")
    response = requests.get(f"{BASE_URL}/api/tarefas")
    
    if response.status_code != 200:
        print(f"❌ Erro ao buscar tarefas: {response.status_code}")
        print(f"Resposta: {response.text}")
    else:
        tarefas = response.json()
        print(f"✅ Total de tarefas: {len(tarefas) if isinstance(tarefas, list) else 'Formato inesperado'}")
        if isinstance(tarefas, list):
            for tarefa in tarefas:
                nome = tarefa.get('nome_lead', tarefa.get('nome_cliente', 'Lead'))
                print(f"  - {nome}: {tarefa.get('proxima_acao')}")
    
    print(f"\n{'='*60}")
    print(f"✅ TESTE CONCLUÍDO!")
    print(f"{'='*60}")
    print(f"\n📌 Agora abra no navegador:")
    print(f"   • http://localhost:3000/tarefas")
    print(f"   • http://localhost:3000/leads (clique no lead ID {lead_id})")
    print(f"\n❓ O campo de data aparece no formulário de edição do lead?")

if __name__ == "__main__":
    try:
        test_add_date()
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()
