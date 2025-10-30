import { NextRequest, NextResponse } from 'next/server';
import { supabaseRequest } from '@/lib/supabase-config'; // ✅ IMPORT CORRETA

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    console.log('API leads GET chamada');

    // ✅ CORRETO: Bloqueia APENAS durante o build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🚫 BUILD - Retornando dados vazios');
      return NextResponse.json({
        data: [],
        total: 0,
        page: 1,
        totalPages: 0
      });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // Construir query para Supabase
    let query = 'leads?select=*';
    
    // Filtros
    const filters = [];
    if (search) {
      filters.push(`or=(nome_lead.ilike.*${search}*,email.ilike.*${search}*,telefone.ilike.*${search}*)`);
    }
    if (status) {
      filters.push(`status.eq.${status}`);
    }

    if (filters.length > 0) {
      query += `&${filters.join('&')}`;
    }

    // Paginação
    const offset = (page - 1) * limit;
    query += `&limit=${limit}&offset=${offset}&order=data_entrada.desc`;

    // Count total
    let countQuery = 'leads?select=count';
    if (filters.length > 0) {
      countQuery += `&${filters.join('&')}`;
    }

    // Fazer requisições
    const [countResponse, dataResponse] = await Promise.all([
      supabaseRequest(countQuery, { headers: { 'Prefer': 'count=exact' } }),
      supabaseRequest(query)
    ]);

    const countResult = await countResponse.json();
    const dataResult = await dataResponse.json();

    const total = countResult.length || 0;

    return NextResponse.json({
      data: dataResult.map((lead: any) => ({
        id: lead.id,
        nome: lead.nome_lead,
        email: lead.email,
        telefone: lead.telefone,
        endereco: lead.morada,
        status: lead.status,
        valor_estimado: lead.valor_venda_com_iva,
        created_at: lead.data_entrada,
        updated_at: lead.data_atualizacao
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    return NextResponse.json({
      data: [],
      total: 0,
      page: 1,
      totalPages: 0
    }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // ✅ CORRETO: Bloqueia APENAS durante o build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({});
    }

    const body = await request.json();
    console.log('📥 Dados recebidos no POST:', body);

    const {
      nome_lead,
      email,
      telefone, 
      morada,
      origem,
      interesse,
      notas_conversa,
      valor_venda_com_iva,
      valor_proposta,
      taxa_iva,
      comissao_percentagem,
      status = 'Entrada de Lead'
    } = body;

    // Validações básicas
    if (!nome_lead || !email || !telefone) {
      console.log('❌ Validação falhou:', { nome_lead, email, telefone });
      return NextResponse.json(
        { error: 'Nome, email e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Dados para Supabase
    const leadData = {
      nome_lead,
      email,
      telefone,
      morada,
      origem,
      interesse,
      notas_conversa,
      valor_venda_com_iva: valor_venda_com_iva ? Number(valor_venda_com_iva) : null,
      valor_proposta: valor_proposta ? Number(valor_proposta) : null,
      taxa_iva: taxa_iva ? Number(taxa_iva) : 0.23,
      comissao_percentagem: comissao_percentagem ? Number(comissao_percentagem) : 0.05,
      status,
      data_entrada: new Date().toISOString(),
      data_atualizacao: new Date().toISOString()
    };

    console.log('📤 Enviando para Supabase:', leadData);

    const response = await supabaseRequest('leads', {
      method: 'POST',
      body: JSON.stringify(leadData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro Supabase:', errorText);
      throw new Error(`Erro Supabase: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Resposta Supabase:', result);

    return NextResponse.json({
      id: result[0].id,
      nome_lead: result[0].nome_lead,
      email: result[0].email,
      telefone: result[0].telefone,
      morada: result[0].morada,
      status: result[0].status,
      data_entrada: result[0].data_entrada
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Erro ao criar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}