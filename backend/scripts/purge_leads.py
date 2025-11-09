#!/usr/bin/env python3
"""
Script para eliminar todos os leads do sistema seguindo a convenção de soft delete (ativo=False).

Uso:
  - Executar localmente com o ambiente do backend configurado.
  - Marca todos os leads como inativos e limpa campos de agendamento.
"""

import sys
import os
from datetime import datetime

# Adicionar o caminho do backend ao PYTHONPATH
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal  # type: ignore
from models.lead import Lead  # type: ignore


def purge_all_leads():
    print("🗑️  Iniciando eliminação de todos os leads (soft delete)...")
    db = SessionLocal()

    try:
        total = db.query(Lead).count()
        ativos = db.query(Lead).filter(Lead.ativo == True).count()
        print(f"📊 Total no DB: {total} | Ativos: {ativos}")

        if ativos == 0:
            print("✅ Não existem leads ativos. Nada a fazer.")
            return

        # Buscar em lotes para evitar muita memória (caso a base seja grande)
        batch_size = 500
        offset = 0
        atualizados = 0

        while True:
            batch = (
                db.query(Lead)
                .filter(Lead.ativo == True)
                .order_by(Lead.id)
                .offset(offset)
                .limit(batch_size)
                .all()
            )
            if not batch:
                break

            for lead in batch:
                # Soft delete + limpeza de campos relacionados
                lead.ativo = False
                lead.proxima_acao = None
                lead.tarefa_concluida = True
                # Opcional: limpar vínculo de calendário antigo
                lead.google_event_id = None
                lead.data_atualizacao = datetime.utcnow()
                atualizados += 1

            db.commit()
            offset += batch_size
            print(f"  ➜ {atualizados} leads processados...")

        # Verificação final
        restantes = db.query(Lead).filter(Lead.ativo == True).count()
        print(f"✅ Concluído. Leads marcados como inativos: {atualizados}. Restantes ativos: {restantes}")

    except Exception as e:
        print(f"❌ Erro ao eliminar leads: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    purge_all_leads()
