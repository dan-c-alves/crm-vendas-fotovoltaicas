import os
import sys
import requests

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from app.database import SessionLocal
from models.lead import Lead
from sqlalchemy import func

def test_complete():
    print("=" * 70)
    print("DIAGNÓSTICO COMPLETO DO SISTEMA")
    print("=" * 70)
    
    # 1. Testar banco de dados
    print("\n1️⃣ TESTANDO BANCO DE DADOS")
    print("-" * 70)
    s = SessionLocal()
    try:
        total = s.query(Lead).filter(Lead.ativo == True).count()
        print(f"✅ Total de leads ativos: {total}")
        
        # Status counts
        print("\n📊 Leads por Status:")
        status_counts = s.query(Lead.status, func.count(Lead.id)).filter(
            Lead.ativo == True
        ).group_by(Lead.status).order_by(func.count(Lead.id).desc()).all()
        
        for status, count in status_counts:
            print(f"  • {status}: {count}")
        
        # Verificar Zina
        zina = s.query(Lead).filter(
            Lead.nome_lead.ilike('%zina%'),
            Lead.ativo == True
        ).first()
        
        if zina:
            print(f"\n✅ Lead Zina encontrado:")
            print(f"  Nome: {zina.nome_lead}")
            print(f"  Status: {zina.status}")
            print(f"  Email: {zina.email}")
        else:
            print("\n❌ Lead Zina NÃO encontrado")
    finally:
        s.close()
    
    # 2. Testar API do backend
    print("\n\n2️⃣ TESTANDO API DO BACKEND")
    print("-" * 70)
    
    try:
        # Test 1: Buscar todos os leads
        print("Teste: GET /api/leads?page=1&page_size=1000")
        response = requests.get('http://localhost:8000/api/leads?page=1&page_size=1000', timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API respondeu com sucesso")
            print(f"  Total: {data.get('total', 0)}")
            print(f"  Leads retornados: {len(data.get('data', []))}")
            print(f"  Página: {data.get('page')}")
            print(f"  Total de páginas: {data.get('total_pages')}")
            
            # Verificar status únicos
            if data.get('data'):
                statuses = set(lead.get('status') for lead in data['data'])
                print(f"\n  Status encontrados na API:")
                for st in sorted(statuses):
                    count = sum(1 for lead in data['data'] if lead.get('status') == st)
                    print(f"    • {st}: {count}")
        else:
            print(f"❌ API retornou erro: {response.status_code}")
            print(f"   Resposta: {response.text}")
    
    except requests.exceptions.ConnectionError:
        print("❌ Não foi possível conectar ao backend (http://localhost:8000)")
        print("   Certifique-se que o backend está rodando!")
    except Exception as e:
        print(f"❌ Erro ao testar API: {e}")
    
    # 3. Teste específico de filtros
    print("\n\n3️⃣ TESTANDO FILTROS DA API")
    print("-" * 70)
    
    test_statuses = ['Entrada de Lead', 'Vendido', 'Perdido', 'Cancelado', 'Proposta Enviada']
    
    for status in test_statuses:
        try:
            url = f'http://localhost:8000/api/leads?page=1&page_size=1000&status={status}'
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {status}: {data.get('total', 0)} leads")
            else:
                print(f"❌ {status}: Erro {response.status_code}")
        except:
            print(f"❌ {status}: Erro de conexão")
    
    print("\n" + "=" * 70)
    print("DIAGNÓSTICO CONCLUÍDO")
    print("=" * 70)

if __name__ == "__main__":
    test_complete()
