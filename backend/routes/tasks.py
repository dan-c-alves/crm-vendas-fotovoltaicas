from fastapi import APIRouter, HTTPException
import sqlite3
from datetime import datetime, timedelta, date
from typing import List, Dict, Any, Optional
import os
from pydantic import BaseModel

router = APIRouter()

def get_db_path():
    """Obter caminho da base de dados"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(current_dir, '..', '..', 'data', 'crm_vendas.db')

class TaskItem(BaseModel):
    """Modelo para um item de tarefa"""
    id: int
    tipo: str  # "follow_up", "hot_lead", "sem_contacto"
    titulo: str
    descricao: str
    prioridade: str  # "alta", "media", "baixa"
    lead_nome: str
    lead_status: str
    proxima_acao: Optional[str] = None
    data_proxima_acao: Optional[str] = None
    dias_sem_contacto: Optional[int] = None
    valor_proposta: Optional[float] = None
    created_at: str

class TasksResponse(BaseModel):
    """Resposta da API de tarefas"""
    total_tarefas: int
    tarefas_alta_prioridade: int
    tarefas_follow_up: List[TaskItem]
    tarefas_hot_leads: List[TaskItem]
    tarefas_sem_contacto: List[TaskItem]

@router.get("/scheduled", response_model=dict)
async def obter_tarefas_agendadas():
    """
    Busca apenas os leads que têm data e hora agendadas (com data_proxima_acao definida)
    """
    try:
        db_path = get_db_path()
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Buscar leads com proxima_acao definida (campo correto)
        cursor.execute("""
            SELECT id, nome_lead, email, telefone, morada, 
                   valor_venda_com_iva, taxa_iva, comissao_valor,
                   notas_conversa, proxima_acao, status
            FROM leads 
            WHERE proxima_acao IS NOT NULL 
            AND proxima_acao != ''
            ORDER BY proxima_acao DESC
        """)
        
        tarefas_agendadas = []
        for row in cursor.fetchall():
            (lead_id, nome_lead, email, telefone, morada, 
             valor_venda_com_iva, taxa_iva, comissao_valor,
             notas_conversa, proxima_acao, status) = row
            
            # Calcular valor sem IVA
            valor_sem_iva = 0.0
            if valor_venda_com_iva and valor_venda_com_iva > 0:
                taxa = taxa_iva or 23.0
                valor_sem_iva = valor_venda_com_iva / (1 + taxa / 100)
            
            tarefas_agendadas.append({
                "id": lead_id,
                "nome_lead": nome_lead,
                "email": email,
                "telefone": telefone,
                "morada": morada,
                "status": status,
                "valor_venda_sem_iva": valor_sem_iva,
                "valor_venda_com_iva": valor_venda_com_iva,
                "taxa_iva": taxa_iva or 23,  # IVA padrão de 23%
                "comissao_valor": comissao_valor,
                "proxima_acao_texto": "Contactar cliente",  # Texto padrão da ação
                "data_agendada": proxima_acao,  # Data agendada
                "notas_conversa": notas_conversa
            })
        
        conn.close()
        
        return {
            "total_tarefas": len(tarefas_agendadas),
            "tarefas_agendadas": tarefas_agendadas
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar tarefas agendadas: {str(e)}")

@router.delete("/{lead_id}/remove-date")
async def remover_data_tarefa(lead_id: int):
    """
    Remove a data agendada de um lead, fazendo-o voltar ao status normal
    """
    try:
        db_path = get_db_path()
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar se o lead existe e tem data agendada
        cursor.execute("""
            SELECT id, nome_lead, status, proxima_acao
            FROM leads 
            WHERE id = ? AND proxima_acao IS NOT NULL
        """, (lead_id,))
        
        lead = cursor.fetchone()
        if not lead:
            raise HTTPException(status_code=404, detail="Lead não encontrado ou sem data agendada")
        
        lead_id, nome_lead, status, proxima_acao = lead
        
        # Remover a data agendada
        cursor.execute("""
            UPDATE leads 
            SET proxima_acao = NULL,
                data_atualizacao = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (lead_id,))
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "message": f"Data removida do lead {nome_lead}",
            "lead_id": lead_id,
            "status_atual": status
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao remover data: {str(e)}")

@router.get("/pending", response_model=TasksResponse)
async def obter_tarefas_pendentes():
    """
    Busca todas as tarefas pendentes do sistema:
    1. Follow-ups agendados (hoje/amanhã)
    2. Hot Leads que precisam de atenção
    3. Leads sem próxima ação definida
    """
    try:
        db_path = get_db_path()
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        hoje = date.today()
        amanha = hoje + timedelta(days=1)
        tres_dias_atras = datetime.now() - timedelta(days=3)
        
        # 1. TAREFAS DE FOLLOW-UP (próxima_acao para hoje ou amanhã)
        tarefas_follow_up = []
        cursor.execute("""
            SELECT id, nome_lead, status, proxima_acao, data_proxima_acao, valor_proposta, created_at
            FROM leads 
            WHERE data_proxima_acao IS NOT NULL 
            AND data_proxima_acao <= ? 
            AND status IN ('Entrada de Lead', 'Contactados', 'Follow-up', 'Interessados')
            ORDER BY data_proxima_acao
        """, (amanha.isoformat(),))
        
        for row in cursor.fetchall():
            lead_id, nome_lead, status, proxima_acao, data_proxima_acao, valor_proposta, created_at = row
            data_acao = date.fromisoformat(data_proxima_acao) if data_proxima_acao else None
            
            if data_acao:
                prioridade = "alta" if data_acao <= hoje else "media"
                dias_atraso = (hoje - data_acao).days if data_acao < hoje else 0
                
                titulo = f"Follow-up: {nome_lead}"
                if dias_atraso > 0:
                    titulo += f" (Atrasado {dias_atraso} dias)"
                
                descricao = f"Ação: {proxima_acao or 'Contactar cliente'}"
                if valor_proposta:
                    # Formatação portuguesa: 1.104,00€
                    valor_formatted = f"{valor_proposta:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
                    descricao += f" | Valor: {valor_formatted}€"
                
                tarefas_follow_up.append(TaskItem(
                    id=lead_id,
                    tipo="follow_up",
                    titulo=titulo,
                    descricao=descricao,
                    prioridade=prioridade,
                    lead_nome=nome_lead,
                    lead_status=status,
                    proxima_acao=proxima_acao,
                    data_proxima_acao=data_proxima_acao,
                    valor_proposta=valor_proposta,
                    created_at=created_at
                ))
        
        # 2. HOT LEADS (Negociação/Hot Lead sem atualização há 3+ dias)
        tarefas_hot_leads = []
        cursor.execute("""
            SELECT id, nome_lead, status, updated_at, valor_proposta, created_at
            FROM leads 
            WHERE status IN ('Hot Lead', 'Negociação', 'Proposta Enviada')
            AND updated_at < ?
            ORDER BY valor_proposta DESC
        """, (tres_dias_atras.isoformat(),))
        
        for row in cursor.fetchall():
            lead_id, nome_lead, status, updated_at, valor_proposta, created_at = row
            updated_date = datetime.fromisoformat(updated_at) if updated_at else datetime.now() - timedelta(days=5)
            dias_sem_update = (datetime.now() - updated_date).days
            
            prioridade = "alta" if dias_sem_update >= 5 else "media"
            titulo = f"Urgente: {nome_lead}"
            descricao = f"Sem atualização há {dias_sem_update} dias"
            if valor_proposta:
                # Formatação portuguesa: 1.104,00€
                valor_formatted = f"{valor_proposta:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
                descricao += f" | Valor: {valor_formatted}€"
            
            tarefas_hot_leads.append(TaskItem(
                id=lead_id,
                tipo="hot_lead",
                titulo=titulo,
                descricao=descricao,
                prioridade=prioridade,
                lead_nome=nome_lead,
                lead_status=status,
                dias_sem_contacto=dias_sem_update,
                valor_proposta=valor_proposta,
                created_at=created_at
            ))
        
        # 3. LEADS SEM CONTACTO (sem próxima_acao definida)
        tarefas_sem_contacto = []
        um_dia_atras = datetime.now() - timedelta(hours=24)
        cursor.execute("""
            SELECT id, nome_lead, status, created_at
            FROM leads 
            WHERE (proxima_acao IS NULL OR proxima_acao = '')
            AND status IN ('Entrada de Lead', 'Contactados')
            AND created_at < ?
            ORDER BY created_at DESC
        """, (um_dia_atras.isoformat(),))
        
        for row in cursor.fetchall():
            lead_id, nome_lead, status, created_at = row
            created_date = datetime.fromisoformat(created_at) if created_at else datetime.now() - timedelta(days=2)
            dias_criado = (datetime.now() - created_date).days
            
            prioridade = "alta" if dias_criado >= 3 else "baixa"
            titulo = f"Sem Follow-up: {nome_lead}"
            descricao = f"Lead criado há {dias_criado} dias sem próxima ação"
            
            tarefas_sem_contacto.append(TaskItem(
                id=lead_id,
                tipo="sem_contacto",
                titulo=titulo,
                descricao=descricao,
                prioridade=prioridade,
                lead_nome=nome_lead,
                lead_status=status,
                dias_sem_contacto=dias_criado,
                created_at=created_at
            ))
        
        conn.close()
        
        # Contar tarefas de alta prioridade
        todas_tarefas = tarefas_follow_up + tarefas_hot_leads + tarefas_sem_contacto
        tarefas_alta_prioridade = len([t for t in todas_tarefas if t.prioridade == "alta"])
        
        return TasksResponse(
            total_tarefas=len(todas_tarefas),
            tarefas_alta_prioridade=tarefas_alta_prioridade,
            tarefas_follow_up=tarefas_follow_up,
            tarefas_hot_leads=tarefas_hot_leads,
            tarefas_sem_contacto=tarefas_sem_contacto
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar tarefas: {str(e)}")

@router.get("/stats")
async def obter_estatisticas_tarefas():
    """Estatísticas rápidas para o contador no sidebar"""
    try:
        db_path = get_db_path()
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        hoje = date.today()
        amanha = hoje + timedelta(days=1)
        tres_dias_atras = datetime.now() - timedelta(days=3)
        um_dia_atras = datetime.now() - timedelta(hours=24)
        
        # Contar follow-ups
        cursor.execute("""
            SELECT COUNT(*) FROM leads 
            WHERE data_proxima_acao IS NOT NULL 
            AND data_proxima_acao <= ? 
            AND status IN ('Entrada de Lead', 'Contactados', 'Follow-up', 'Interessados')
        """, (amanha.isoformat(),))
        follow_ups = cursor.fetchone()[0]
        
        # Contar hot leads
        cursor.execute("""
            SELECT COUNT(*) FROM leads 
            WHERE status IN ('Hot Lead', 'Negociação', 'Proposta Enviada')
            AND updated_at < ?
        """, (tres_dias_atras.isoformat(),))
        hot_leads = cursor.fetchone()[0]
        
        # Contar leads sem contacto
        cursor.execute("""
            SELECT COUNT(*) FROM leads 
            WHERE (proxima_acao IS NULL OR proxima_acao = '')
            AND status IN ('Entrada de Lead', 'Contactados')
            AND created_at < ?
        """, (um_dia_atras.isoformat(),))
        sem_contacto = cursor.fetchone()[0]
        
        total = follow_ups + hot_leads + sem_contacto
        
        conn.close()
        
        return {
            "total_tarefas": total,
            "follow_ups": follow_ups,
            "hot_leads": hot_leads,
            "sem_contacto": sem_contacto
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar estatísticas: {str(e)}")