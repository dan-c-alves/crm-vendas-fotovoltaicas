import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Supabase REST API configuration
const SUPABASE_URL = 'https://jzezbecvjquqxjnilvya.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6ZXpiZWN2anF1cXhqbmlsdnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxNTE2MjcsImV4cCI6MjA0NTcyNzYyN30.M0LGSPNuOqBWXVBOxQHf5WfJQnOZaIgUf-KlCATYPwc';

async function supabaseRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    // Buscar todos os leads para fazer os cálculos
    const allLeads = await supabaseRequest('leads?select=*');

    // Total de leads
    const totalLeads = allLeads.length;

    // Leads por status
    const statusCounts: { [key: string]: number } = {};
    allLeads.forEach((lead: any) => {
      statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
    });
    
    const leadsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));

    // Valor total das vendas (apenas leads com status "Ganho")
    const totalValue = allLeads
      .filter((lead: any) => lead.status === 'Ganho')
      .reduce((sum: number, lead: any) => sum + (parseFloat(lead.valor_venda_com_iva) || 0), 0);

    // Taxa de conversão
    const vendidos = allLeads.filter((lead: any) => lead.status === 'Ganho').length;
    const conversionRate = totalLeads > 0 ? (vendidos / totalLeads) * 100 : 0;

    // Leads criados nos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentLeadsData: { [key: string]: number } = {};
    allLeads.forEach((lead: any) => {
      const leadDate = new Date(lead.data_entrada);
      if (leadDate >= thirtyDaysAgo) {
        const dateStr = leadDate.toISOString().split('T')[0];
        recentLeadsData[dateStr] = (recentLeadsData[dateStr] || 0) + 1;
      }
    });

    const recentLeads = Object.entries(recentLeadsData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      totalLeads,
      leadsByStatus,
      totalValue,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      recentLeads
    });

  } catch (error) {
    console.error('Erro ao buscar analytics:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}