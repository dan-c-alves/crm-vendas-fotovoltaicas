'use client';

import React, { useEffect, useState } from 'react';
import { Layout, MetricCard, FunnelChart, TrendChart } from '../components';
import { apiClient } from '../utils/api';
import { formatCurrency } from '../utils/format';
import { FiTrendingUp, FiUsers, FiDollarSign, FiAward } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

interface Stats {
  total_leads: number;
  total_vendas: number;
  valor_total_vendas: number;
  valor_total_sem_iva: number;
  comissao_total: number;
  taxa_conversao: number;
  valor_medio_venda: number;
  comissao_media: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [funil, setFunil] = useState<Record<string, number>>({});
  const [vendas, setVendas] = useState<Record<string, number>>({});
  const [comissoes, setComissoes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar dados do dashboard
        const response = await fetch('/api/leads/analytics/dashboard');
        if (!response.ok) {
          throw new Error('Erro ao carregar dados');
        }
        
        const data = await response.json();
        
        // Usar os dados corretos da API de analytics
        setStats({
          total_leads: data.totalLeads || 0,
          total_vendas: data.vendasFechadas || 0,
          valor_total_vendas: data.valorTotalComIva || 0,
          valor_total_sem_iva: data.valorTotalSemIva || 0,
          comissao_total: data.comissaoTotal || 0,
          taxa_conversao: data.taxaConversao || 0,
          valor_medio_venda: data.valorMedioVenda || 0,
          comissao_media: data.comissaoMedia || 0
        });
        
        // Configurar dados do funil
        setFunil(data.leadsPorStatus || {});
        
        // Remover dados fictícios - usar apenas dados reais
        setVendas({});
        setComissoes({});
        
        toast.success('Dados carregados com sucesso!');
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <Toaster position="top-right" />
      
      <div className="space-y-8">
        {/* Título */}
        <div>
          <h1 className="text-4xl font-bold text-dark-50 mb-2">Dashboard</h1>
          <p className="text-dark-400">Bem-vindo ao seu CRM de Vendas Fotovoltaicas</p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Leads"
            value={stats?.total_leads || 0}
            icon={<FiUsers />}
            color="primary"
            loading={loading}
          />
          <MetricCard
            title="Vendas Fechadas"
            value={stats?.total_vendas || 0}
            icon={<FiTrendingUp />}
            color="success"
            loading={loading}
          />
          <MetricCard
            title="Valor Total COM IVA (€)"
            value={formatCurrency(stats?.valor_total_vendas)}
            icon={<FiDollarSign />}
            color="info"
            loading={loading}
          />
          <MetricCard
            title="Valor Total sem IVA (€)"
            value={formatCurrency(stats?.valor_total_sem_iva)}
            icon={<FiDollarSign />}
            color="warning"
            loading={loading}
          />
        </div>

        {/* Métricas Secundárias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-dark-300 text-sm font-medium mb-2">Taxa de Conversão</h3>
            <p className="text-3xl font-bold text-primary-400">
              {Number(stats?.taxa_conversao || 0).toFixed(1)}%
            </p>
          </div>
          <div className="card">
            <h3 className="text-dark-300 text-sm font-medium mb-2">Comissão Total (€)</h3>
            <p className="text-3xl font-bold text-primary-400">
              {formatCurrency(stats?.comissao_total)}
            </p>
          </div>
          <div className="card">
            <h3 className="text-dark-300 text-sm font-medium mb-2">Comissão Média</h3>
            <p className="text-3xl font-bold text-primary-400">
              {formatCurrency(stats?.comissao_media)}
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FunnelChart data={funil} title="Funil de Vendas" />
          <TrendChart data={vendas} title="Vendas por Mês" dataKey="Vendas" color="#22c55e" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendChart data={comissoes} title="Comissões por Mês" dataKey="Comissões" color="#f59e0b" />
          
          {/* Informações Rápidas */}
          <div className="card">
            <h2 className="text-lg font-bold text-dark-50 mb-4">Informações Rápidas</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-glass-light">
                <span className="text-dark-400">Leads Ativos</span>
                <span className="font-bold text-primary-400">{stats?.total_leads || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-glass-light">
                <span className="text-dark-400">Taxa de Conversão</span>
                <span className="font-bold text-primary-400">{Number(stats?.taxa_conversao || 0).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark-400">Comissão Total</span>
                <span className="font-bold text-primary-400">{formatCurrency(stats?.comissao_total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

