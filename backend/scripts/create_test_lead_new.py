#!/usr/bin/env python3
"""
Script para criar um novo lead e testar atualização com data
"""
import sys
import os

# Adicionar o caminho do backend ao PYTHONPATH
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from datetime import datetime
from app.database import SessionLocal
from models.lead import Lead

def create_test_lead():
    """Cria um lead de teste para testar a atualização com data"""
    
    print("🧪 Criando lead de teste...")
    
    # Criar sessão da base de dados
    db = SessionLocal()
    
    try:
        # Criar um novo lead
        novo_lead = Lead(
            nome_lead="Teste Update Data",
            email="teste.update@email.com",
            telefone="912345678",
            status="Contacto Inicial",
            valor_venda_com_iva=10000.0,
            comissao_valor=500.0,
            data_entrada=datetime.utcnow(),
            data_atualizacao=datetime.utcnow(),
            ativo=True
        )
        
        db.add(novo_lead)
        db.commit()
        db.refresh(novo_lead)
        
        print(f"✅ Lead criado com ID: {novo_lead.id}")
        
        # Agora testar a atualização com data
        print("\n📅 Testando atualização com data...")
        
        # Simular data como vem do frontend (formato datetime-local)
        data_string = "2025-10-29T16:14"
        print(f"📅 Data original do frontend: {data_string}")
        
        # Converter como no código de atualização
        try:
            if 'T' in data_string:
                data_string = data_string.replace('T', ' ')
            
            data_convertida = datetime.fromisoformat(data_string)
            print(f"✅ Data convertida: {data_convertida}")
            
            # Atualizar o lead
            novo_lead.proxima_acao = data_convertida
            novo_lead.data_atualizacao = datetime.utcnow()
            novo_lead.notas_conversa = "Teste de atualização com data"
            
            db.commit()
            print(f"✅ Lead atualizado com sucesso!")
            
            # Verificar se foi salvo corretamente
            db.refresh(novo_lead)
            print(f"📋 Data salva: {novo_lead.proxima_acao}")
            print(f"📋 Notas: {novo_lead.notas_conversa}")
            
            return novo_lead.id
            
        except Exception as e:
            print(f"❌ Erro ao atualizar lead: {e}")
            db.rollback()
            return None
    
    except Exception as e:
        print(f"❌ Erro ao criar lead: {e}")
        db.rollback()
        return None
    
    finally:
        db.close()

if __name__ == "__main__":
    lead_id = create_test_lead()
    if lead_id:
        print(f"\n🎯 Lead de teste criado com sucesso! ID: {lead_id}")
        print("Agora você pode tentar criar um lead no frontend e agendar uma data.")