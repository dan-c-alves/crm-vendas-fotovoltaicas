"""
Utilitários para cálculos de comissões e análises
"""
from datetime import datetime, timedelta
from typing import Dict, List
from config.settings import COMISSAO_PERCENTAGEM, IVA_TAXA


class ComissaoCalculator:
    """Calculadora de comissões"""
    
    @staticmethod
    def calcular_valor_sem_iva(valor_com_iva: float, taxa_iva: float = IVA_TAXA) -> float:
        """
        Calcular o valor sem IVA a partir do valor com IVA
        
        Args:
            valor_com_iva: Valor com IVA
            taxa_iva: Taxa de IVA (pode ser decimal 0.23 ou percentual 23.0)
        
        Returns:
            Valor sem IVA
        """
        if valor_com_iva <= 0:
            return 0.0
        
        # Converter taxa de percentual para decimal se necessário
        # Se taxa_iva > 1, assumir que é percentual e converter
        if taxa_iva > 1:
            taxa_decimal = taxa_iva / 100
        else:
            taxa_decimal = taxa_iva
            
        return valor_com_iva / (1 + taxa_decimal)
    
    @staticmethod
    def calcular_comissao(valor_sem_iva: float, percentagem: float = COMISSAO_PERCENTAGEM) -> float:
        """Calcular a comissão sobre o valor sem IVA"""
        if valor_sem_iva <= 0:
            return 0.0
        return valor_sem_iva * percentagem
    
    @staticmethod
    def calcular_comissao_total(valor_com_iva: float, taxa_iva: float = IVA_TAXA, 
                               percentagem: float = COMISSAO_PERCENTAGEM) -> float:
        """Calcular a comissão total em um passo"""
        valor_sem_iva = ComissaoCalculator.calcular_valor_sem_iva(valor_com_iva, taxa_iva)
        return ComissaoCalculator.calcular_comissao(valor_sem_iva, percentagem)
    
    @staticmethod
    def calcular_iva(valor_sem_iva: float, taxa_iva: float = IVA_TAXA) -> float:
        """Calcular o valor do IVA"""
        return valor_sem_iva * taxa_iva
    
    @staticmethod
    def calcular_valor_com_iva(valor_sem_iva: float, taxa_iva: float = IVA_TAXA) -> float:
        """Calcular o valor com IVA"""
        return valor_sem_iva * (1 + taxa_iva)


class AnalyticsCalculator:
    """Calculadora de análises e métricas"""
    
    @staticmethod
    def calcular_taxa_conversao(total_leads: int, total_vendas: int) -> float:
        """Calcular taxa de conversão em percentagem"""
        if total_leads == 0:
            return 0.0
        return (total_vendas / total_leads) * 100
    
    @staticmethod
    def calcular_valor_medio_venda(total_vendas_valor: float, total_vendas: int) -> float:
        """Calcular valor médio por venda"""
        if total_vendas == 0:
            return 0.0
        return total_vendas_valor / total_vendas
    
    @staticmethod
    def calcular_comissao_media(total_comissao: float, total_vendas: int) -> float:
        """Calcular comissão média por venda"""
        if total_vendas == 0:
            return 0.0
        return total_comissao / total_vendas
    
    @staticmethod
    def obter_distribuicao_por_status(leads_data: List[Dict]) -> Dict[str, int]:
        """Obter distribuição de leads por status"""
        distribuicao = {}
        for lead in leads_data:
            status = lead.get('status', 'Desconhecido')
            distribuicao[status] = distribuicao.get(status, 0) + 1
        return distribuicao
    
    @staticmethod
    def obter_vendas_por_mes(leads_data: List[Dict], meses: int = 12) -> Dict[str, float]:
        """Obter vendas (valor) por mês dos últimos N meses"""
        vendas_mes = {}
        data_atual = datetime.now()
        
        for i in range(meses):
            data = data_atual - timedelta(days=30*i)
            chave = data.strftime("%Y-%m")
            vendas_mes[chave] = 0.0
        
        for lead in leads_data:
            if lead.get('status') == 'Ganho' and lead.get('data_atualizacao'):
                data = lead['data_atualizacao']
                if isinstance(data, str):
                    data = datetime.fromisoformat(data)
                chave = data.strftime("%Y-%m")
                valor = lead.get('valor_venda_com_iva', 0)
                if chave in vendas_mes:
                    vendas_mes[chave] += valor
        
        return dict(sorted(vendas_mes.items(), reverse=True))
    
    @staticmethod
    def obter_comissoes_por_mes(leads_data: List[Dict], meses: int = 12) -> Dict[str, float]:
        """Obter comissões por mês dos últimos N meses"""
        comissoes_mes = {}
        data_atual = datetime.now()
        
        for i in range(meses):
            data = data_atual - timedelta(days=30*i)
            chave = data.strftime("%Y-%m")
            comissoes_mes[chave] = 0.0
        
        for lead in leads_data:
            if lead.get('status') == 'Ganho' and lead.get('data_atualizacao'):
                data = lead['data_atualizacao']
                if isinstance(data, str):
                    data = datetime.fromisoformat(data)
                chave = data.strftime("%Y-%m")
                comissao = lead.get('comissao_valor', 0)
                if chave in comissoes_mes:
                    comissoes_mes[chave] += comissao
        
        return dict(sorted(comissoes_mes.items(), reverse=True))
    
    @staticmethod
    def obter_funil_vendas(leads_data: List[Dict]) -> Dict[str, int]:
        """Obter dados do funil de vendas"""
        funil_stages = [
            "Entrada de Lead",
            "Contactados",
            "Levantamento Técnico", 
            "Em Orçamentação",
            "Proposta Entregue",
            "Negociação",
            "Hot Lead",
            "Ganho",
            "Perdidos",
            "Não Atende"
        ]
        
        funil = {}
        for stage in funil_stages:
            funil[stage] = len([l for l in leads_data if l.get('status') == stage])
        
        return funil
