#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para unificar status 'Ganho' -> 'Vendido' e remover 'Ganho' do enum PostgreSQL.

Este script faz:
1. Atualiza todos os registros com status='Ganho' para 'Vendido'
2. Remove o valor 'Ganho' do enum lead_status no PostgreSQL

Uso (PowerShell):
  cd backend; venv\\Scripts\\activate; python scripts\\unify_status_vendido.py
"""

import sys
import os
from sqlalchemy import text

# Tornar módulos do backend importáveis
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal, engine


def unify_status():
    print("🔄 Iniciando unificação: 'Ganho' -> 'Vendido'")
    
    db = SessionLocal()
    try:
        # Verificar se 'Ganho' ainda está no enum antes de tentar UPDATE
        print("🔍 Verificando se 'Ganho' existe no enum lead_status...")
        check_query = text("""
            SELECT EXISTS (
                SELECT 1 FROM pg_enum e
                JOIN pg_type t ON e.enumtypid = t.oid
                WHERE t.typname = 'lead_status' AND e.enumlabel = 'Ganho'
            );
        """)
        exists = db.execute(check_query).scalar()
        
        if not exists:
            print("ℹ️  'Ganho' já não existe no enum lead_status. Unificação já concluída anteriormente.")
            print("✅ Sistema já está padronizado em 'Vendido'.")
            return
        
        # Passo 1: Atualizar registros com status='Ganho' para 'Vendido'
        print("📝 Atualizando registros com status='Ganho' para 'Vendido'...")
        result = db.execute(
            text("UPDATE leads SET status = 'Vendido' WHERE status = 'Ganho'")
        )
        count = result.rowcount
        db.commit()
        print(f"✅ {count} registro(s) atualizado(s).")
        
        # Passo 2: Remover valor 'Ganho' do enum lead_status
        print("🗑️  Removendo 'Ganho' do enum lead_status...")
        
        # PostgreSQL não permite ALTER TYPE ENUM DROP VALUE diretamente antes de versão 12+
        # Estratégia: criar novo enum sem 'Ganho', alterar coluna, remover enum antigo
        print("⚠️  Recriando enum sem 'Ganho'...")
        
        # Criar enum temporário com valores corretos
        db.execute(text("""
            CREATE TYPE lead_status_new AS ENUM (
                'Entrada de Lead',
                'Em Análise',
                'Proposta Enviada',
                'Em Negociação',
                'Vendido',
                'Perdido',
                'Cancelado'
            );
        """))
        
        # Alterar coluna status para usar novo enum
        db.execute(text("""
            ALTER TABLE leads
            ALTER COLUMN status TYPE lead_status_new
            USING status::text::lead_status_new;
        """))
        
        # Remover enum antigo
        db.execute(text("DROP TYPE lead_status;"))
        
        # Renomear novo enum para nome original
        db.execute(text("ALTER TYPE lead_status_new RENAME TO lead_status;"))
        
        db.commit()
        print("✅ Enum 'lead_status' atualizado com sucesso (sem 'Ganho').")
        
        print("🎉 Unificação concluída! Todos os status estão padronizados em 'Vendido'.")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Erro durante unificação: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    unify_status()
