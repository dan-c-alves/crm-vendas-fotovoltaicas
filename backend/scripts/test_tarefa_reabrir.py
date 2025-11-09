"""
Script para testar se um lead com tarefa_concluida=True volta a aparecer
quando uma nova proxima_acao é definida
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.settings import DATABASE_URL
from models.lead import Lead
from datetime import datetime, timedelta
import requests

def test_tarefa_reabrir():
    """Testa reabertura de tarefa concluída"""
    
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        print("\n" + "="*60)
        print("TESTE: Reabertura de Tarefa Concluída")
        print("="*60)
        
        # 1. Buscar um lead com tarefa_concluida=True
        lead_concluido = db.query(Lead).filter(
            Lead.ativo == True,
            Lead.tarefa_concluida == True
        ).first()
        
        if not lead_concluido:
            print("\n⚠️  Nenhum lead com tarefa concluída encontrado.")
            print("Criando um lead de teste...")
            
            # Buscar qualquer lead para usar como teste
            lead_concluido = db.query(Lead).filter(Lead.ativo == True).first()
            if lead_concluido:
                lead_concluido.tarefa_concluida = True
                lead_concluido.proxima_acao = None
                db.commit()
                print(f"✅ Lead {lead_concluido.id} marcado como concluído para teste")
        
        print(f"\n📋 Lead selecionado: {lead_concluido.nome_lead} (ID: {lead_concluido.id})")
        print(f"   Status atual: tarefa_concluida = {lead_concluido.tarefa_concluida}")
        print(f"   Proxima ação atual: {lead_concluido.proxima_acao}")
        
        # 2. Atualizar o lead via API com nova data
        nova_data = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%dT15:00:00")
        
        print(f"\n🔄 Atualizando lead via API com nova data: {nova_data}")
        
        response = requests.put(
            f"http://localhost:8000/api/leads/{lead_concluido.id}",
            json={"proxima_acao": nova_data}
        )
        
        if response.status_code == 200:
            print("✅ API retornou sucesso (200)")
            updated_lead = response.json()
            print(f"   tarefa_concluida após update: {updated_lead.get('tarefa_concluida')}")
            print(f"   proxima_acao após update: {updated_lead.get('proxima_acao')}")
        else:
            print(f"❌ Erro na API: {response.status_code}")
            print(response.text)
            return
        
        # 3. Verificar no banco de dados
        db.refresh(lead_concluido)
        
        print(f"\n🔍 Verificação no banco de dados:")
        print(f"   tarefa_concluida: {lead_concluido.tarefa_concluida}")
        print(f"   proxima_acao: {lead_concluido.proxima_acao}")
        
        # 4. Verificar se aparece na lista de tarefas
        response = requests.get("http://localhost:8000/api/leads?page=1&page_size=100")
        if response.status_code == 200:
            data = response.json()
            leads_with_tasks = [l for l in data['data'] if l.get('proxima_acao')]
            lead_ids_with_tasks = [l['id'] for l in leads_with_tasks]
            
            print(f"\n📊 Total de leads com proxima_acao: {len(leads_with_tasks)}")
            
            if lead_concluido.id in lead_ids_with_tasks:
                print(f"✅ SUCESSO! Lead {lead_concluido.id} aparece na lista de tarefas!")
            else:
                print(f"❌ FALHA! Lead {lead_concluido.id} NÃO aparece na lista de tarefas")
                print(f"   IDs com tarefas: {lead_ids_with_tasks[:5]}...")
        
        print("\n" + "="*60)
        print("RESULTADO DO TESTE:")
        if lead_concluido.tarefa_concluida == False and lead_concluido.proxima_acao:
            print("✅ PASSOU! Tarefa foi reaberta (tarefa_concluida=False)")
        else:
            print("❌ FALHOU! Tarefa não foi reaberta corretamente")
        print("="*60)
        
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_tarefa_reabrir()
