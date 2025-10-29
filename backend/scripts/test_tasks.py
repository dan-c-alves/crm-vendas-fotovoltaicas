#!/usr/bin/env python3
"""
Script para testar funcionalidades da página de tarefas
"""

import requests

def testar_conclusao_tarefa():
    """Testar marcar tarefa como concluída"""
    try:
        # Marcar lead ID 106 (Carlos Mendes) como concluído
        lead_id = 106
        
        response = requests.put(
            f"http://localhost:8000/api/leads/{lead_id}",
            headers={"Content-Type": "application/json"},
            json={
                "data_proxima_acao": None
            }
        )
        
        if response.status_code == 200:
            print(f"✅ Tarefa do lead {lead_id} marcada como concluída!")
            print("🎯 O lead foi removido da lista de tarefas")
        else:
            print(f"❌ Erro: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Erro: {str(e)}")

def testar_adiamento_tarefa():
    """Testar adiamento de tarefa"""
    try:
        # Adiar lead ID 107 (Ana Rodrigues) para amanhã às 17:00
        lead_id = 107
        nova_data = "2025-10-29T17:00:00"
        
        response = requests.put(
            f"http://localhost:8000/api/leads/{lead_id}",
            headers={"Content-Type": "application/json"},
            json={
                "data_proxima_acao": nova_data
            }
        )
        
        if response.status_code == 200:
            print(f"✅ Tarefa do lead {lead_id} adiada para {nova_data}!")
            print("🎯 Nova data/hora definida")
        else:
            print(f"❌ Erro: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Erro: {str(e)}")

if __name__ == "__main__":
    print("🧪 Testando funcionalidades das tarefas...")
    print("\n1. Testando conclusão de tarefa:")
    testar_conclusao_tarefa()
    
    print("\n2. Testando adiamento de tarefa:")
    testar_adiamento_tarefa()
    
    print("\n✅ Testes concluídos! Atualize a página de tarefas para ver as mudanças.")