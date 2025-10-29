import { NextRequest, NextResponse } from 'next/server';
import { getPool, executeQuery } from '../../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    // Log para debug
    console.log('DATABASE_URL disponível:', !!process.env.DATABASE_URL);
    
    // Teste de conexão simples primeiro
    const testQuery = 'SELECT 1 as test';
    await executeQuery(testQuery);
    console.log('Conexão com banco estabelecida');

    // Total de leads
    const totalLeadsQuery = 'SELECT COUNT(*) as total FROM leads';
    const totalLeadsResult = await executeQuery(totalLeadsQuery);
    const totalLeads = parseInt(totalLeadsResult.rows[0].total);

    // Leads por status
    const statusQuery = `
      SELECT status, COUNT(*) as count 
      FROM leads 
      GROUP BY status
    `;
    const statusResult = await executeQuery(statusQuery);
    const leadsByStatus = statusResult.rows;

    // Valor total das vendas
    const totalValueQuery = `
      SELECT SUM(valor_venda_com_iva) as total_value
      FROM leads 
      WHERE status = 'Ganho'
    `;
    const totalValueResult = await executeQuery(totalValueQuery);
    const totalValue = parseFloat(totalValueResult.rows[0].total_value) || 0;

    // Taxa de conversão
    const conversionQuery = `
      SELECT 
        COUNT(CASE WHEN status = 'Ganho' THEN 1 END) as vendidos,
        COUNT(*) as total
      FROM leads
    `;
    const conversionResult = await executeQuery(conversionQuery);
    const { vendidos, total } = conversionResult.rows[0];
    const conversionRate = total > 0 ? (vendidos / total) * 100 : 0;

    // Leads criados nos últimos 30 dias
    const recentLeadsQuery = `
      SELECT DATE(data_entrada) as date, COUNT(*) as count
      FROM leads 
      WHERE data_entrada >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(data_entrada)
      ORDER BY date DESC
    `;
    const recentLeadsResult = await executeQuery(recentLeadsQuery);

    return NextResponse.json({
      totalLeads,
      leadsByStatus,
      totalValue,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      recentLeads: recentLeadsResult.rows
    });

  } catch (error) {
    console.error('Erro ao buscar analytics:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}