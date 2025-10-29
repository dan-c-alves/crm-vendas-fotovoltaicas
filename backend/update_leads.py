"""
Script para atualizar dados dos leads existentes
"""
import sqlite3
from pathlib import Path

# Caminho para a base de dados
DB_PATH = Path(__file__).parent.parent / "data" / "crm_vendas.db"

def atualizar_leads_existentes():
    """Atualizar leads existentes com valores padrão"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Primeiro, vamos ver quantos leads temos
        cursor.execute("SELECT COUNT(*) FROM leads;")
        total_leads = cursor.fetchone()[0]
        print(f"Total de leads na base de dados: {total_leads}")
        
        if total_leads == 0:
            print("Nenhum lead encontrado.")
            return
        
        # Atualizar campos em falta
        updates = [
            ("UPDATE leads SET ativo = 1 WHERE ativo IS NULL;", "ativo = 1"),
            ("UPDATE leads SET data_entrada = data_criacao WHERE data_entrada IS NULL;", "data_entrada"),
            ("UPDATE leads SET data_atualizacao = data_criacao WHERE data_atualizacao IS NULL;", "data_atualizacao"),
            ("UPDATE leads SET contador_tentativas = 0 WHERE contador_tentativas IS NULL;", "contador_tentativas = 0"),
            ("UPDATE leads SET comissao_percentagem = 0.05 WHERE comissao_percentagem IS NULL;", "comissao_percentagem = 5%"),
        ]
        
        for query, descricao in updates:
            cursor.execute(query)
            affected = cursor.rowcount
            if affected > 0:
                print(f"✅ {affected} leads atualizados: {descricao}")
        
        # Calcular comissões para vendas existentes
        cursor.execute("""
            UPDATE leads 
            SET comissao_valor = (valor_venda_com_iva / (1 + taxa_iva)) * comissao_percentagem 
            WHERE status = 'Ganho' AND comissao_valor = 0 AND valor_venda_com_iva > 0;
        """)
        affected = cursor.rowcount
        if affected > 0:
            print(f"✅ {affected} comissões calculadas para vendas existentes")
        
        conn.commit()
        
        # Verificar resultado final
        cursor.execute("SELECT COUNT(*) FROM leads WHERE ativo = 1;")
        leads_ativos = cursor.fetchone()[0]
        
        cursor.execute("SELECT status, COUNT(*) FROM leads WHERE ativo = 1 GROUP BY status;")
        por_status = cursor.fetchall()
        
        print(f"\n📊 Resumo após atualização:")
        print(f"Total de leads ativos: {leads_ativos}")
        print("Distribuição por status:")
        for status, count in por_status:
            print(f"  - {status}: {count}")
            
    except Exception as e:
        print(f"❌ Erro ao atualizar leads: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔄 ATUALIZANDO DADOS DOS LEADS EXISTENTES")
    print("=" * 50)
    atualizar_leads_existentes()
    print("=" * 50)
    print("✅ ATUALIZAÇÃO CONCLUÍDA!")