"""
Script para migrar e verificar a base de dados
"""
import sqlite3
import os
from pathlib import Path

# Caminho para a base de dados
DB_PATH = Path(__file__).parent.parent / "data" / "crm_vendas.db"

def verificar_estrutura_bd():
    """Verificar a estrutura atual da base de dados"""
    print(f"Verificando base de dados: {DB_PATH}")
    
    if not os.path.exists(DB_PATH):
        print("❌ Base de dados não existe!")
        return False
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Verificar se a tabela leads existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='leads';")
        if not cursor.fetchone():
            print("❌ Tabela 'leads' não existe!")
            return False
        
        # Verificar colunas da tabela leads
        cursor.execute("PRAGMA table_info(leads);")
        colunas = cursor.fetchall()
        
        print("\n📊 Colunas atuais na tabela 'leads':")
        nomes_colunas = []
        for coluna in colunas:
            print(f"  - {coluna[1]} ({coluna[2]})")
            nomes_colunas.append(coluna[1])
        
        # Verificar se faltam colunas importantes
        colunas_necessarias = ['valor_proposta', 'ativo', 'comissao_valor', 'data_entrada']
        colunas_em_falta = []
        for coluna in colunas_necessarias:
            if coluna not in nomes_colunas:
                colunas_em_falta.append(coluna)
        
        if colunas_em_falta:
            print(f"\n⚠️  PROBLEMA: Colunas em falta: {', '.join(colunas_em_falta)}")
            return False
        
        print("\n✅ Estrutura da base de dados está correta!")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao verificar estrutura: {e}")
        return False
    finally:
        conn.close()

def adicionar_colunas_em_falta():
    """Adicionar todas as colunas em falta à tabela existente"""
    print("\n🔧 Adicionando colunas em falta...")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Lista de colunas que podem estar em falta
    colunas_para_adicionar = [
        ("valor_proposta", "REAL DEFAULT 0.0"),
        ("comissao_percentagem", "REAL DEFAULT 0.05"),
        ("comissao_valor", "REAL DEFAULT 0.0"),
        ("motivo_perda", "TEXT"),
        ("data_entrada", "DATETIME"),
        ("data_atualizacao", "DATETIME"),
        ("contador_tentativas", "INTEGER DEFAULT 0"),
        ("ativo", "BOOLEAN DEFAULT 1"),
        ("origem", "TEXT"),
        ("tags", "TEXT"),
    ]
    
    try:
        for nome_coluna, definicao in colunas_para_adicionar:
            try:
                cursor.execute(f"ALTER TABLE leads ADD COLUMN {nome_coluna} {definicao};")
                print(f"  ✅ Coluna '{nome_coluna}' adicionada")
            except sqlite3.Error as e:
                if "duplicate column name" in str(e):
                    print(f"  ℹ️  Coluna '{nome_coluna}' já existe")
                else:
                    print(f"  ❌ Erro ao adicionar coluna '{nome_coluna}': {e}")
        
        conn.commit()
        print("✅ Migração de colunas concluída!")
        return True
        
    except Exception as e:
        print(f"❌ Erro geral na migração: {e}")
        return False
    finally:
        conn.close()

def contar_leads():
    """Contar quantos leads existem na base de dados"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT COUNT(*) FROM leads WHERE ativo = 1;")
        total = cursor.fetchone()[0]
        print(f"\n📈 Total de leads ativos: {total}")
        
        cursor.execute("SELECT status, COUNT(*) FROM leads WHERE ativo = 1 GROUP BY status;")
        por_status = cursor.fetchall()
        
        print("\n📊 Distribuição por status:")
        for status, count in por_status:
            print(f"  - {status}: {count}")
            
    except Exception as e:
        print(f"❌ Erro ao contar leads: {e}")
    finally:
        conn.close()

def main():
    print("🔍 VERIFICAÇÃO E MIGRAÇÃO DA BASE DE DADOS")
    print("=" * 50)
    
    # Verificar estrutura
    if verificar_estrutura_bd():
        print("\n✅ Base de dados está pronta!")
    else:
        print("\n🔧 Corrigindo problemas...")
        if adicionar_colunas_em_falta():
            print("✅ Correções aplicadas com sucesso!")
        else:
            print("❌ Falha ao aplicar correções!")
            return
    
    # Contar leads
    contar_leads()
    
    print("\n" + "=" * 50)
    print("✅ MIGRAÇÃO CONCLUÍDA!")

if __name__ == "__main__":
    main()