# backend/models/lead.py

"""
Modelo de dados para Leads
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Lead(Base):
    """Modelo de Lead para o CRM"""
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    nome_lead = Column(String(255), nullable=False, index=True)
    email = Column(String(255), index=True)
    telefone = Column(String(20))
    morada = Column(String(500))
    
    # Status do funil de vendas
    status = Column(String(50), default="Entrada de Lead", index=True)
    
    # Informações financeiras
    valor_venda_com_iva = Column(Float, default=0.0)
    taxa_iva = Column(Float, default=0.23)
    valor_proposta = Column(Float, default=0.0)
    
    # Comissão
    comissao_percentagem = Column(Float, default=0.05)
    comissao_valor = Column(Float, default=0.0)
    
    # Notas e histórico
    notas_conversa = Column(Text)
    motivo_perda = Column(String(500))
    
    # Datas
    data_entrada = Column(DateTime, default=datetime.utcnow, index=True)
    data_atualizacao = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    proxima_acao = Column(DateTime)
    
    # --- NOVOS CAMPOS ---
    url_imagem_cliente = Column(String(500))  # URL da imagem no Cloudinary
    google_event_id = Column(String(255))  # ID do evento no Google Calendar
    tarefa_concluida = Column(Boolean, default=False)  # Se a tarefa foi concluída
    
    # Controle
    contador_tentativas = Column(Integer, default=0)
    ativo = Column(Boolean, default=True)
    
    # Metadados
    origem = Column(String(100))  # Como o lead foi adquirido
    tags = Column(String(500))  # Tags separadas por vírgula
    
    def __repr__(self):
        return f"<Lead {self.id}: {self.nome_lead}>"
    
    def to_dict(self):
        """Converter para dicionário"""
        return {
            "id": getattr(self, 'id', None),
            "nome_lead": getattr(self, 'nome_lead', ''),
            "email": getattr(self, 'email', None),
            "telefone": getattr(self, 'telefone', None),
            "morada": getattr(self, 'morada', None),
            "status": getattr(self, 'status', 'Entrada de Lead'),
            "valor_venda_com_iva": getattr(self, 'valor_venda_com_iva', 0.0),
            "taxa_iva": getattr(self, 'taxa_iva', 0.23),
            "valor_proposta": getattr(self, 'valor_proposta', 0.0),
            "comissao_percentagem": getattr(self, 'comissao_percentagem', 0.05),
            "comissao_valor": getattr(self, 'comissao_valor', 0.0),
            "notas_conversa": getattr(self, 'notas_conversa', None),
            "motivo_perda": getattr(self, 'motivo_perda', None),
            "data_entrada": self.data_entrada.isoformat() if getattr(self, 'data_entrada', None) else None,
            "data_atualizacao": self.data_atualizacao.isoformat() if getattr(self, 'data_atualizacao', None) else None,
            "proxima_acao": self.proxima_acao.isoformat() if getattr(self, 'proxima_acao', None) else None,
            "url_imagem_cliente": getattr(self, 'url_imagem_cliente', None), # NOVO
            "google_event_id": getattr(self, 'google_event_id', None), # NOVO
            "tarefa_concluida": getattr(self, 'tarefa_concluida', False), # NOVO
            "contador_tentativas": getattr(self, 'contador_tentativas', 0),
            "ativo": getattr(self, 'ativo', True),
            "origem": getattr(self, 'origem', None),
            "tags": getattr(self, 'tags', None),
        }


class Meta(Base):
    """Modelo de Metas e Objetivos"""
    __tablename__ = "metas"

    id = Column(Integer, primary_key=True, index=True)
    mes = Column(Integer)  # 1-12
    ano = Column(Integer)
    meta_vendas = Column(Float)  # Meta em valor
    meta_leads = Column(Integer)  # Meta em número de leads
    meta_comissao = Column(Float)  # Meta de comissão
    
    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_atualizacao = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "mes": self.mes,
            "ano": self.ano,
            "meta_vendas": self.meta_vendas,
            "meta_leads": self.meta_leads,
            "meta_comissao": self.meta_comissao,
            "data_criacao": self.data_criacao.isoformat() if getattr(self, 'data_criacao', None) else None,
            "data_atualizacao": self.data_atualizacao.isoformat() if getattr(self, 'data_atualizacao', None) else None,
        }


class Notificacao(Base):
    """Modelo de Notificações"""
    __tablename__ = "notificacoes"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, index=True)
    tipo = Column(String(50))  # follow-up, alerta, sucesso, etc
    titulo = Column(String(255))
    mensagem = Column(Text)
    lida = Column(Boolean, default=False)
    
    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_leitura = Column(DateTime)
    
    def to_dict(self):
        return {
            "id": self.id,
            "lead_id": self.lead_id,
            "tipo": self.tipo,
            "titulo": self.titulo,
            "mensagem": self.mensagem,
            "lida": self.lida,
            "data_criacao": self.data_criacao.isoformat() if getattr(self, 'data_criacao', None) else None,
            "data_leitura": self.data_leitura.isoformat() if getattr(self, 'data_leitura', None) else None,
        }
