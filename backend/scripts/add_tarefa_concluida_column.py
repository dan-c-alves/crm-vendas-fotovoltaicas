#!/usr/bin/env python3
"""
Script para adicionar coluna tarefa_concluida na tabela leads
"""

import sys
import os

# Adicionar o diretório backend ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from config.settings import DATABASE_URL

def add_column():
    """Adiciona coluna tarefa_concluida se não existir"""
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            # Verificar se a coluna já existe
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='leads' AND column_name='tarefa_concluida'
            """))
            
            if result.fetchone() is None:
                # Adicionar coluna
                conn.execute(text("""
                    ALTER TABLE leads 
                    ADD COLUMN tarefa_concluida BOOLEAN DEFAULT FALSE
                """))
                conn.commit()
                print("✅ Coluna 'tarefa_concluida' adicionada com sucesso!")
            else:
                print("ℹ️  Coluna 'tarefa_concluida' já existe.")
    
    except Exception as e:
        print(f"❌ Erro ao adicionar coluna: {e}")
    finally:
        engine.dispose()

if __name__ == "__main__":
    add_column()
