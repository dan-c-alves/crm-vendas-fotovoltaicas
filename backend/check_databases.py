"""
Script para verificar todas as bases de dados e migrar dados
"""
import sqlite3
from pathlib import Path
import shutil

# Diretório de dados
DATA_DIR = Path(__file__).parent.parent / "data"

def verificar_base_dados(db_path):
    """Verificar uma base de dados específica"""
    print(f"\n🔍 Verificando: {db_path.name}")
    
    if not db_path.exists():
        print("  ❌ Arquivo não existe")
        return None
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Verificar tabelas
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tabelas = cursor.fetchall()
        
        if not tabelas:
            print("  ❌ Nenhuma tabela encontrada")
            return None
        
        print(f"  📊 Tabelas encontradas: {[t[0] for t in tabelas]}")
        
        # Se tem tabela leads, contar registros
        if ('leads',) in tabelas:
            cursor.execute("SELECT COUNT(*) FROM leads;")
            total = cursor.fetchone()[0]
            print(f"  📈 Total de leads: {total}")
            
            if total > 0:
                # Mostrar alguns dados
                cursor.execute("SELECT nome_lead, status FROM leads LIMIT 5;")
                leads = cursor.fetchall()
                print("  📋 Primeiros leads:")
                for nome, status in leads:
                    print(f"    - {nome} ({status})")
                
                return {
                    'path': db_path,
                    'total_leads': total,
                    'leads': leads
                }
        
        return None
        
    except Exception as e:
        print(f"  ❌ Erro ao verificar: {e}")
        return None
    finally:
        conn.close()

def migrar_dados_se_necessario():
    """Migrar dados da base antiga para a nova se necessário"""
    print("\n🔄 VERIFICANDO BASES DE DADOS DISPONÍVEIS")
    print("=" * 60)
    
    bases_com_dados = []
    
    # Verificar todas as bases de dados
    for db_file in DATA_DIR.glob("*.db"):
        resultado = verificar_base_dados(db_file)
        if resultado and resultado['total_leads'] > 0:
            bases_com_dados.append(resultado)
    
    if not bases_com_dados:
        print("\n❌ Nenhuma base de dados com leads encontrada!")
        return False
    
    print(f"\n✅ Encontradas {len(bases_com_dados)} bases com dados:")
    
    # Escolher a base com mais dados
    base_principal = max(bases_com_dados, key=lambda x: x['total_leads'])
    
    print(f"\n🎯 Base principal: {base_principal['path'].name} ({base_principal['total_leads']} leads)")
    
    # Se não for a crm_vendas.db, migrar dados
    target_db = DATA_DIR / "crm_vendas.db"
    
    if base_principal['path'].name != "crm_vendas.db":
        print(f"\n🔄 Migrando dados de {base_principal['path'].name} para crm_vendas.db...")
        
        # Conectar às duas bases
        source_conn = sqlite3.connect(base_principal['path'])
        target_conn = sqlite3.connect(target_db)
        
        try:
            # Copiar dados
            source_cursor = source_conn.cursor()
            target_cursor = target_conn.cursor()
            
            # Buscar todos os leads da base original
            source_cursor.execute("SELECT * FROM leads;")
            leads = source_cursor.fetchall()
            
            # Buscar colunas da tabela original
            source_cursor.execute("PRAGMA table_info(leads);")
            colunas_origem = [col[1] for col in source_cursor.fetchall()]
            
            print(f"  📊 Colunas na base origem: {colunas_origem}")
            
            # Buscar colunas da tabela destino
            target_cursor.execute("PRAGMA table_info(leads);")
            colunas_destino = [col[1] for col in target_cursor.fetchall()]
            
            print(f"  📊 Colunas na base destino: {colunas_destino}")
            
            # Mapear colunas comuns
            colunas_comuns = [col for col in colunas_origem if col in colunas_destino]
            print(f"  🔗 Colunas comuns: {colunas_comuns}")
            
            # Preparar query de inserção
            placeholders = ', '.join(['?' for _ in colunas_comuns])
            colunas_str = ', '.join(colunas_comuns)
            
            insert_query = f"INSERT INTO leads ({colunas_str}) VALUES ({placeholders})"
            
            # Migrar cada lead
            leads_migrados = 0
            for lead in leads:
                try:
                    # Extrair apenas as colunas comuns
                    valores = []
                    for col in colunas_comuns:
                        idx = colunas_origem.index(col)
                        valores.append(lead[idx])
                    
                    target_cursor.execute(insert_query, valores)
                    leads_migrados += 1
                    
                except Exception as e:
                    print(f"    ❌ Erro ao migrar lead: {e}")
            
            target_conn.commit()
            print(f"  ✅ {leads_migrados} leads migrados com sucesso!")
            
            return True
            
        except Exception as e:
            print(f"  ❌ Erro na migração: {e}")
            return False
        finally:
            source_conn.close()
            target_conn.close()
    
    else:
        print(f"\n✅ Os dados já estão na base correta!")
        return True

if __name__ == "__main__":
    migrar_dados_se_necessario()