"""
Script para adicionar uma data de próxima ação a um lead e testar o sistema de tarefas
"""

import sys
import os
from datetime import datetime, timedelta
from pathlib import Path

# Adicionar o diretório backend ao path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models.lead import Lead
from config.settings import DATABASE_URL

# Criar engine e sessão
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

def adicionar_proxima_acao():
    """Adiciona uma data de próxima ação a um lead existente"""
    
    # Listar leads existentes
    print("\n=== LEADS EXISTENTES ===")
    leads = session.query(Lead).filter(Lead.ativo == True).all()
    
    if not leads:
        print("❌ Nenhum lead encontrado!")
        return
    
    for lead in leads:
        print(f"ID: {lead.id} | Nome: {lead.nome_cliente} | Status: {lead.status}")
        if lead.proxima_acao:
            print(f"  └─ Próxima ação atual: {lead.proxima_acao}")
    
    # Pegar o primeiro lead
    lead = leads[0]
    print(f"\n=== ATUALIZANDO LEAD {lead.id} - {lead.nome_cliente} ===")
    
    # Data futura (amanhã às 14:00)
    data_futura = datetime.now() + timedelta(days=1)
    data_futura = data_futura.replace(hour=14, minute=0, second=0, microsecond=0)
    
    print(f"Adicionando próxima ação: {data_futura}")
    
    # Atualizar o lead
    lead.proxima_acao = data_futura
    lead.tarefa_concluida = False
    
    session.commit()
    print("✅ Lead atualizado!")
    
    # Verificar se foi salvo
    session.refresh(lead)
    print(f"\n=== VERIFICAÇÃO ===")
    print(f"Lead ID: {lead.id}")
    print(f"Nome: {lead.nome_cliente}")
    print(f"Próxima ação: {lead.proxima_acao}")
    print(f"Tarefa concluída: {lead.tarefa_concluida}")
    
    # Verificar direto no banco
    print(f"\n=== VERIFICAÇÃO DIRETA NO BANCO ===")
    result = session.execute(
        text("SELECT id, nome_cliente, proxima_acao, tarefa_concluida FROM leads WHERE id = :id"),
        {"id": lead.id}
    ).fetchone()
    
    if result:
        print(f"ID: {result[0]}")
        print(f"Nome: {result[1]}")
        print(f"Próxima ação: {result[2]}")
        print(f"Tarefa concluída: {result[3]}")
    
    # Buscar tarefas pendentes
    print(f"\n=== TAREFAS PENDENTES ===")
    tarefas = session.query(Lead).filter(
        Lead.ativo == True,
        Lead.proxima_acao.isnot(None),
        Lead.tarefa_concluida == False
    ).order_by(Lead.proxima_acao).all()
    
    print(f"Total de tarefas: {len(tarefas)}")
    for tarefa in tarefas:
        print(f"- {tarefa.nome_cliente}: {tarefa.proxima_acao}")
    
    return lead.id

if __name__ == "__main__":
    try:
        lead_id = adicionar_proxima_acao()
        print(f"\n✅ Teste concluído!")
        print(f"Agora abra: http://localhost:3000/tarefas")
        print(f"E também: http://localhost:3000/leads/{lead_id}")
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()
