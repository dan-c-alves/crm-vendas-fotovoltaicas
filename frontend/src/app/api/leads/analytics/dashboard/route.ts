import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('📊 Analytics API chamada');

    const stats = await getDashboardStats();
    
    console.log('📊 Analytics calculadas:', stats);
    
    return NextResponse.json(stats || {
      totalLeads: 0,
      vendasFechadas: 0,
      valorTotalComIva: 0,
      valorTotalSemIva: 0,
      comissaoTotal: 0,
      taxaConversao: 0,
      valorMedioVenda: 0,
      comissaoMedia: 0,
      leadsPorStatus: {},
      leadsComTarefas: 0
    });

  } catch (error) {
    console.error('❌ Erro na API de analytics:', error);
    
    return NextResponse.json({
      totalLeads: 0,
      vendasFechadas: 0,
      valorTotalComIva: 0,
      valorTotalSemIva: 0,
      comissaoTotal: 0,
      taxaConversao: 0,
      valorMedioVenda: 0,
      comissaoMedia: 0,
      leadsPorStatus: {},
      leadsComTarefas: 0
    });
  }
}