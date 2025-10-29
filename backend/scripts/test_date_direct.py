#!/usr/bin/env python3
"""
Script para testar diretamente conversão de datas
"""
import sys
import os

# Adicionar o caminho do backend ao PYTHONPATH
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from datetime import datetime
from app.database import SessionLocal
from models.lead import Lead

def test_date_conversion():
    """Testa conversão de data diretamente na base de dados"""
    
    print("🧪 Testando conversão de data diretamente...")
    
    # Criar sessão da base de dados
    db = SessionLocal()
    
    try:
        # Encontrar um lead existente
        lead = db.query(Lead).filter(Lead.ativo == True).first()
        
        if not lead:
            print("❌ Nenhum lead encontrado na base de dados")
            return
        
        print(f"📋 Testando com lead: {lead.id} - {lead.nome_lead}")
        
        # Simular data como string (como vem do frontend)
        data_string = "2025-10-29T16:14"
        print(f"📅 Data original: {data_string}")
        
        # Converter para datetime
        try:
            # Formato comum do frontend (datetime-local)
            if 'T' in data_string:
                data_string = data_string.replace('T', ' ')
            
            data_convertida = datetime.fromisoformat(data_string)
            print(f"✅ Data convertida: {data_convertida}")
            
            # Atualizar o lead
            lead.proxima_acao = data_convertida
            lead.data_atualizacao = datetime.utcnow()
            
            db.commit()
            print(f"✅ Lead atualizado com sucesso!")
            
            # Verificar se foi salvo corretamente
            db.refresh(lead)
            print(f"📋 Data salva na base de dados: {lead.proxima_acao}")
            
        except Exception as e:
            print(f"❌ Erro ao converter/salvar data: {e}")
            db.rollback()
    
    finally:
        db.close()

if __name__ == "__main__":
    test_date_conversion()