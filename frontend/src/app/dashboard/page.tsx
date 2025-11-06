'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Layout, MetricCard, FunnelChart, TrendChart } from '../../components';
import { apiClient } from '../../utils/api';
import { formatCurrency } from '../../utils/format';
import { FiTrendingUp, FiUsers, FiDollarSign } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { STATUS_VALIDOS, ORIGENS_VALIDAS } from '../../lib/supabase';

interface Stats {
  totalLeads: number;
  vendasFechadas: number;
  valorTotalComIva: number;
  valorTotalSemIva: number;
  comissaoTotal: number;
  taxaConversao: number;
  valorMedioVenda: number;
  comissaoMedia: number;
  leadsPorStatus: Record<string, number>;
  vendasPorMes?: Record<string, number>;
  comissoesPorMes?: Record<string, number>;
  ticketMedioSemIva?: number;
  leadsPorOrigem?: Record<string, number>;
  novosPorMes?: Record<string, number>;
  tarefasVencidas?: number;
  proximas7Dias?: number;
  valorPipeline?: number;
  leadsComTarefas?: number;
}

type Preset = 'mes' | 't3m' | 'ano' | 'tudo' | 'custom';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [funil, setFunil] = useState<Record<string, number>>({});
  const [vendas, setVendas] = useState<Record<string, number>>({});
  const [comissoes, setComissoes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState<Preset>('mes');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [origemFilter, setOrigemFilter] = useState<string[]>([]);

  // Calcula datas padrão a partir do preset
  const range = useMemo(() => {
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = null;
    if (preset === 'mes') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (preset === 't3m') {
      start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (preset === 'ano') {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    } else if (preset === 'tudo') {
      start = null; end = null;
    } else if (preset === 'custom') {
      start = startDate ? new Date(startDate) : null;
      end = endDate ? new Date(endDate) : null;
    }
    return {
      start: start ? start.toISOString().slice(0, 10) : undefined,
      end: end ? end.toISOString().slice(0, 10) : undefined,
    };
  }, [preset, startDate, endDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const params: Record<string, string> = {};
        if (range.start) params.start = range.start;
        if (range.end) params.end = range.end;
        params.groupBy = 'month';

  const data = await apiClient.getDashboardStats({ ...params, status: statusFilter, origin: origemFilter });

        setStats(data);
        setFunil(data.leadsPorStatus || {});
        setVendas(data.vendasPorMes || {});
        setComissoes(data.comissoesPorMes || {});

        toast.success('Dados carregados com sucesso!');
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range.start, range.end, statusFilter, origemFilter]);

  return (
    <Layout>
      <Toaster position="top-right" />

      <div className="space-y-8">
        {/* Título */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-dark-50 mb-2">Dashboard</h1>
            <p className="text-dark-400">Bem-vindo ao seu CRM de Vendas Fotovoltaicas</p>
          </div>

          {/* Filtros */}
          <div className="glass rounded-lg p-3 border border-glass-light flex items-center gap-3 flex-wrap">
            <div className="flex gap-1">
              <button className={`btn btn-secondary ${preset==='mes' ? '!bg-primary-500/20 !text-primary-300' : ''}`} onClick={() => setPreset('mes')}>Este mês</button>
              <button className={`btn btn-secondary ${preset==='t3m' ? '!bg-primary-500/20 !text-primary-300' : ''}`} onClick={() => setPreset('t3m')}>Últimos 3 meses</button>
              <button className={`btn btn-secondary ${preset==='ano' ? '!bg-primary-500/20 !text-primary-300' : ''}`} onClick={() => setPreset('ano')}>Ano atual</button>
              <button className={`btn btn-secondary ${preset==='tudo' ? '!bg-primary-500/20 !text-primary-300' : ''}`} onClick={() => setPreset('tudo')}>Tudo</button>
            </div>
            <div className="h-6 w-px bg-glass-light mx-1"/>
            <div className="flex items-center gap-2">
              <input type="date" value={startDate} onChange={(e)=>{setPreset('custom'); setStartDate(e.target.value);}} className="input py-2"/>
              <span className="text-dark-400">até</span>
              <input type="date" value={endDate} onChange={(e)=>{setPreset('custom'); setEndDate(e.target.value);}} className="input py-2"/>
            </div>
            <div className="h-6 w-px bg-glass-light mx-1"/>
            {/* Filters: status */}
            <div className="flex items-center gap-2 flex-wrap">
              {STATUS_VALIDOS.map((s) => (
                <button
                  key={s}
                  className={`text-xs px-2 py-1 rounded border ${statusFilter.includes(s) ? 'bg-primary-500/20 border-primary-400 text-primary-300' : 'border-glass-light text-dark-300'}`}
                  onClick={() => setStatusFilter((prev) => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev, s])}
                >{s}</button>
              ))}
            </div>
            {/* Filters: origem */}
            <div className="flex items-center gap-2 flex-wrap">
              {ORIGENS_VALIDAS.map((o) => (
                <button
                  key={o}
                  className={`text-xs px-2 py-1 rounded border ${origemFilter.includes(o) ? 'bg-primary-500/20 border-primary-400 text-primary-300' : 'border-glass-light text-dark-300'}`}
                  onClick={() => setOrigemFilter((prev) => prev.includes(o) ? prev.filter(x=>x!==o) : [...prev, o])}
                >{o}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Leads"
            value={stats?.totalLeads ?? 0}
            icon={<FiUsers />}
            color="primary"
            loading={loading}
          />
          <MetricCard
            title="Vendas Fechadas"
            value={stats?.vendasFechadas ?? 0}
            icon={<FiTrendingUp />}
            color="success"
            loading={loading}
          />
          <MetricCard
            title="Valor Total COM IVA (€)"
            value={formatCurrency(stats?.valorTotalComIva)}
            icon={<FiDollarSign />}
            color="info"
            loading={loading}
          />
          <MetricCard
            title="Valor Total sem IVA (€)"
            value={formatCurrency(stats?.valorTotalSemIva)}
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
              {Number(stats?.taxaConversao || 0).toFixed(1)}%
            </p>
          </div>
          <div className="card">
            <h3 className="text-dark-300 text-sm font-medium mb-2">Comissão Total (€)</h3>
            <p className="text-3xl font-bold text-primary-400">
              {formatCurrency(stats?.comissaoTotal)}
            </p>
          </div>
          <div className="card">
            <h3 className="text-dark-300 text-sm font-medium mb-2">Comissão Média</h3>
            <p className="text-3xl font-bold text-primary-400">
              {formatCurrency(stats?.comissaoMedia)}
            </p>
          </div>
        </div>

        {/* Mais cards: cancelados, perdidos, ticket médio sem IVA, pipeline e tarefas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Leads Cancelados" value={stats ? (stats.leadsPorStatus?.['Cancelado'] || 0) : 0} color="danger" />
          <MetricCard title="Leads Perdidos" value={stats ? (stats.leadsPorStatus?.['Perdido'] || 0) : 0} color="danger" />
          <MetricCard title="Ticket Médio sem IVA" value={formatCurrency(stats?.ticketMedioSemIva)} color="info" />
          <MetricCard title="Pipeline Potencial (€)" value={formatCurrency(stats?.valorPipeline)} color="warning" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="Tarefas Vencidas" value={stats?.tarefasVencidas ?? 0} color="danger" />
          <MetricCard title="Próximas 7 dias" value={stats?.proximas7Dias ?? 0} color="success" />
          <MetricCard title="Leads com Tarefas" value={stats?.leadsComTarefas ?? 0} color="primary" />
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
                <span className="font-bold text-primary-400">{stats?.totalLeads || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-glass-light">
                <span className="text-dark-400">Taxa de Conversão</span>
                <span className="font-bold text-primary-400">{Number(stats?.taxaConversao || 0).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark-400">Comissão Total</span>
                <span className="font-bold text-primary-400">{formatCurrency(stats?.comissaoTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Origem e Novos Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FunnelChart data={stats?.leadsPorOrigem || {}} title="Leads por Origem" />
          <TrendChart data={stats?.novosPorMes || {}} title="Novos Leads por Mês" dataKey="Novos" color="#60a5fa" />
        </div>
      </div>
    </Layout>
  );
}
