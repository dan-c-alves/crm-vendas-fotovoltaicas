// lib/supabase.ts - Cliente Supabase oficial
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jzezbecvjquqxjnilvya.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6ZXpiZWN2anF1cXhqbmlsdnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NDg4MTIsImV4cCI6MjA3NzMyNDgxMn0.EqzSB-9uViwysuahjJhJKljI3jTk48ZDsAHsHAeK6dk'

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Interface para o tipo Lead
export interface Lead {
  id?: number
  nome_lead: string
  email?: string
  telefone?: string
  morada?: string
  status?: string
  origem?: string
  interesse?: string
  observacoes?: string
  data_entrada?: string
  data_ultima_interacao?: string
  proxima_acao?: string
  valor_estimado_projeto?: number
  valor_venda_sem_iva?: number
  valor_venda_com_iva?: number
  taxa_iva?: number
  comissao_percentual?: number
  comissao_valor?: number
  descricao_sistema?: string
  potencia_sistema?: number
  tipo_instalacao?: string
  notas_conversa?: string
  ficheiros_anexos?: string
  data_agendamento?: string
  vendedor?: string
  created_at?: string
  updated_at?: string
  owner_id?: string
}

// Funções utilitárias para trabalhar com leads
export const leadsAPI = {
  // Buscar todos os leads
  async getAll(filters?: { status?: string; search?: string; page?: number; limit?: number }) {
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (filters?.status && filters.status !== 'Todos') {
      query = query.eq('status', filters.status)
    }

    if (filters?.search) {
      query = query.or(`nome_lead.ilike.%${filters.search}%,email.ilike.%${filters.search}%,telefone.ilike.%${filters.search}%`)
    }

    // Paginação
    if (filters?.page && filters?.limit) {
      const from = (filters.page - 1) * filters.limit
      const to = from + filters.limit - 1
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Erro ao buscar leads:', error)
      throw error
    }

    return { data: data || [], count: count || 0 }
  },

  // Buscar lead por ID
  async getById(id: number) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar lead:', error)
      throw error
    }

    return data
  },

  // Criar novo lead
  async create(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        ...lead,
        data_entrada: new Date().toISOString(),
        status: lead.status || 'Entrada de Lead'
      }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar lead:', error)
      throw error
    }

    return data
  },

  // Atualizar lead
  async update(id: number, updates: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar lead:', error)
      throw error
    }

    return data
  },

  // Deletar lead
  async delete(id: number) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar lead:', error)
      throw error
    }

    return true
  },

  // Buscar leads por status
  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar leads por status:', error)
      throw error
    }

    return data || []
  },

  // Analytics do dashboard
  async getDashboardStats() {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')

    if (error) {
      console.error('Erro ao buscar stats:', error)
      throw error
    }

    if (!leads) return null

    const totalLeads = leads.length
    const vendasFechadas = leads.filter(lead => lead.status === 'Ganho')
    const valorTotal = vendasFechadas.reduce((sum, lead) => sum + (lead.valor_venda_com_iva || 0), 0)
    const comissaoTotal = vendasFechadas.reduce((sum, lead) => sum + (lead.comissao_valor || 0), 0)

    // Contar por status
    const leadsByStatus = leads.reduce((acc: Record<string, number>, lead) => {
      acc[lead.status || 'Sem Status'] = (acc[lead.status || 'Sem Status'] || 0) + 1
      return acc
    }, {})

    return {
      totalLeads,
      totalVendas: vendasFechadas.length,
      valorTotalVendas: valorTotal,
      comissaoTotal,
      taxaConversao: totalLeads > 0 ? (vendasFechadas.length / totalLeads) * 100 : 0,
      leadsByStatus
    }
  }
}

// Função para testar conexão
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Erro na conexão:', error)
      return false
    }

    console.log('✅ Conexão com Supabase OK!')
    return true
  } catch (error) {
    console.error('❌ Falha na conexão:', error)
    return false
  }
}