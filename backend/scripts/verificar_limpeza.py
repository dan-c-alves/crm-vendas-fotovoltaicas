"""
Verificação final após limpeza de valores
"""
import sqlite3
import os

def verificar_limpeza():
    """Verificar se a limpeza foi bem-sucedida"""
    # Caminho da base de dados
    db_path = os.path.join('..', 'data', 'crm_vendas.db')
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Estatísticas gerais
        cursor.execute("""
            SELECT 
                COUNT(*) as total_leads,
                COUNT(CASE WHEN status = 'Ganho' THEN 1 END) as vendas,
                SUM(valor_venda_com_iva) as total_vendas,
                SUM(comissao_valor) as total_comissoes,
                AVG(valor_venda_com_iva) as media_vendas
            FROM leads 
            WHERE ativo = 1
        """)
        stats = cursor.fetchone()
        
        print("📊 VERIFICAÇÃO PÓS-LIMPEZA")
        print("=" * 40)
        print(f"👥 Total de leads: {stats[0]}")
        print(f"🏆 Vendas (status Ganho): {stats[1]}")
        print(f"💰 Valor total de vendas: {stats[2]:.2f}€")
        print(f"💰 Total de comissões: {stats[3]:.2f}€") 
        print(f"📈 Valor médio por venda: {stats[4]:.2f}€")
        
        # Verificar se há valores não zerados
        cursor.execute("""
            SELECT COUNT(*) 
            FROM leads 
            WHERE ativo = 1 
            AND (valor_venda_com_iva > 0 OR comissao_valor > 0)
        """)
        nao_zerados = cursor.fetchone()[0]
        
        if nao_zerados == 0:
            print("\n✅ LIMPEZA 100% CONCLUÍDA!")
            print("🎯 Todos os valores foram zerados com sucesso")
            print("📝 Sistema pronto para preenchimento manual")
        else:
            print(f"\n⚠️ Atenção: {nao_zerados} leads ainda têm valores não zerados")
            
        # Mostrar estrutura de dados mantida
        cursor.execute("""
            SELECT nome_lead, email, telefone, status
            FROM leads 
            WHERE ativo = 1 
            ORDER BY nome_lead
            LIMIT 3
        """)
        exemplos = cursor.fetchall()
        
        print("\n📋 Dados mantidos (exemplo):")
        for nome, email, telefone, status in exemplos:
            print(f"  • {nome} | {email or 'N/A'} | {telefone or 'N/A'} | {status}")
            
    finally:
        conn.close()

if __name__ == "__main__":
    verificar_limpeza()