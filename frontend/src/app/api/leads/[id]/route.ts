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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = await supabaseRequest(`leads?id=eq.${id}&select=*`);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Lead não encontrado' },
        { status: 404 }
      );
    }

    const lead = result[0];
    
    // Mapear campos do banco para a estrutura esperada
    const mappedLead = {
      id: lead.id,
      nome: lead.nome_lead,
      email: lead.email,
      telefone: lead.telefone,
      endereco: lead.morada,
      status: lead.status,
      valor_estimado: lead.valor_venda_com_iva,
      valor_proposta: lead.valor_proposta,
      comissao_valor: lead.comissao_valor,
      observacoes: lead.notas_conversa,
      created_at: lead.data_entrada,
      updated_at: lead.data_atualizacao,
      proxima_acao: lead.proxima_acao,
      url_imagem_cliente: lead.url_imagem_cliente,
      origem: lead.origem,
      tags: lead.tags,
      ativo: lead.ativo
    };

    return NextResponse.json(mappedLead);

  } catch (error) {
    console.error('Erro ao buscar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
      status
    } = body;

    // Dados para atualizar no Supabase
    const updateData = {
      nome_lead: nome,
      email,
      telefone,
      morada: endereco,
      origem: fonte,
      interesse,
      notas_conversa: observacoes,
      valor_venda_com_iva: valor_estimado,
      status,
      data_atualizacao: new Date().toISOString()
    };

    const result = await supabaseRequest(`leads?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    });

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Lead não encontrado' },
        { status: 404 }
      );
    }

    const updatedLead = result[0];
    
    // Mapear resposta para estrutura esperada
    const mappedLead = {
      id: updatedLead.id,
      nome: updatedLead.nome_lead,
      email: updatedLead.email,
      telefone: updatedLead.telefone,
      endereco: updatedLead.morada,
      status: updatedLead.status,
      valor_estimado: updatedLead.valor_venda_com_iva,
      created_at: updatedLead.data_entrada,
      updated_at: updatedLead.data_atualizacao
    };

    return NextResponse.json(mappedLead);

  } catch (error) {
    console.error('Erro ao atualizar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = await supabaseRequest(`leads?id=eq.${id}`, {
      method: 'DELETE'
    });

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Lead não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Lead deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}