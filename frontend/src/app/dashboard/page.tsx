"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

// ⚠️ ALTERE O PIN AQUI - Apenas você deve saber!
const PIN_CORRETO = "1010"

export default function PinPage() {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      })

      if (!response.ok) {
        throw new Error('PIN incorreto')
      }

      toast.success('Acesso autorizado!')
      router.replace('/dashboard')
    } catch (error) {
      toast.error('PIN incorreto!')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num
      setPin(newPin)
      
      // Auto-submit quando completar 4 dígitos
      if (newPin.length === 4) {
        setTimeout(() => {
          handleSubmit({ preventDefault: () => {} } as React.FormEvent)
        }, 100)
      }
    }
  }

  const handleClear = () => {
    setPin('')
  }

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

