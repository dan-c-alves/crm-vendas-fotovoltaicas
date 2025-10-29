#!/usr/bin/env python3
"""
Script para adicionar as novas colunas à tabela leads
"""
import sqlite3
import os
from pathlib import Path

# Caminho para a base de dados
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR.parent / 'data' / 'crm_vendas.db'

def add_new_columns():
    """Adicionar as novas colunas à tabela leads"""
    try:
        # Conectar à base de dados
        conn = sqlite3.connect(str(DB_PATH))
        cursor = conn.cursor()
        
        print(f"📊 Conectado à base de dados: {DB_PATH}")
        
        # Verificar se as colunas já existem
        cursor.execute("PRAGMA table_info(leads)")
        columns = [column[1] for column in cursor.fetchall()]
        
        print(f"📋 Colunas existentes: {columns}")
        
        # Adicionar url_imagem_cliente se não existir
        if 'url_imagem_cliente' not in columns:
            cursor.execute("ALTER TABLE leads ADD COLUMN url_imagem_cliente TEXT")
            print("✅ Coluna 'url_imagem_cliente' adicionada")
        else:
            print("ℹ️  Coluna 'url_imagem_cliente' já existe")
        
        # Adicionar google_event_id se não existir
        if 'google_event_id' not in columns:
            cursor.execute("ALTER TABLE leads ADD COLUMN google_event_id TEXT")
            print("✅ Coluna 'google_event_id' adicionada")
        else:
            print("ℹ️  Coluna 'google_event_id' já existe")
        
        # Confirmar as mudanças
        conn.commit()
        
        # Verificar as colunas após a atualização
        cursor.execute("PRAGMA table_info(leads)")
        new_columns = [column[1] for column in cursor.fetchall()]
        
        print(f"📋 Colunas após atualização: {new_columns}")
        print("✅ Migração concluída com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro durante a migração: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("🔄 Iniciando migração da base de dados...")
    add_new_columns()
    print("🎉 Migração concluída!")