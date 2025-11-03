import { NextRequest, NextResponse } from 'next/server';
import { leadsAPI } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API leads GET chamada');

    const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  // Suportar tanto "limit" quanto "page_size" por compatibilidade
  const limitParam = searchParams.get('limit') || searchParams.get('page_size') || '10';
  const limit = parseInt(limitParam);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    console.log('📊 Parâmetros:', { page, limit, status, search });

    const filters: any = { page, limit };
    if (status) filters.status = status;
    if (search) filters.search = search;

    const { data, count } = await leadsAPI.getAll(filters);

    console.log('✅ Leads encontrados:', data?.length || 0);

    return NextResponse.json({
      data,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    });

  } catch (error) {
    console.error('❌ Erro ao buscar leads:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📥 API leads POST chamada');

    const body = await request.json();
    console.log('📥 Dados recebidos para criação:', body);

    // Normalização
    const nome_lead = body.nome_lead ?? body.nome ?? '';
    const email = body.email ?? '';
    const telefone = body.telefone ?? '';
    const morada = body.morada ?? body.endereco ?? '';
    let status = body.status ?? 'Entrada de Lead';

    // Numeric fields (optional)
    const valor_venda_com_iva = body.valor_venda_com_iva ?? body.valor_estimado ?? body.valor;
    
    // Validar campos obrigatórios
    if (!nome_lead || !email || !telefone) {
      console.log('❌ Validação falhou:', { nome_lead, email, telefone });
      return NextResponse.json(
        { error: 'Nome, email e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    const leadData: any = {
      nome_lead,
      email,
      telefone,
      morada,
      status
    };

    // Incluir campos numéricos apenas se não nulos
    if (valor_venda_com_iva !== undefined && valor_venda_com_iva !== null) {
      const valor = Number(valor_venda_com_iva);
      if (!isNaN(valor) && valor >= 0) {
        leadData.valor_venda_com_iva = valor;
      }
    }

    // Campos opcionais
    if (body.origem) leadData.origem = body.origem;
    if (body.interesse) leadData.interesse = body.interesse;
    if (body.observacoes) leadData.observacoes = body.observacoes;
    if (body.notas_conversa) leadData.notas_conversa = body.notas_conversa;
    if (body.motivo_perda) leadData.motivo_perda = body.motivo_perda;
    if (body.proxima_acao) leadData.proxima_acao = body.proxima_acao;
    if (body.tags) leadData.tags = body.tags;
    if (body.url_imagem_cliente) leadData.url_imagem_cliente = body.url_imagem_cliente;

    console.log('📤 Enviando para Supabase:', leadData);

    const lead = await leadsAPI.create(leadData);
    
    console.log('✅ Lead criado com sucesso:', lead);
    return NextResponse.json(lead, { status: 201 });
    
  } catch (error) {
    console.error('❌ Erro ao criar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}