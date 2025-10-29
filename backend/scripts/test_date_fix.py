#!/usr/bin/env python3
"""
Script para testar via API a correção do erro de data
"""

import requests
import json
from datetime import datetime, timedelta

def test_lead_date_update():
    """Testa a atualização de leads com data via API"""
    
    print("🧪 Testando correção de erro de data via API...")
    
    # Buscar um lead existente
    try:
        response = requests.get("http://localhost:8000/api/leads/2")
        if response.status_code == 200:
            lead = response.json()
            print(f"📋 Lead encontrado: {lead['nome_lead']} (ID: {lead['id']})")
        else:
            print(f"❌ Erro ao buscar lead: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Erro de conexão: {e}")
        return
    
    # Teste 1: Atualizar com data válida
    print("\n1️⃣ Teste: Atualizar com data válida")
    
    amanha = datetime.now() + timedelta(days=1)
    data_teste = amanha.replace(hour=16, minute=45, second=0, microsecond=0).isoformat()
    
    update_data = {
        "proxima_acao": data_teste,
        "notas_conversa": "Teste de atualização com data válida"
    }
    
    try:
        response = requests.put(f"http://localhost:8000/api/leads/{lead['id']}", 
                               json=update_data,
                               headers={"Content-Type": "application/json"})
        
        if response.status_code == 200:
            updated_lead = response.json()
            print(f"✅ Lead atualizado com sucesso!")
            print(f"   Data agendada: {updated_lead.get('proxima_acao', 'N/A')}")
        else:
            print(f"❌ Erro na atualização: {response.status_code}")
            print(f"   Resposta: {response.text}")
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
    
    # Teste 2: Verificar se aparece nas tarefas
    print("\n2️⃣ Teste: Verificar se aparece nas tarefas")
    
    try:
        response = requests.get("http://localhost:8000/api/tasks/scheduled")
        if response.status_code == 200:
            tasks = response.json()
            print(f"📊 Total de tarefas: {tasks['total_tarefas']}")
            
            for tarefa in tasks['tarefas_agendadas']:
                if tarefa['id'] == lead['id']:
                    print(f"✅ Lead encontrado nas tarefas:")
                    print(f"   Nome: {tarefa['nome_lead']}")
                    print(f"   Data: {tarefa['data_agendada']}")
                    break
        else:
            print(f"❌ Erro ao buscar tarefas: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao verificar tarefas: {e}")
    
    # Teste 3: Remover data
    print("\n3️⃣ Teste: Remover data")
    
    remove_data = {
        "proxima_acao": None,
        "notas_conversa": "Data removida via teste"
    }
    
    try:
        response = requests.put(f"http://localhost:8000/api/leads/{lead['id']}", 
                               json=remove_data,
                               headers={"Content-Type": "application/json"})
        
        if response.status_code == 200:
            updated_lead = response.json()
            print(f"✅ Data removida com sucesso!")
            print(f"   Próxima ação: {updated_lead.get('proxima_acao', 'Nenhuma')}")
        else:
            print(f"❌ Erro ao remover data: {response.status_code}")
            print(f"   Resposta: {response.text}")
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
    
    print("\n🎯 Teste completo!")
    print("✅ Se todos os testes passaram, o erro de data foi corrigido")
    print("💻 Frontend disponível em: http://localhost:3000")

if __name__ == "__main__":
    test_lead_date_update()