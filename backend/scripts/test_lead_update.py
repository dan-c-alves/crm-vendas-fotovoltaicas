#!/usr/bin/env python3
"""
Script para testar atualização de leads com datas
"""
import requests
import json
from datetime import datetime, timedelta

# URL da API
BASE_URL = "http://localhost:8000/api"

def test_lead_update():
    """Testa atualização de lead com data de próxima ação"""
    
    print("🧪 Testando atualização de lead com data...")
    
    # Criar um lead de teste primeiro
    print("\n1. Criando lead de teste...")
    lead_data = {
        "nome_lead": "Teste Data Update",
        "email": "teste.data@email.com",
        "telefone": "912345678",
        "status": "Contacto Inicial",
        "valor_venda_com_iva": 15000.0
    }
    
    try:
        response = requests.post(f"{BASE_URL}/leads/", json=lead_data)
        if response.status_code == 201:
            lead = response.json()
            lead_id = lead["id"]
            print(f"✅ Lead criado com ID: {lead_id}")
        else:
            print(f"❌ Erro ao criar lead: {response.text}")
            return
    except Exception as e:
        print(f"❌ Erro de conexão ao criar lead: {e}")
        return
    
    # Testar atualização com data
    print("\n2. Atualizando lead com data de próxima ação...")
    
    # Data para amanhã às 14:30
    amanha = datetime.now() + timedelta(days=1)
    data_iso = amanha.replace(hour=14, minute=30, second=0, microsecond=0).isoformat()
    
    update_data = {
        "proxima_acao": data_iso,
        "status": "Aguarda Follow-up",
        "notas_conversa": "Agendado contacto para follow-up"
    }
    
    try:
        response = requests.put(f"{BASE_URL}/leads/{lead_id}", json=update_data)
        if response.status_code == 200:
            updated_lead = response.json()
            print(f"✅ Lead atualizado com sucesso!")
            print(f"   Nome: {updated_lead.get('nome_lead')}")
            print(f"   Status: {updated_lead.get('status')}")
            print(f"   Próxima ação: {updated_lead.get('proxima_acao')}")
        else:
            print(f"❌ Erro ao atualizar lead: {response.status_code}")
            print(f"   Resposta: {response.text}")
    except Exception as e:
        print(f"❌ Erro de conexão ao atualizar lead: {e}")
    
    # Verificar se aparece nas tarefas
    print("\n3. Verificando se aparece nas tarefas...")
    try:
        response = requests.get(f"{BASE_URL}/tasks/scheduled")
        if response.status_code == 200:
            tasks = response.json()
            print(f"✅ Tarefas encontradas: {len(tasks)}")
            
            # Procurar nossa tarefa
            found = False
            for task in tasks:
                if task.get("id") == lead_id:
                    print(f"✅ Lead encontrado nas tarefas:")
                    print(f"   ID: {task.get('id')}")
                    print(f"   Nome: {task.get('nome_lead')}")
                    print(f"   Data agendada: {task.get('data_agendada')}")
                    found = True
                    break
            
            if not found:
                print(f"⚠️  Lead não encontrado nas tarefas")
        else:
            print(f"❌ Erro ao buscar tarefas: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao verificar tarefas: {e}")
    
    print(f"\n🎯 Teste concluído! Lead ID: {lead_id}")

if __name__ == "__main__":
    test_lead_update()