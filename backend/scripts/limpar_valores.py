"""
Script para limpar todos os valores monetários dos leads
Deixa todos os valores a 0,00€ para preenchimento manual
"""
import sqlite3
import os
from datetime import datetime

def get_db_path():
    """Obter caminho da base de dados"""
    # Verificar se estamos no diretório correto
    current_dir = os.getcwd()
    if 'backend' in current_dir:
        # Se estivermos no backend, subir um nível
        project_root = os.path.dirname(current_dir)
    else:
        # Se estivermos na raiz do projeto
        project_root = current_dir
    
    db_path = os.path.join(project_root, 'data', 'crm_vendas.db')
    print(f"📂 Caminho da base de dados: {db_path}")
    
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Base de dados não encontrada: {db_path}")
    
    return db_path

def limpar_valores_monetarios():
    """Limpar todos os valores monetários dos leads"""
    db_path = get_db_path()
    
    # Conectar à base de dados
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("🧹 Iniciando limpeza de valores monetários...")
        
        # Obter todos os leads primeiro
        cursor.execute("SELECT id, nome_lead FROM leads WHERE ativo = 1")
        leads = cursor.fetchall()
        
        if not leads:
            print("❌ Nenhum lead encontrado na base de dados")
            return
        
        print(f"📊 Encontrados {len(leads)} leads para limpar")
        
        # Zerar todos os valores monetários
        cursor.execute("""
            UPDATE leads 
            SET 
                valor_venda_com_iva = 0.0,
                valor_proposta = 0.0,
                comissao_valor = 0.0,
                comissao_percentagem = 5.0,
                data_atualizacao = ?
            WHERE ativo = 1
        """, (datetime.now().isoformat(),))
        
        # Confirmar alterações
        conn.commit()
        
        # Verificar resultados
        cursor.execute("""
            SELECT COUNT(*) as total,
                   SUM(valor_venda_com_iva) as soma_vendas,
                   SUM(comissao_valor) as soma_comissoes
            FROM leads 
            WHERE ativo = 1
        """)
        resultado = cursor.fetchone()
        
        print("\n" + "="*50)
        print("✅ LIMPEZA CONCLUÍDA COM SUCESSO!")
        print("="*50)
        print(f"📊 Total de leads atualizados: {resultado[0]}")
        print(f"💰 Soma total de vendas: {resultado[1]:.2f}€")
        print(f"💰 Soma total de comissões: {resultado[2]:.2f}€")
        print("\n🎯 Todos os valores foram zerados!")
        print("📝 Agora pode preencher manualmente os valores de cada cliente.")
        
        # Mostrar alguns exemplos
        print("\n📋 Primeiros 5 leads (exemplo):")
        cursor.execute("""
            SELECT nome_lead, valor_venda_com_iva, comissao_valor 
            FROM leads 
            WHERE ativo = 1 
            ORDER BY nome_lead 
            LIMIT 5
        """)
        exemplos = cursor.fetchall()
        
        for nome, valor, comissao in exemplos:
            print(f"  • {nome}: {valor:.2f}€ (comissão: {comissao:.2f}€)")
        
    except Exception as e:
        print(f"❌ Erro durante a limpeza: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    print("🗑️ LIMPEZA DE VALORES MONETÁRIOS")
    print("=" * 50)
    print("⚠️  ATENÇÃO: Esta operação irá zerar todos os valores!")
    print("📋 Informações dos clientes serão mantidas (nome, email, telefone, etc.)")
    print("💰 Apenas valores de venda e comissão serão zerados")
    print()
    
    resposta = input("🤔 Tem certeza que deseja continuar? (s/N): ").lower().strip()
    
    if resposta in ['s', 'sim', 'y', 'yes']:
        try:
            limpar_valores_monetarios()
            print("\n🎉 Operação concluída com sucesso!")
            print("💡 Pode agora preencher os valores manualmente no sistema.")
        except Exception as e:
            print(f"\n❌ Erro: {e}")
    else:
        print("❌ Operação cancelada pelo utilizador.")