# backend/app/schemas.py

"""
Schemas Pydantic para validação de dados
"""
from pydantic import BaseModel, EmailStr, Field, field_serializer
from typing import Optional, List
from datetime import datetime

class LeadBase(BaseModel):
    """Schema base para Lead"""
    nome_lead: str = Field(..., min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    telefone: Optional[str] = Field(None, max_length=20)
    morada: Optional[str] = Field(None, max_length=500)
    status: str = "Entrada de Lead"
    valor_venda_com_iva: Optional[float] = 0.0
    taxa_iva: float = 0.23
    valor_proposta: Optional[float] = 0.0
    comissao_percentagem: float = 0.05
    notas_conversa: Optional[str] = None
    motivo_perda: Optional[str] = None
    contador_tentativas: int = 0
    origem: Optional[str] = None
    tags: Optional[str] = None
    
    # --- NOVO CAMPO ---
    url_imagem_cliente: Optional[str] = None

class LeadCreate(LeadBase):
    """Schema para criar um Lead"""
    pass

class LeadUpdate(BaseModel):
    """Schema para atualizar um Lead"""
    nome_lead: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    morada: Optional[str] = None
    status: Optional[str] = None
    valor_venda_com_iva: Optional[float] = None
    taxa_iva: Optional[float] = None
    valor_proposta: Optional[float] = None
    comissao_percentagem: Optional[float] = None
    notas_conversa: Optional[str] = None
    motivo_perda: Optional[str] = None
    contador_tentativas: Optional[int] = None
    proxima_acao: Optional[str] = None  # String para aceitar datas ISO do frontend
    origem: Optional[str] = None
    tags: Optional[str] = None
    
    # --- NOVOS CAMPOS ---
    url_imagem_cliente: Optional[str] = None

class Lead(LeadBase):
    """Schema para resposta de Lead"""
    id: int
    comissao_valor: Optional[float] = None
    data_entrada: Optional[datetime] = None
    data_atualizacao: Optional[datetime] = None
    proxima_acao: Optional[datetime] = None
    ativo: bool = True
    google_event_id: Optional[str] = None # Novo campo
    
    @field_serializer('proxima_acao')
    def serialize_proxima_acao(self, dt: Optional[datetime]) -> Optional[str]:
        return dt.isoformat() if dt else None
    
    @field_serializer('data_entrada')
    def serialize_data_entrada(self, dt: Optional[datetime]) -> Optional[str]:
        return dt.isoformat() if dt else None
    
    @field_serializer('data_atualizacao')
    def serialize_data_atualizacao(self, dt: Optional[datetime]) -> Optional[str]:
        return dt.isoformat() if dt else None
    
    class Config:
        from_attributes = True

class LeadResponse(BaseModel):
    """Schema para resposta de Lead com informações calculadas"""
    id: int
    nome_lead: str
    email: Optional[str] = None
    telefone: Optional[str] = None
    morada: Optional[str] = None
    status: str
    valor_venda_com_iva: Optional[float] = None
    valor_sem_iva: Optional[float] = None
    taxa_iva: Optional[float] = None
    comissao_valor: Optional[float] = None
    data_entrada: Optional[datetime] = None
    data_atualizacao: Optional[datetime] = None
    ativo: bool = True

class MetaBase(BaseModel):
    """Schema base para Meta"""
    mes: int = Field(..., ge=1, le=12)
    ano: int
    meta_vendas: float
    meta_leads: int
    meta_comissao: float

class MetaCreate(MetaBase):
    """Schema para criar uma Meta"""
    pass

class MetaUpdate(BaseModel):
    """Schema para atualizar uma Meta"""
    meta_vendas: Optional[float] = None
    meta_leads: Optional[int] = None
    meta_comissao: Optional[float] = None

class Meta(MetaBase):
    """Schema para resposta de Meta"""
    id: int
    data_criacao: datetime
    data_atualizacao: datetime
    
    class Config:
        from_attributes = True

class NotificacaoBase(BaseModel):
    """Schema base para Notificação"""
    lead_id: int
    tipo: str
    titulo: str
    mensagem: str

class NotificacaoCreate(NotificacaoBase):
    """Schema para criar uma Notificação"""
    pass

class Notificacao(NotificacaoBase):
    """Schema para resposta de Notificação"""
    id: int
    lida: bool
    data_criacao: datetime
    data_leitura: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    """Schema para estatísticas do dashboard"""
    total_leads: int
    total_vendas: int
    valor_total_vendas: float
    comissao_total: float
    taxa_conversao: float
    leads_por_status: dict
    vendas_por_mes: dict
    comissao_por_mes: dict

class PaginatedResponse(BaseModel):
    """Schema para resposta paginada"""
    total: int
    page: int
    page_size: int
    total_pages: int
    data: List[dict]
