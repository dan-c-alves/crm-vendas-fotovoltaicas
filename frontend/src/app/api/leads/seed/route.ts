import { NextResponse } from 'next/server';
import { supabaseRequest } from '@/lib/supabase-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  return handleSeed();
}

export async function POST() {
  return handleSeed();
}

async function handleSeed() {
  try {
    console.log('🌱 Criando dados de teste...');
    
    const leadsTest = [
      {
        nome_lead: 'João Silva',
        email: 'joao.silva@email.com',
        telefone: '912345678',
        status: 'Ganho',
        valor_venda_com_iva: 15000,
        taxa_iva: 0.23,
        comissao_percentagem: 0.05,
        data_entrada: new Date().toISOString(),
        observacoes: 'Cliente muito interessado. Sistema de 10kW instalado com sucesso.'
      },
      {
        nome_lead: 'Maria Santos',
        email: 'maria.santos@email.com',
        telefone: '913456789',
        status: 'Em Negociação',
        valor_venda_com_iva: 12000,
        taxa_iva: 0.23,
        comissao_percentagem: 0.05,
        data_entrada: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        observacoes: 'Aguardando aprovação do financiamento.'
      },
      {
        nome_lead: 'Carlos Pereira',
        email: 'carlos.pereira@email.com',
        telefone: '914567890',
        status: 'Ganho',
        valor_venda_com_iva: 18500,
        taxa_iva: 0.23,
        comissao_percentagem: 0.05,
        data_entrada: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
        observacoes: 'Sistema premium instalado. Cliente muito satisfeito.'
      },
      {
        nome_lead: 'Ana Costa',
        email: 'ana.costa@email.com',
        telefone: '915678901',
        status: 'Perdido',
        valor_venda_com_iva: 8000,
        taxa_iva: 0.23,
        comissao_percentagem: 0.05,
        data_entrada: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
        observacoes: 'Cliente decidiu adiar o projeto por questões financeiras.'
      },
      {
        nome_lead: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        telefone: '916789012',
        status: 'Qualificado',
        valor_venda_com_iva: 14000,
        taxa_iva: 0.23,
        comissao_percentagem: 0.05,
        data_entrada: new Date(Date.now() - 345600000).toISOString(), // 4 dias atrás
        observacoes: 'Visita técnica agendada para a próxima semana.'
      },
      {
        nome_lead: 'Sofia Ribeiro',
        email: 'sofia.ribeiro@email.com',
        telefone: '917890123',
        status: 'Ganho',
        valor_venda_com_iva: 22000,
        taxa_iva: 0.23,
        comissao_percentagem: 0.05,
        data_entrada: new Date(Date.now() - 432000000).toISOString(), // 5 dias atrás
        observacoes: 'Grande instalação comercial. Excelente margem de lucro.'
      }
    ];

    console.log('📤 Inserindo leads de teste...');
    
    const response = await supabaseRequest('leads', {
      method: 'POST',
      body: JSON.stringify(leadsTest),
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao inserir leads:', response.status, errorText);
      throw new Error(`Erro ao inserir leads: ${errorText}`);
    }

    const insertedLeads = await response.json();
    console.log('✅ Leads inseridos com sucesso:', insertedLeads.length);

    return NextResponse.json({
      success: true,
      message: `${insertedLeads.length} leads de teste criados com sucesso!`,
      leads: insertedLeads
    });

  } catch (error) {
    console.error('💥 Erro ao criar dados de teste:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar dados de teste',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}