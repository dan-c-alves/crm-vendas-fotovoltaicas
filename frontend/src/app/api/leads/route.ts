import { NextRequest, NextResponse } from 'next/server';

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
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    throw new Error(`Supabase error: ${response.statusText}`);
  }
  
  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    console.log('API leads GET chamada');

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
    const [countResult, dataResult] = await Promise.all([
      supabaseRequest(countQuery, { headers: { 'Prefer': 'count=exact' } }),
      supabaseRequest(query)
    ]);

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
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nome,
      email,
      telefone,
      endereco,
      fonte,
      interesse,
      observacoes,
      valor_estimado,
      status = 'Entrada de Lead'
    } = body;

    // Validações básicas
    if (!nome || !email || !telefone) {
      return NextResponse.json(
        { error: 'Nome, email e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Dados para Supabase
    const leadData = {
      nome_lead: nome,
      email,
      telefone,
      morada: endereco,
      origem: fonte,
      interesse,
      notas_conversa: observacoes,
      valor_venda_com_iva: valor_estimado,
      status,
      data_entrada: new Date().toISOString(),
      data_atualizacao: new Date().toISOString()
    };

    const result = await supabaseRequest('leads', {
      method: 'POST',
      body: JSON.stringify(leadData)
    });

    return NextResponse.json({
      id: result[0].id,
      nome: result[0].nome_lead,
      email: result[0].email,
      telefone: result[0].telefone,
      endereco: result[0].morada,
      status: result[0].status,
      created_at: result[0].data_entrada
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}