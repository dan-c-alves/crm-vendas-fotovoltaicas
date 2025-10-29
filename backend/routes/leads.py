# backend/routes/leads.py

"""
Rotas para gestão de Leads
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, or_
from typing import List, Optional
from datetime import datetime, timedelta # NOVO IMPORT
import pytz # NOVO IMPORT

from app.database import get_db
from app.schemas import Lead, LeadCreate, LeadUpdate, LeadResponse, PaginatedResponse
from models.lead import Lead as LeadModel
from models.user import User as UserModel # NOVO IMPORT
from utils.calculators import ComissaoCalculator, AnalyticsCalculator
from utils.calendar import GoogleCalendarManager # NOVO IMPORT

router = APIRouter(prefix="/api/leads", tags=["leads"])

# Define o timezone de Portugal
TZ = pytz.timezone('Europe/Lisbon')

# ============================================================================
# CRUD - CREATE, READ, UPDATE, DELETE
# ============================================================================

@router.post("/", response_model=Lead)
def criar_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    """Criar um novo lead"""
    try:
        # Converter os dados do Pydantic para SQLAlchemy
        lead_data = lead.dict()
        
        # Calcular comissão se há valor de venda
        if lead_data.get('valor_venda_com_iva', 0) > 0:
            valor_com_iva = lead_data['valor_venda_com_iva']
            taxa_iva = lead_data.get('taxa_iva', 23.0)
            
            # Calcular valor sem IVA e comissão
            valor_sem_iva = ComissaoCalculator.calcular_valor_sem_iva(valor_com_iva, taxa_iva)
            comissao = valor_sem_iva * 0.05  # 5%
            lead_data['comissao_valor'] = comissao
        
        db_lead = LeadModel(**lead_data)
        db.add(db_lead)
        db.commit()
        db.refresh(db_lead)
        
        print(f"✅ Lead criado: {db_lead.nome_lead} (ID: {db_lead.id})")
        return db_lead
        
    except Exception as e:
        print(f"❌ Erro ao criar lead: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.get("/", response_model=PaginatedResponse)
def listar_leads(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Listar leads com paginação e filtros"""
    try:
        query = db.query(LeadModel).filter(LeadModel.ativo == True)
        
        # Filtro por status
        if status:
            query = query.filter(LeadModel.status == status)
        
        # Filtro por busca (nome, email, telefone)
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    LeadModel.nome_lead.ilike(search_filter),
                    LeadModel.email.ilike(search_filter),
                    LeadModel.telefone.ilike(search_filter)
                )
            )
        
        # Contar total
        total = query.count()
        
        # Aplicar paginação
        offset = (page - 1) * page_size
        leads = query.order_by(desc(LeadModel.data_atualizacao)).offset(offset).limit(page_size).all()
        
        # Calcular páginas
        total_pages = (total + page_size - 1) // page_size
        
        # Converter para dicionários
        leads_data = []
        for lead in leads:
            lead_dict = lead.to_dict()
            leads_data.append(lead_dict)
        
        return {
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "data": leads_data
        }
        
    except Exception as e:
        print(f"❌ Erro ao listar leads: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.get("/{lead_id}", response_model=Lead)
def obter_lead(lead_id: int, db: Session = Depends(get_db)):
    """Obter um lead por ID"""
    lead = db.query(LeadModel).filter(LeadModel.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")
    return lead

# ... (Rota listar_leads - SEM ALTERAÇÕES) ...

@router.put("/{lead_id}", response_model=Lead)
def atualizar_lead(lead_id: int, lead_update: LeadUpdate, db: Session = Depends(get_db)):
    """Atualizar um lead"""
    try:
        print(f"🔄 Atualizando lead {lead_id} com dados: {lead_update.dict(exclude_unset=True)}")
        
        lead = db.query(LeadModel).filter(LeadModel.id == lead_id).first()
        if not lead:
            print(f"❌ Lead {lead_id} não encontrado")
            raise HTTPException(status_code=404, detail="Lead não encontrado")
        
        # --- LÓGICA DE GOOGLE CALENDAR ---
        old_proxima_acao = lead.proxima_acao
        
        # Atualizar campos
        update_data = lead_update.dict(exclude_unset=True)
        print(f"📝 Dados para atualizar: {update_data}")
        
        # Se valor ou taxa IVA foi atualizado, recalcular comissão (sempre 5%)
        if 'valor_venda_com_iva' in update_data or 'taxa_iva' in update_data:
            valor_com_iva = update_data.get('valor_venda_com_iva', lead.valor_venda_com_iva) or 0.0
            taxa = update_data.get('taxa_iva', lead.taxa_iva) or 23.0
            
            # Garantir que são números
            valor_com_iva = float(valor_com_iva) if valor_com_iva else 0.0
            taxa = float(taxa) if taxa else 23.0
            
            # Calcular valor sem IVA
            if valor_com_iva > 0.0:
                valor_sem_iva = ComissaoCalculator.calcular_valor_sem_iva(valor_com_iva, taxa)
            else:
                valor_sem_iva = 0.0
            
            # Comissão sempre 5% do valor sem IVA
            comissao_calculada = valor_sem_iva * 0.05  # 5%
            update_data['comissao_valor'] = comissao_calculada
            
            print(f"💰 Comissão calculada (5%): {comissao_calculada} de {valor_sem_iva}")
        
        # Converter proxima_acao se necessário (o campo correto na base de dados)
        if 'proxima_acao' in update_data:
            data_value = update_data['proxima_acao']
            
            # --- Lógica de conversão de data (simplificada) ---
            new_proxima_acao = None
            if data_value and isinstance(data_value, str):
                try:
                    # Tentar diferentes formatos de data (ISO)
                    # Adicionar timezone para evitar erros
                    if 'Z' in data_value:
                        data_value = data_value.replace('Z', '+00:00')
                    
                    dt_utc = datetime.fromisoformat(data_value)
                    new_proxima_acao = dt_utc.astimezone(TZ).replace(tzinfo=None)
                    print(f"📅 Data convertida: {new_proxima_acao}")
                except Exception as e:
                    print(f"⚠️  Erro ao converter data '{data_value}': {e}")
            
            update_data['proxima_acao'] = new_proxima_acao
            
            # --- LÓGICA DE AGENDAMENTO NO GOOGLE CALENDAR ---
            
            # Se a data foi alterada para uma data futura (e é válida)
            if new_proxima_acao and new_proxima_acao != old_proxima_acao and new_proxima_acao > datetime.now():
                
                # 1. Obter o token do utilizador (assumindo ID 1)
                user = db.query(UserModel).filter(UserModel.id == 1).first()
                if user and user.google_calendar_token:
                    
                    try:
                        manager = GoogleCalendarManager(token=user.google_calendar_token)
                        
                        # 2. Eliminar evento antigo se existir
                        if lead.google_event_id:
                            manager.delete_event(lead.google_event_id)
                            update_data['google_event_id'] = None # Limpar o ID
                        
                        # 3. Criar novo evento
                        summary = f"FOLLOW-UP: {lead.nome_lead} ({lead.telefone})"
                        description = f"Status: {lead.status}. Notas: {update_data.get('notas_conversa', lead.notas_conversa) or 'N/A'}"
                        
                        event_id = manager.create_event(
                            summary=summary,
                            description=description,
                            start_time=new_proxima_acao,
                            duration_minutes=30
                        )
                        
                        if event_id:
                            update_data['google_event_id'] = event_id
                            print(f"✅ Evento Google Calendar criado com ID: {event_id}")
                        
                    except Exception as e:
                        print(f"❌ Erro ao interagir com Google Calendar: {e}")
                        # Não impede a atualização do lead, mas avisa
                        
            # Se a data foi removida, eliminar o evento
            elif new_proxima_acao is None and lead.google_event_id:
                 user = db.query(UserModel).filter(UserModel.id == 1).first()
                 if user and user.google_calendar_token:
                    manager = GoogleCalendarManager(token=user.google_calendar_token)
                    manager.delete_event(lead.google_event_id)
                    update_data['google_event_id'] = None
        
        # --- FIM LÓGICA GOOGLE CALENDAR ---
        
        # Atualizar data de atualização
        update_data['data_atualizacao'] = datetime.utcnow()
        
        for field, value in update_data.items():
            print(f"  Atualizando {field}: {value}")
            setattr(lead, field, value)
        
        db.commit()
        db.refresh(lead)
        
        print(f"✅ Lead {lead_id} atualizado com sucesso")
        return lead
        
    except ValueError as e:
        print(f"❌ Erro de valor: {e}")
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erro de validação: {str(e)}")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.delete("/{lead_id}", status_code=204)
def eliminar_lead(lead_id: int, db: Session = Depends(get_db)):
    """Eliminar um lead (soft delete)"""
    try:
        lead = db.query(LeadModel).filter(LeadModel.id == lead_id).first()
        if not lead:
            raise HTTPException(status_code=404, detail="Lead não encontrado")
        
        # Eliminar evento do Google Calendar se existir
        if lead.google_event_id:
             user = db.query(UserModel).filter(UserModel.id == 1).first()
             if user and user.google_calendar_token:
                manager = GoogleCalendarManager(token=user.google_calendar_token)
                manager.delete_event(lead.google_event_id)
                lead.google_event_id = None
        
        # Soft delete
        lead.ativo = False
        lead.data_atualizacao = datetime.utcnow()
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# ANÁLISES E ESTATÍSTICAS
# ============================================================================

@router.get("/analytics/dashboard")
def obter_estatisticas_dashboard(db: Session = Depends(get_db)):
    """Obter estatísticas para o dashboard"""
    try:
        # Buscar todos os leads ativos
        leads = db.query(LeadModel).filter(LeadModel.ativo == True).all()
        
        # Converter para dicionários
        leads_data = [lead.to_dict() for lead in leads]
        
        # Estatísticas básicas
        total_leads = len(leads_data)
        leads_ganhos = [l for l in leads_data if l['status'] == 'Ganho']
        total_vendas = len(leads_ganhos)
        
        # Valores financeiros
        valor_total_vendas = sum(l.get('valor_venda_com_iva', 0) or 0 for l in leads_ganhos)
        comissao_total = sum(l.get('comissao_valor', 0) or 0 for l in leads_ganhos)
        
        # Taxa de conversão
        taxa_conversao = AnalyticsCalculator.calcular_taxa_conversao(total_leads, total_vendas)
        
        # Distribuição por status
        leads_por_status = AnalyticsCalculator.obter_distribuicao_por_status(leads_data)
        
        # Vendas por mês
        vendas_por_mes = AnalyticsCalculator.obter_vendas_por_mes(leads_data)
        
        # Comissões por mês  
        comissao_por_mes = AnalyticsCalculator.obter_comissoes_por_mes(leads_data)
        
        return {
            "total_leads": total_leads,
            "total_vendas": total_vendas,
            "valor_total_vendas": valor_total_vendas,
            "comissao_total": comissao_total,
            "taxa_conversao": taxa_conversao,
            "leads_por_status": leads_por_status,
            "vendas_por_mes": vendas_por_mes,
            "comissao_por_mes": comissao_por_mes
        }
        
    except Exception as e:
        print(f"❌ Erro ao calcular estatísticas: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.get("/filtros/status")
def obter_opcoes_status(db: Session = Depends(get_db)):
    """Obter opções de status disponíveis"""
    return {
        "status_options": [
            "Entrada de Lead", "Contactados", "Levantamento Técnico", 
            "Em Orçamentação", "Proposta Entregue", "Negociação", 
            "Hot Lead", "Ganho", "Perdidos", "Não Atende"
        ]
    }

@router.get("/stats/funil")
def obter_funil_vendas(db: Session = Depends(get_db)):
    """Obter dados do funil de vendas"""
    try:
        leads = db.query(LeadModel).filter(LeadModel.ativo == True).all()
        leads_data = [lead.to_dict() for lead in leads]
        
        funil = AnalyticsCalculator.obter_funil_vendas(leads_data)
        
        return {"funil": funil}
        
    except Exception as e:
        print(f"❌ Erro ao calcular funil: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")
