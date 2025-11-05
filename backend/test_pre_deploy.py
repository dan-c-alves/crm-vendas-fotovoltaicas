#!/usr/bin/env python3
"""
Script de teste rápido para validar a configuração antes do deploy.
Testa: conexão com banco, estrutura de tabelas, variáveis de ambiente.
"""

import os
import sys
from dotenv import load_dotenv

# Carregar .env
load_dotenv()

def test_env_variables():
    """Verifica se todas as variáveis essenciais estão definidas"""
    print("🔍 Testando variáveis de ambiente...")
    
    required_vars = [
        "DATABASE_URL",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "SECRET_KEY"
    ]
    
    missing = []
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing.append(var)
            print(f"  ❌ {var}: NÃO DEFINIDA")
        else:
            # Mostrar apenas parte da variável por segurança
            display_value = value[:20] + "..." if len(value) > 20 else value
            print(f"  ✅ {var}: {display_value}")
    
    if missing:
        print(f"\n❌ Variáveis faltando: {', '.join(missing)}")
        return False
    
    print("\n✅ Todas as variáveis essenciais estão definidas")
    return True

def test_database_connection():
    """Testa a conexão com o banco de dados"""
    print("\n🔍 Testando conexão com banco de dados...")
    
    try:
        from sqlalchemy import create_engine, text
        from config.settings import DATABASE_URL
        
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        
        # Tentar conectar
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
        
        print("  ✅ Conexão com banco de dados OK")
        return True
        
    except Exception as e:
        print(f"  ❌ Erro na conexão: {e}")
        return False

def test_table_structure():
    """Verifica se as tabelas existem e têm as colunas esperadas"""
    print("\n🔍 Testando estrutura de tabelas...")
    
    try:
        from sqlalchemy import create_engine, inspect
        from config.settings import DATABASE_URL
        
        engine = create_engine(DATABASE_URL)
        inspector = inspect(engine)
        
        # Verificar tabela users
        if "users" in inspector.get_table_names():
            columns = [col['name'] for col in inspector.get_columns('users')]
            required_cols = ['id', 'email', 'google_id', 'google_access_token']
            
            missing_cols = [col for col in required_cols if col not in columns]
            if missing_cols:
                print(f"  ⚠️  Tabela 'users' falta colunas: {', '.join(missing_cols)}")
            else:
                print(f"  ✅ Tabela 'users': OK ({len(columns)} colunas)")
        else:
            print("  ⚠️  Tabela 'users' não encontrada")
        
        # Verificar tabela leads
        if "leads" in inspector.get_table_names():
            columns = [col['name'] for col in inspector.get_columns('leads')]
            print(f"  ✅ Tabela 'leads': OK ({len(columns)} colunas)")
        else:
            print("  ⚠️  Tabela 'leads' não encontrada")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Erro ao verificar tabelas: {e}")
        return False

def test_imports():
    """Verifica se todos os imports críticos funcionam"""
    print("\n🔍 Testando imports críticos...")
    
    try:
        import fastapi
        print("  ✅ FastAPI importado")
        
        import sqlalchemy
        print("  ✅ SQLAlchemy importado")
        
        import bcrypt
        print("  ✅ bcrypt importado")
        
        import jwt
        print("  ✅ PyJWT importado")
        
        from models.user import User
        print("  ✅ Model User importado")
        
        from models.lead import Lead
        print("  ✅ Model Lead importado")
        
        from routes import auth, leads
        print("  ✅ Rotas importadas")
        
        return True
        
    except ImportError as e:
        print(f"  ❌ Erro ao importar: {e}")
        return False

def main():
    """Executa todos os testes"""
    print("=" * 60)
    print("🚀 PRÉ-DEPLOY: TESTES DE VALIDAÇÃO")
    print("=" * 60)
    
    results = {
        "Variáveis de Ambiente": test_env_variables(),
        "Imports": test_imports(),
        "Conexão com Banco": test_database_connection(),
        "Estrutura de Tabelas": test_table_structure(),
    }
    
    print("\n" + "=" * 60)
    print("📊 RESUMO DOS TESTES")
    print("=" * 60)
    
    for test_name, passed in results.items():
        status = "✅ PASSOU" if passed else "❌ FALHOU"
        print(f"{test_name}: {status}")
    
    all_passed = all(results.values())
    
    if all_passed:
        print("\n🎉 TODOS OS TESTES PASSARAM!")
        print("✅ Sistema pronto para deploy no Railway")
        return 0
    else:
        print("\n⚠️  ALGUNS TESTES FALHARAM")
        print("❌ Corrija os erros antes de fazer deploy")
        return 1

if __name__ == "__main__":
    sys.exit(main())
