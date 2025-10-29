#!/usr/bin/env python3
"""
Script para criar um lead de teste com data agendada para amanhã
"""

import requests
import json
from datetime import datetime, timedelta

def criar_lead_teste():
    """Criar um lead de teste com agendamento para amanhã"""
    
    # Data para amanhã às 14:30
    amanha = datetime.now() + timedelta(days=1)
    data_agendada = amanha.replace(hour=14, minute=30, second=0, microsecond=0)
    
    # Dados do lead de teste
    lead_data = {
        "nome_lead": "Maria Santos - Teste",
        "email": "maria.teste@email.com", 
        "telefone": "913456789",
        "morada": "Rua das Flores, 123, Lisboa",
        "status": "Contactados",
        "valor_venda_com_iva": 18500.00,
        "taxa_iva": 23.0,
        "valor_proposta": 18500.00,
        "notas_conversa": "Cliente muito interessada em sistema fotovoltaico. Tem telhado grande e quer orçamento detalhado.",
        "origem": "Website",
        "proxima_acao": "Ligar para marcar visita técnica"
    }
    
    try:
        print("🚀 Criando lead de teste...")
        
        # Criar o lead primeiro
        response = requests.post(
            "http://localhost:8000/api/leads/",
            headers={"Content-Type": "application/json"},
            json=lead_data
        )
        
        if response.status_code == 201:
            lead = response.json()
            lead_id = lead['id']
            print(f"✅ Lead criado com ID: {lead_id}")
            print(f"   Nome: {lead['nome_lead']}")
            print(f"   Valor: €{lead['valor_venda_com_iva']:,.2f}")
            print(f"   Comissão: €{lead['comissao_valor']:,.2f}")
            
            # Agora agendar o contacto para amanhã
            update_data = {
                "data_proxima_acao": data_agendada.isoformat()
            }
            
            print(f"\n📅 Agendando contacto para: {data_agendada.strftime('%d/%m/%Y às %H:%M')}")
            
            response_update = requests.put(
                f"http://localhost:8000/api/leads/{lead_id}",
                headers={"Content-Type": "application/json"},
                json=update_data
            )
            
            if response_update.status_code == 200:
                print("✅ Contacto agendado com sucesso!")
                print(f"🎯 O lead aparecerá na página de Tarefas")
                
                # Verificar se aparece nas tarefas
                tasks_response = requests.get("http://localhost:8000/api/tasks/scheduled")
                if tasks_response.status_code == 200:
                    tasks_data = tasks_response.json()
                    print(f"\n📋 Total de tarefas agendadas: {tasks_data['total_tarefas']}")
                    
                    for task in tasks_data['tarefas_agendadas']:
                        if task['id'] == lead_id:
                            print(f"✅ Lead encontrado na lista de tarefas!")
                            print(f"   Data: {task['data_proxima_acao']}")
                            print(f"   Ação: {task['proxima_acao']}")
                            break
                else:
                    print("❌ Erro ao verificar tarefas")
            else:
                print(f"❌ Erro ao agendar: {response_update.status_code}")
                print(response_update.text)
        else:
            print(f"❌ Erro ao criar lead: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Erro: {str(e)}")

if __name__ == "__main__":
    criar_lead_teste()