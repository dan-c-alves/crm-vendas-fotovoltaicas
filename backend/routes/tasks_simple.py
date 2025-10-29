from fastapi import APIRouter

router = APIRouter()

@router.get("/stats")
async def obter_estatisticas_tarefas():
    """Estatísticas rápidas para o contador no sidebar - versão simplificada"""
    return {
        "total_tarefas": 7,
        "follow_ups": 3,
        "hot_leads": 2,
        "sem_contacto": 2
    }

@router.get("/pending")
async def obter_tarefas_pendentes():
    """Busca tarefas pendentes - versão simplificada"""
    return {
        "total_tarefas": 7,
        "tarefas_alta_prioridade": 3,
        "tarefas_follow_up": [],
        "tarefas_hot_leads": [],
        "tarefas_sem_contacto": []
    }