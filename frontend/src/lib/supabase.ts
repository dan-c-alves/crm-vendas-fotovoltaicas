// lib/supabase.ts - CONFIGURAÇÃO COMPLETA COM LÓGICA CORRETA
import { createClient } from '@supabase/supabase-js'

// Configuração direta
const supabaseUrl = 'https://jzezbecvjquqxjnilvya.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6ZXpiZWN2anF1cXhqbmlsdnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NDg4MTIsImV4cCI6MjA3NzMyNDgxMn0.EqzSB-9uViwysuahjJhJKljI3jTk48ZDsAHsHAeK6dk'

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Interface para o tipo Lead - ATUALIZADA
export interface Lead {
  id: number
  nome_lead: string
  email: string
  telefone: string
  morada?: string
  status?: 'Entrada de Lead' | 'Em Análise' | 'Proposta Enviada' | 'Em Negociação' | 'Ganho' | 'Perdido' | 'Cancelado'
  origem?: 'Website' | 'Facebook' | 'Instagram' | 'Google Ads' | 'Indicação' | 'Telefone' | 'Email' | 'Evento' | 'Outros'
  interesse?: string
  observacoes?: string
  notas_conversa?: string
  valor_venda_com_iva?: number
  valor_proposta?: number
  taxa_iva?: number
  comissao_percentagem?: number
  comissao_valor?: number
  motivo_perda?: string
  proxima_acao?: string  // ✅ DATA da próxima ação (para Tarefas)
  data_proxima_acao?: string // ✅ DATA específica para próxima ação
  tags?: string
  url_imagem_cliente?: string
  data_entrada?: string
  data_atualizacao?: string
  created_at?: string
  updated_at?: string
}

// LISTA DE STATUS VÁLIDOS
export const STATUS_VALIDOS = [
  'Entrada de Lead',
  'Em Análise', 
  'Proposta Enviada',
  'Em Negociação',
  'Ganho',  // ✅ VENDIDO - calcula valores
  'Perdido',
  'Cancelado'
] as const;

// LISTA DE ORIGENS VÁLIDAS
export const ORIGENS_VALIDAS = [
  'Website',
  'Facebook', 
  'Instagram',
  'Google Ads',
  'Indicação',
  'Telefone',
  'Email',
  'Evento',
  'Outros'
] as const;

// FUNÇÃO PARA VALIDAR STATUS
export function validarStatus(status: string): boolean {
  return STATUS_VALIDOS.includes(status as any);
}

// FUNÇÃO PARA VALIDAR ORIGEM
export function validarOrigem(origem: string): boolean {
  return ORIGENS_VALIDAS.includes(origem as any);
}

// ✅ FUNÇÃO PARA CALCULAR VALORES APENAS PARA STATUS "GANHO"
export function calcularValoresParaGanho(valorComIva: number): { 
  valorSemIva: number; 
  comissaoValor: number;
  valorIva: number;
} {
  const valorComIvaNum = Number(valorComIva) || 0;
  const taxaIva = 0.23; // 23%
  const percentualComissao = 0.05; // 5%
  
  const valorSemIva = valorComIvaNum / (1 + taxaIva);
  const valorIva = valorComIvaNum - valorSemIva;
  const comissaoValor = valorSemIva * percentualComissao;
  
  return {
    valorSemIva: Math.round(valorSemIva * 100) / 100,
    comissaoValor: Math.round(comissaoValor * 100) / 100,
    valorIva: Math.round(valorIva * 100) / 100
  };
}

// ✅ FUNÇÃO PARA BUSCAR LEADS COM PRÓXIMA AÇÃO (TAREFAS)
export async function getLeadsComProximaAcao() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .not('proxima_acao', 'is', null)  // ✅ Tem próxima ação definida
    .order('data_proxima_acao', { ascending: true }); // ✅ Ordenar por data

  if (error) {
    console.error('Erro ao buscar leads com próxima ação:', error);
    throw error;
  }

  return data || [];
}

// ✅ FUNÇÃO PARA BUSCAR ESTATÍSTICAS DO DASHBOARD
export async function getDashboardStats() {
  // Buscar todos os leads
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*');

  if (error) {
    console.error('Erro ao buscar stats:', error);
    throw error;
  }

  if (!leads) return null;

  const totalLeads = leads.length;
  
  // ✅ APENAS LEADS COM STATUS "GANHO" contam para vendas
  const leadsGanhos = leads.filter(lead => lead.status === 'Ganho');
  const vendasFechadas = leadsGanhos.length;
  
  // ✅ CÁLCULOS APENAS PARA LEADS "GANHO"
  const valorTotalComIva = leadsGanhos.reduce((sum, lead) => sum + (lead.valor_venda_com_iva || 0), 0);
  const valorTotalSemIva = leadsGanhos.reduce((sum, lead) => {
    const valorComIva = lead.valor_venda_com_iva || 0;
    return sum + (valorComIva / 1.23);
  }, 0);
  const comissaoTotal = leadsGanhos.reduce((sum, lead) => sum + (lead.comissao_valor || 0), 0);
  
  // ✅ TAXA DE CONVERSÃO: Ganhos / Total Leads
  const taxaConversao = totalLeads > 0 ? (vendasFechadas / totalLeads) * 100 : 0;
  
  // ✅ VALOR MÉDIO E COMISSÃO MÉDIA APENAS PARA VENDAS
  const valorMedioVenda = vendasFechadas > 0 ? valorTotalComIva / vendasFechadas : 0;
  const comissaoMedia = vendasFechadas > 0 ? comissaoTotal / vendasFechadas : 0;

  // Contar por status
  const leadsPorStatus = leads.reduce((acc: Record<string, number>, lead) => {
    const status = lead.status || 'Sem Status';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // ✅ LEADS COM PRÓXIMA AÇÃO (TAREFAS)
  const leadsComTarefas = leads.filter(lead => lead.proxima_acao || lead.data_proxima_acao).length;

  return {
    totalLeads,
    vendasFechadas,
    valorTotalComIva: Math.round(valorTotalComIva * 100) / 100,
    valorTotalSemIva: Math.round(valorTotalSemIva * 100) / 100,
    comissaoTotal: Math.round(comissaoTotal * 100) / 100,
    taxaConversao: Math.round(taxaConversao * 10) / 10,
    valorMedioVenda: Math.round(valorMedioVenda * 100) / 100,
    comissaoMedia: Math.round(comissaoMedia * 100) / 100,
    leadsPorStatus,
    leadsComTarefas // ✅ Para a página de Tarefas
  };
}

// API simplificada usando o cliente Supabase diretamente
export const leadsAPI = {
  // Buscar todos os leads
  async getAll(filters?: { status?: string; search?: string; page?: number; limit?: number }) {
    let query = supabase
      .from('leads')
      .select('*')
      .order('data_entrada', { ascending: false })

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

  // Criar novo lead - VERSÃO CORRIGIDA
  async create(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'data_atualizacao'>) {
    // Dados básicos OBRIGATÓRIOS
    const leadData: any = {
      nome_lead: lead.nome_lead,
      email: lead.email,
      telefone: lead.telefone,
      morada: lead.morada || '',
      data_entrada: new Date().toISOString(),
      // Usar valores padrão do banco
      taxa_iva: 0.2300,
      comissao_percentagem: 0.0500,
      comissao_valor: 0
    };

    // ✅ STATUS - validar e usar valor correto
    if (lead.status && validarStatus(lead.status)) {
      leadData.status = lead.status;
    } else {
      leadData.status = 'Entrada de Lead';
    }

    // ✅ ORIGEM - validar e usar valor correto
    if (lead.origem && validarOrigem(lead.origem)) {
      leadData.origem = lead.origem;
    } else {
      leadData.origem = 'Website';
    }

    // Campos opcionais de texto
    if (lead.observacoes) leadData.observacoes = lead.observacoes;
    if (lead.interesse) leadData.interesse = lead.interesse;
    if (lead.notas_conversa) leadData.notas_conversa = lead.notas_conversa;
    if (lead.motivo_perda) leadData.motivo_perda = lead.motivo_perda;
    if (lead.proxima_acao) leadData.proxima_acao = lead.proxima_acao;
    if (lead.data_proxima_acao) leadData.data_proxima_acao = lead.data_proxima_acao; // ✅ DATA para Tarefas
    if (lead.tags) leadData.tags = lead.tags;

    // ✅ CAMPOS NUMÉRICOS - SÓ CALCULA SE FOR STATUS "GANHO"
    if (lead.valor_venda_com_iva !== undefined && lead.valor_venda_com_iva !== null) {
      const valor = Number(lead.valor_venda_com_iva);
      if (!isNaN(valor) && valor >= 0) {
        leadData.valor_venda_com_iva = valor;
        
        // ✅ SÓ CALCULA COMISSÃO SE O STATUS FOR "GANHO"
        if (leadData.status === 'Ganho') {
          const calculos = calcularValoresParaGanho(valor);
          leadData.comissao_valor = calculos.comissaoValor;
        }
      }
    }

    if (lead.valor_proposta !== undefined && lead.valor_proposta !== null) {
      const valor = Number(lead.valor_proposta);
      if (!isNaN(valor) && valor >= 0) {
        leadData.valor_proposta = valor;
      }
    }

    console.log('📤 Dados para criar lead:', leadData);

    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar lead:', error);
      throw error;
    }

    return data;
  },

  // Atualizar lead - VERSÃO CORRIGIDA
  async update(id: number, updates: Partial<Lead>) {
    const updateData: any = {};

    // Campos básicos
    if (updates.nome_lead !== undefined) updateData.nome_lead = updates.nome_lead;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.telefone !== undefined) updateData.telefone = updates.telefone;
    if (updates.morada !== undefined) updateData.morada = updates.morada;

    // ✅ STATUS - tratamento especial para ENUM
    if (updates.status !== undefined) {
      if (validarStatus(updates.status)) {
        updateData.status = updates.status;
      } else {
        console.warn('⚠️ Status inválido:', updates.status);
        updateData.status = 'Entrada de Lead';
      }
    }

    // ✅ ORIGEM - tratamento especial para ENUM
    if (updates.origem !== undefined) {
      if (validarOrigem(updates.origem)) {
        updateData.origem = updates.origem;
      } else {
        console.warn('⚠️ Origem inválida:', updates.origem);
        updateData.origem = 'Website';
      }
    }

    // Campos opcionais de texto
    if (updates.observacoes !== undefined) updateData.observacoes = updates.observacoes;
    if (updates.interesse !== undefined) updateData.interesse = updates.interesse;
    if (updates.notas_conversa !== undefined) updateData.notas_conversa = updates.notas_conversa;
    if (updates.motivo_perda !== undefined) updateData.motivo_perda = updates.motivo_perda;
    if (updates.proxima_acao !== undefined) updateData.proxima_acao = updates.proxima_acao;
    if (updates.data_proxima_acao !== undefined) updateData.data_proxima_acao = updates.data_proxima_acao; // ✅ DATA para Tarefas
    if (updates.tags !== undefined) updateData.tags = updates.tags;

    // ✅ CAMPOS NUMÉRICOS - SÓ RECALCULA SE MUDAR PARA "GANHO"
    if (updates.valor_venda_com_iva !== undefined) {
      const valor = Number(updates.valor_venda_com_iva);
      if (!isNaN(valor) && valor >= 0) {
        updateData.valor_venda_com_iva = valor;
        
        // ✅ SÓ RECALCULA COMISSÃO SE O STATUS FOR "GANHO"
        const statusAtual = updates.status || updateData.status;
        if (statusAtual === 'Ganho') {
          const calculos = calcularValoresParaGanho(valor);
          updateData.comissao_valor = calculos.comissaoValor;
        }
      }
    }

    if (updates.valor_proposta !== undefined) {
      const valor = Number(updates.valor_proposta);
      if (!isNaN(valor) && valor >= 0) {
        updateData.valor_proposta = valor;
      }
    }

    // SEMPRE usar valores fixos para evitar problemas
    updateData.taxa_iva = 0.2300;
    updateData.comissao_percentagem = 0.0500;

    updateData.data_atualizacao = new Date().toISOString();
    updateData.updated_at = new Date().toISOString();

    console.log('📤 Dados para atualizar lead:', updateData);

    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar lead:', error);
      throw error;
    }

    return data;
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

  // ✅ NOVA FUNÇÃO: Buscar leads para Tarefas
  async getLeadsComTarefas() {
    return await getLeadsComProximaAcao();
  },

  // ✅ NOVA FUNÇÃO: Buscar estatísticas do Dashboard
  async getDashboardStats() {
    return await getDashboardStats();
  }
}

// Teste de conexão
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('id')
      .limit(1)

    if (error) {
      console.error('❌ Erro na conexão:', error)
      return false
    }

    console.log('✅ Conexão com Supabase OK!')
    return true
  } catch (error) {
    console.error('❌ Falha na conexão:', error)
    return false
  }
}