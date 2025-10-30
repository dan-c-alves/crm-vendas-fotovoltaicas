// app/api/supabase-test/route.ts
import { NextResponse } from 'next/server'
import { supabase, leadsAPI, testConnection } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Testando nova configuração Supabase...')

    // Teste 1: Conexão básica
    const connectionTest = await testConnection()
    
    // Teste 2: Buscar estatísticas do dashboard
    const dashboardStats = await leadsAPI.getDashboardStats()
    
    // Teste 3: Buscar alguns leads
    const { data: leads, count } = await leadsAPI.getAll({ limit: 5 })

    return NextResponse.json({
      success: true,
      message: 'Supabase configurado e funcionando!',
      tests: {
        connection: connectionTest ? '✅ OK' : '❌ Falhou',
        dashboard: dashboardStats ? '✅ OK' : '❌ Falhou',
        leads: leads ? '✅ OK' : '❌ Falhou'
      },
      data: {
        totalLeads: count,
        leadsSample: leads?.slice(0, 3).map(lead => ({
          id: lead.id,
          nome: lead.nome_lead,
          status: lead.status
        })) || [],
        dashboardStats
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Erro no teste Supabase:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro ao testar Supabase',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}