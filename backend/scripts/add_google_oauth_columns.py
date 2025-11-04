"""
Script para adicionar campos Google OAuth na tabela users
Execute este script antes de fazer deploy com Google Login
"""

import sys
import os

# Adicionar o diretório pai ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database import engine

def add_google_oauth_columns():
    """Adiciona as colunas necessárias para Google OAuth"""
    
    with engine.connect() as connection:
        try:
            # Adicionar coluna google_id
            print("Adicionando coluna google_id...")
            connection.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE
            """))
            connection.commit()
            print("✅ Coluna google_id adicionada")
            
            # Adicionar coluna google_access_token
            print("Adicionando coluna google_access_token...")
            connection.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS google_access_token TEXT
            """))
            connection.commit()
            print("✅ Coluna google_access_token adicionada")
            
            # Adicionar coluna google_refresh_token
            print("Adicionando coluna google_refresh_token...")
            connection.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS google_refresh_token TEXT
            """))
            connection.commit()
            print("✅ Coluna google_refresh_token adicionada")
            
            print("\n🎉 Migração concluída com sucesso!")
            print("Agora você pode usar Google OAuth para autenticação.")
            
        except Exception as e:
            print(f"❌ Erro durante migração: {e}")
            connection.rollback()
            return False
    
    return True

if __name__ == "__main__":
    print("=== Migrando banco de dados para Google OAuth ===\n")
    success = add_google_oauth_columns()
    sys.exit(0 if success else 1)
