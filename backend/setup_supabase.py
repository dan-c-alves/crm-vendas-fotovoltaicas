"""
Script para criar todas as tabelas no Supabase (PostgreSQL)
Execute este script LOCALMENTE para criar as tabelas no banco de produção
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Carregar .env
load_dotenv()

# URL do Supabase (produção)
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ DATABASE_URL não encontrado no .env")
    exit(1)

print(f"🔗 Conectando ao Supabase: {DATABASE_URL[:50]}...")

try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    
    # Testar conexão
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version()"))
        version = result.fetchone()[0]
        print(f"✅ Conectado ao PostgreSQL: {version[:50]}...")
    
    print("\n📦 Criando tabelas...")
    
    # Importar os modelos (isso vai criar as tabelas via SQLAlchemy)
    from models.lead import Base as LeadBase
    from models.user import Base as UserBase
    
    # Criar todas as tabelas
    LeadBase.metadata.create_all(bind=engine)
    UserBase.metadata.create_all(bind=engine)
    
    print("✅ Tabelas criadas com sucesso!")
    
    # Verificar tabelas criadas
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """))
        
        tables = [row[0] for row in result]
        print(f"\n📋 Tabelas no banco ({len(tables)}):")
        for table in tables:
            print(f"  - {table}")
    
    # Criar usuário padrão se não existir
    print("\n👤 Verificando usuário padrão...")
    from sqlalchemy.orm import sessionmaker
    from models.user import User
    
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        user_exists = session.query(User).filter(User.id == 1).first()
        if not user_exists:
            default_user = User(
                email="admin@crm.com",
                nome="Administrador",
            )
            session.add(default_user)
            session.commit()
            print("✅ Usuário padrão criado: admin@crm.com")
        else:
            print(f"✅ Usuário padrão já existe: {user_exists.email}")
    except Exception as e:
        print(f"⚠️  Erro ao criar usuário padrão: {e}")
        session.rollback()
    finally:
        session.close()
    
    print("\n🎉 Setup do Supabase concluído com sucesso!")
    print("\n📝 Próximo passo:")
    print("   1. Configure as variáveis no Railway (Variables tab)")
    print("   2. Aguarde o redeploy")
    print("   3. Teste o login Google")
    
except Exception as e:
    print(f"\n❌ Erro: {e}")
    print("\nVerifique:")
    print("  - DATABASE_URL está correto no .env")
    print("  - Supabase está acessível")
    print("  - Credenciais do banco estão corretas")
    exit(1)
