import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    console.log('📊 Analytics API chamada');
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start') || undefined;
    const end = searchParams.get('end') || undefined;
    const groupBy = (searchParams.get('groupBy') as any) || 'month';
    const statusParam = searchParams.get('status');
    const originParam = searchParams.get('origin');

    const statusFilter = statusParam ? statusParam.split(',').filter(Boolean) : undefined;
    const originFilter = originParam ? originParam.split(',').filter(Boolean) : undefined;

    const stats = await getDashboardStats({ start, end, groupBy, statusFilter, originFilter });
    
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
      ticketMedioSemIva: 0,
      leadsPorStatus: {},
      leadsPorOrigem: {},
      novosPorMes: {},
      vendasPorMes: {},
      comissoesPorMes: {},
      leadsComTarefas: 0,
      tarefasVencidas: 0,
      proximas7Dias: 0,
      valorPipeline: 0,
      comissaoPipeline: 0,
      conversaoPorOrigem: {},
      diasMediosVenda: 0,
      diasMediosPerda: 0
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
      ticketMedioSemIva: 0,
      leadsPorStatus: {},
      leadsPorOrigem: {},
      novosPorMes: {},
      vendasPorMes: {},
      comissoesPorMes: {},
      leadsComTarefas: 0,
      tarefasVencidas: 0,
      proximas7Dias: 0,
      valorPipeline: 0,
      comissaoPipeline: 0,
      conversaoPorOrigem: {},
      diasMediosVenda: 0,
      diasMediosPerda: 0
    });
  }
}