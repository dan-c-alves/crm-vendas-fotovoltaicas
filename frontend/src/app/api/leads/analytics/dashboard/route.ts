import { NextRequest } from 'next/server';
import { supabaseRequest } from '@/lib/supabase-config'; // ✅ IMPORT CORRETA

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  // ✅ Bloqueia durante o build - SOLUÇÃO DEFINITIVA
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('🚫 BUILD BLOCKED - Returning empty analytics');
    return Response.json({
      totalLeads: 0,
      leadsPorDia: [],
      statusCount: {},
      vendedoresCount: {}
    });
  }

  try {
    console.log('📊 Analytics route - fetching data from Supabase');
    
    const response = await supabaseRequest('leads?select=*');
    
    if (!response.ok) {
      throw new Error('Failed to fetch leads');
    }

    const leads = await response.json();
    console.log(`📈 Found ${leads.length} leads for analytics`);

    // Se não há leads, retorna vazio
    if (!leads || leads.length === 0) {
      return Response.json({
        totalLeads: 0,
        leadsPorDia: [],
        statusCount: {},
        vendedoresCount: {}
      });
    }

    // Cálculos de analytics
    const totalLeads = leads.length;
    const leadsPorDia = leads.reduce((acc: any[], lead: any) => {
      const date = new Date(lead.created_at).toISOString().split('T')[0];
      const existing = acc.find(item => item.data === date);
      if (existing) {
        existing.quantidade++;
      } else {
        acc.push({ data: date, quantidade: 1 });
      }
      return acc;
    }, []).sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime());

    const statusCount = leads.reduce((acc: any, lead: any) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    const vendedoresCount = leads.reduce((acc: any, lead: any) => {
      if (lead.vendedor) {
        acc[lead.vendedor] = (acc[lead.vendedor] || 0) + 1;
      }
      return acc;
    }, {});

    console.log('✅ Analytics calculated successfully');
    return Response.json({
      totalLeads,
      leadsPorDia,
      statusCount,
      vendedoresCount
    });

  } catch (error) {
    console.error('💥 Erro ao buscar analytics:', error);
    return Response.json({
      totalLeads: 0,
      leadsPorDia: [],
      statusCount: {},
      vendedoresCount: {}
    }, { status: 200 });
  }
}