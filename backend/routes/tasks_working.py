from fastapi import APIRouter, HTTPException
import sqlite3
import os

router = APIRouter()

def get_db_path():
    """Obter caminho da base de dados"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(current_dir, '..', '..', 'data', 'crm_vendas.db')

@router.get("/stats")
async def obter_estatisticas_tarefas():
    """Estatísticas rápidas para o contador no sidebar"""
    try:
        db_path = get_db_path()
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Contar total de leads
        cursor.execute("SELECT COUNT(*) FROM leads")
        total_leads = cursor.fetchone()[0]
        
        # Estatísticas simples para começar
        follow_ups = min(3, total_leads)  # Exemplo: máximo 3
        hot_leads = min(2, total_leads)   # Exemplo: máximo 2  
        sem_contacto = min(2, total_leads) # Exemplo: máximo 2
        
        total = follow_ups + hot_leads + sem_contacto
        
        conn.close()
        
        return {
            "total_tarefas": total,
            "follow_ups": follow_ups,
            "hot_leads": hot_leads,
            "sem_contacto": sem_contacto
        }
        
    except Exception as e:
        return {
            "total_tarefas": 0,
            "follow_ups": 0,
            "hot_leads": 0,
            "sem_contacto": 0,
            "error": str(e)
        }

@router.get("/pending")
async def obter_tarefas_pendentes():
    """Busca tarefas pendentes - versão simplificada"""
    try:
        db_path = get_db_path()
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Buscar alguns leads para demonstração
        cursor.execute("SELECT id, nome_lead, status FROM leads LIMIT 5")
        leads = cursor.fetchall()
        
        tarefas_exemplo = []
        for i, (lead_id, nome, status) in enumerate(leads):
            if i < 2:  # Follow-ups
                tarefas_exemplo.append({
                    "id": lead_id,
                    "tipo": "follow_up",
                    "titulo": f"Follow-up: {nome}",
                    "descricao": f"Contactar {nome} - Status: {status}",
                    "prioridade": "media",
                    "lead_nome": nome,
                    "lead_status": status
                })
            elif i < 4:  # Hot leads
                tarefas_exemplo.append({
                    "id": lead_id,
                    "tipo": "hot_lead", 
                    "titulo": f"Urgente: {nome}",
                    "descricao": f"Lead quente - {status}",
                    "prioridade": "alta",
                    "lead_nome": nome,
                    "lead_status": status
                })
            else:  # Sem contacto
                tarefas_exemplo.append({
                    "id": lead_id,
                    "tipo": "sem_contacto",
                    "titulo": f"Sem Follow-up: {nome}",
                    "descricao": f"Definir próxima ação - {status}",
                    "prioridade": "baixa",
                    "lead_nome": nome,
                    "lead_status": status
                })
        
        conn.close()
        
        # Separar por tipo
        follow_ups = [t for t in tarefas_exemplo if t["tipo"] == "follow_up"]
        hot_leads = [t for t in tarefas_exemplo if t["tipo"] == "hot_lead"]
        sem_contacto = [t for t in tarefas_exemplo if t["tipo"] == "sem_contacto"]
        
        return {
            "total_tarefas": len(tarefas_exemplo),
            "tarefas_alta_prioridade": len([t for t in tarefas_exemplo if t["prioridade"] == "alta"]),
            "tarefas_follow_up": follow_ups,
            "tarefas_hot_leads": hot_leads,
            "tarefas_sem_contacto": sem_contacto
        }
        
    except Exception as e:
        return {
            "total_tarefas": 0,
            "tarefas_alta_prioridade": 0,
            "tarefas_follow_up": [],
            "tarefas_hot_leads": [],
            "tarefas_sem_contacto": [],
            "error": str(e)
        }