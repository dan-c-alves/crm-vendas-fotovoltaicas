"""
Script de migração de dados do CRM antigo para o novo sistema
Importa leads da base de dados SQLite antiga
"""
import sqlite3
import sys
from pathlib import Path
from datetime import datetime

# Adicionar o diretório do backend ao path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import SessionLocal, init_db
from models.lead import Lead
from utils.calculators import ComissaoCalculator

def migrate_leads(old_db_path: str):
    """Migrar leads da base de dados antiga"""
    
    print("🔄 Iniciando migração de dados...")
    
    try:
        # Conectar à base de dados antiga
        old_conn = sqlite3.connect(old_db_path)
        old_conn.row_factory = sqlite3.Row
        old_cursor = old_conn.cursor()
        
        # Verificar se a tabela exists
        old_cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='leads'")
        if not old_cursor.fetchone():
            print("❌ Tabela 'leads' não encontrada na base de dados antiga")
            return False
        
        # Buscar todos os leads
        old_cursor.execute("SELECT * FROM leads")
        old_leads = old_cursor.fetchall()
        
        print(f"📊 Encontrados {len(old_leads)} leads para migrar")
        
        # Inicializar nova base de dados
        init_db()
        
        # Criar sessão
        db = SessionLocal()
        
        # Migrar leads
        migrated = 0
        errors = 0
        
        for old_lead in old_leads:
            try:
                # Extrair dados
                nome = old_lead['nome_lead']
                email = old_lead.get('email')
                telefone = old_lead.get('telefone')
                morada = old_lead.get('morada')
                status = old_lead.get('status', 'Entrada de Lead')
                valor_com_iva = old_lead.get('valor_venda_com_iva', 0) or 0
                taxa_iva = old_lead.get('taxa_iva', 0.23) or 0.23
                notas = old_lead.get('notas_conversa')
                motivo_perda = old_lead.get('motivo_perda')
                contador = old_lead.get('contador_tentativas', 0) or 0
                data_entrada = old_lead.get('data_entrada')
                data_atualizacao = old_lead.get('data_atualizacao')
                proxima_acao = old_lead.get('proxima_acao')
                
                # Calcular comissão
                comissao_percentagem = 0.05  # 5%
                if valor_com_iva > 0:
                    valor_sem_iva = ComissaoCalculator.calcular_valor_sem_iva(valor_com_iva, taxa_iva)
                    comissao_valor = ComissaoCalculator.calcular_comissao(valor_sem_iva, comissao_percentagem)
                else:
                    comissao_valor = 0
                
                # Converter datas
                if data_entrada and isinstance(data_entrada, str):
                    try:
                        data_entrada = datetime.fromisoformat(data_entrada.replace('Z', '+00:00'))
                    except:
                        data_entrada = datetime.now()
                
                if data_atualizacao and isinstance(data_atualizacao, str):
                    try:
                        data_atualizacao = datetime.fromisoformat(data_atualizacao.replace('Z', '+00:00'))
                    except:
                        data_atualizacao = datetime.now()
                
                if proxima_acao and isinstance(proxima_acao, str):
                    try:
                        proxima_acao = datetime.fromisoformat(proxima_acao.replace('Z', '+00:00'))
                    except:
                        proxima_acao = None
                
                # Criar novo lead
                new_lead = Lead(
                    nome_lead=nome,
                    email=email,
                    telefone=telefone,
                    morada=morada,
                    status=status,
                    valor_venda_com_iva=valor_com_iva,
                    taxa_iva=taxa_iva,
                    comissao_percentagem=comissao_percentagem,
                    comissao_valor=comissao_valor,
                    notas_conversa=notas,
                    motivo_perda=motivo_perda,
                    contador_tentativas=contador,
                    data_entrada=data_entrada or datetime.now(),
                    data_atualizacao=data_atualizacao or datetime.now(),
                    proxima_acao=proxima_acao,
                    ativo=True,
                )
                
                db.add(new_lead)
                migrated += 1
                
                # Mostrar progresso
                if migrated % 10 == 0:
                    print(f"  ✓ {migrated} leads migrados...")
                
            except Exception as e:
                errors += 1
                print(f"  ⚠️  Erro ao migrar lead: {str(e)}")
                continue
        
        # Commit
        db.commit()
        db.close()
        old_conn.close()
        
        print(f"\n✅ Migração concluída!")
        print(f"   ✓ {migrated} leads migrados com sucesso")
        if errors > 0:
            print(f"   ⚠️  {errors} erros durante a migração")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro durante a migração: {str(e)}")
        return False

def main():
    """Função principal"""
    
    # Caminho da base de dados antiga
    old_db_path = "/home/ubuntu/upload/crm_database.db"
    
    # Verificar se o ficheiro existe
    if not Path(old_db_path).exists():
        print(f"❌ Ficheiro não encontrado: {old_db_path}")
        print("\nPor favor, forneça o caminho correto:")
        old_db_path = input("Caminho para crm_database.db: ").strip()
        
        if not Path(old_db_path).exists():
            print("❌ Ficheiro ainda não encontrado")
            return False
    
    # Executar migração
    return migrate_leads(old_db_path)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

