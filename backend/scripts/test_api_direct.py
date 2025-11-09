"""
Script para testar API do backend diretamente
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import requests

def test_backend():
    """Testa conexão com backend"""
    
    backend_url = "http://localhost:8000"
    
    try:
        # Testar endpoint de leads
        print("\n🔍 Testando GET /api/leads...")
        response = requests.get(f"{backend_url}/api/leads?page=1&page_size=10")
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API funcionando!")
            print(f"Total de leads: {data.get('total', 0)}")
            print(f"Leads retornados: {len(data.get('data', []))}")
            
            if data.get('data'):
                print("\n📋 Primeiro lead:")
                first_lead = data['data'][0]
                print(f"   ID: {first_lead.get('id')}")
                print(f"   Nome: {first_lead.get('nome_lead')}")
                print(f"   Status: {first_lead.get('status')}")
                print(f"   Ativo: {first_lead.get('ativo')}")
        else:
            print(f"❌ Erro {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("\n❌ BACKEND NÃO ESTÁ RODANDO!")
        print("Execute: cd backend && python main.py")
    except Exception as e:
        print(f"\n❌ Erro: {e}")

if __name__ == "__main__":
    test_backend()
