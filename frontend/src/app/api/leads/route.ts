import { NextRequest, NextResponse } from 'next/server';
import { supabaseRequest } from '@/lib/supabase-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const VALID_STATUSES = [
  'Entrada de Lead',
  'Em Análise',
  'Proposta Enviada',
  'Em Negociação',
  'Vendido',
  'Perdido',
  'Cancelado'
];

function normalizeString(v: any) {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function normalizeNumber(v: any) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API leads GET chamada');

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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10'));

    const query = `leads?select=*&limit=${limit}&offset=${(page - 1) * limit}&order=data_entrada.desc`;

    console.log('📤 Fazendo request para Supabase...');
    const dataResponse = await supabaseRequest(query);

    if (!dataResponse.ok) {
      const errText = await dataResponse.text().catch(() => '');
      console.error('❌ Erro Supabase GET:', dataResponse.status, errText);
      return NextResponse.json({
        data: [],
        total: 0,
        page,
        totalPages: 0,
        error: errText || `Supabase responded ${dataResponse.status}`
      }, { status: dataResponse.status });
    }

    const dataResult = await dataResponse.json();

    if (!Array.isArray(dataResult)) {
      console.log('❌ dataResult não é array:', typeof dataResult);
      return NextResponse.json({
        data: [],
        total: 0,
        page,
        totalPages: 0
      }, { status: 200 });
    }

    const total = dataResult.length;

    return NextResponse.json({
      data: dataResult.map((lead: any) => ({
        id: lead.id,
        nome: lead.nome_lead ?? '',
        email: lead.email ?? '',
        telefone: lead.telefone ?? '',
        endereco: lead.morada ?? '',
        status: lead.status ?? '',
        valor_estimado: lead.valor_venda_com_iva ?? null,
        created_at: lead.data_entrada ?? null,
        updated_at: lead.data_atualizacao ?? null
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('❌ Erro ao buscar leads:', error);
    return NextResponse.json({
      data: [],
      total: 0,
      page: 1,
      totalPages: 0,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📥 API leads POST chamada');

    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({});
    }

    const body = await request.json();
    console.log('📥 Dados brutos recebidos para criação:', body);

    // Normalização
    const nome_lead = normalizeString(body.nome_lead ?? body.nome ?? '');
    const email = normalizeString(body.email ?? '');
    const telefone = normalizeString(body.telefone ?? '');
    const morada = normalizeString(body.morada ?? body.endereco ?? '');
    let status = normalizeString(body.status ?? 'Entrada de Lead');

    // Numeric fields (optional)
    const valor_venda_com_iva = normalizeNumber(body.valor_venda_com_iva ?? body.valor_estimado ?? body.valor);
    const valor_proposta = normalizeNumber(body.valor_proposta);
    const taxa_iva = normalizeNumber(body.taxa_iva);
    const comissao_percentagem = normalizeNumber(body.comissao_percentagem);

    // Validar campos obrigatórios
    if (!nome_lead || !email || !telefone) {
      console.log('❌ Validação falhou:', { nome_lead, email, telefone });
      return NextResponse.json(
        { error: 'Nome, email e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar status contra enum do DB — se inválido, forçar para padrão
    if (!VALID_STATUSES.includes(status)) {
      console.warn('⚠️ Status inválido recebido, substituindo por padrão:', status);
      status = 'Entrada de Lead';
    }

    const leadData: any = {
      nome_lead,
      email,
      telefone,
      morada,
      status
    };

    // Incluir campos numéricos apenas se não nulos (evita erro de cast no PostgREST)
    if (valor_venda_com_iva !== null) leadData.valor_venda_com_iva = valor_venda_com_iva;
    if (valor_proposta !== null) leadData.valor_proposta = valor_proposta;
    if (taxa_iva !== null) leadData.taxa_iva = taxa_iva;
    if (comissao_percentagem !== null) leadData.comissao_percentagem = comissao_percentagem;

    console.log('📤 Enviando para Supabase (payload normalizado):', leadData);

    const response = await supabaseRequest('leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
      headers: {
        'Prefer': 'return=representation',
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Resposta Supabase status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('❌ Erro Supabase POST:', response.status, errorText);
      // Se Supabase retorna 400 mantém 400; caso contrário propaga o status recebido
      const status = response.status >= 400 && response.status < 600 ? response.status : 500;
      return NextResponse.json(
        {
          error: 'Erro ao criar lead no banco de dados',
          details: errorText || `Supabase responded ${response.status}`
        },
        { status }
      );
    }

    const result = await response.json();
    console.log('✅ Lead criado com sucesso:', result);

    const createdLead = Array.isArray(result) ? result[0] : result;

    return NextResponse.json({
      id: createdLead.id,
      nome: createdLead.nome_lead ?? '',
      email: createdLead.email ?? '',
      telefone: createdLead.telefone ?? '',
      endereco: createdLead.morada ?? '',
      status: createdLead.status ?? '',
      valor_estimado: createdLead.valor_venda_com_iva ?? null,
      created_at: createdLead.data_entrada ?? null
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Erro detalhado ao criar lead:', {
      error,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}