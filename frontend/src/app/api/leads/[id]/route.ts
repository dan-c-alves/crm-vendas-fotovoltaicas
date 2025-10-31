import { NextRequest, NextResponse } from 'next/server';
import { supabaseRequest } from '@/lib/supabase-config'; // ✅ IMPORT CORRETA

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // ✅ CORRETO: Bloqueia APENAS durante o build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({});
    }

    const response = await supabaseRequest(`leads?id=eq.${id}&select=*`);
    const result = await response.json();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Lead não encontrado' },
        { status: 404 }
      );
    }

    const lead = result[0];
    
    // Mapear campos do banco para a estrutura esperada pelo frontend
    const mappedLead = {
      id: lead.id,
      nome_lead: lead.nome_lead,  // ✅ CORRIGIDO: usar nome_lead
      nome: lead.nome_lead,       // ✅ Manter compatibilidade
      email: lead.email,
      telefone: lead.telefone,
      morada: lead.morada,        // ✅ CORRIGIDO: usar morada
      endereco: lead.morada,      // ✅ Manter compatibilidade
      status: lead.status,
      valor_venda_com_iva: lead.valor_venda_com_iva,  // ✅ CORRIGIDO
      valor_estimado: lead.valor_venda_com_iva,       // ✅ Manter compatibilidade
      valor_proposta: lead.valor_proposta,
      taxa_iva: lead.taxa_iva,    // ✅ ADICIONADO
      comissao_percentagem: lead.comissao_percentagem, // ✅ ADICIONADO
      comissao_valor: lead.comissao_valor,
      notas_conversa: lead.notas_conversa,  // ✅ CORRIGIDO
      observacoes: lead.notas_conversa,     // ✅ Manter compatibilidade
      motivo_perda: lead.motivo_perda,      // ✅ ADICIONADO
      created_at: lead.data_entrada,
      updated_at: lead.data_atualizacao,
      proxima_acao: lead.proxima_acao,
      url_imagem_cliente: lead.url_imagem_cliente,
      origem: lead.origem,
      tags: lead.tags,
      interesse: lead.interesse   // ✅ ADICIONADO
    };

    return NextResponse.json(mappedLead);

  } catch (error) {
    console.error('Erro ao buscar lead:', error);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ CORRETO: Bloqueia APENAS durante o build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({});
    }

    const { id } = params;
    const body = await request.json();
    
    console.log('📝 Dados recebidos para atualização:', body);

    // Extrair dados do body com nomes corretos
    const {
      nome_lead,
      nome,  // compatibilidade
      email,
      telefone,
      morada,
      endereco, // compatibilidade
      origem,
      fonte, // compatibilidade
      interesse,
      notas_conversa,
      observacoes, // compatibilidade
      valor_venda_com_iva,
      valor_estimado, // compatibilidade
      valor_proposta,
      taxa_iva,
      comissao_percentagem,
      motivo_perda,
      proxima_acao,
      tags,
      url_imagem_cliente,
      status
    } = body;

    // Dados para atualizar no Supabase (mapeamento correto)
    const updateData: any = {};

    // Campos obrigatórios
    if (nome_lead || nome) updateData.nome_lead = nome_lead || nome;
    if (email !== undefined) updateData.email = email;
    if (telefone !== undefined) updateData.telefone = telefone;
    if (morada !== undefined || endereco !== undefined) updateData.morada = morada || endereco;
    if (status) updateData.status = status;

    // Campos opcionais
    if (origem !== undefined || fonte !== undefined) updateData.origem = origem || fonte;
    if (interesse !== undefined) updateData.interesse = interesse;
    if (notas_conversa !== undefined || observacoes !== undefined) updateData.notas_conversa = notas_conversa || observacoes;
    if (motivo_perda !== undefined) updateData.motivo_perda = motivo_perda;
    if (proxima_acao !== undefined) updateData.proxima_acao = proxima_acao;
    if (tags !== undefined) updateData.tags = tags;
    if (url_imagem_cliente !== undefined) updateData.url_imagem_cliente = url_imagem_cliente;

    // Campos numéricos com conversão de percentual
    if (valor_venda_com_iva !== undefined || valor_estimado !== undefined) {
      const valor = Number(valor_venda_com_iva || valor_estimado);
      updateData.valor_venda_com_iva = Number.isFinite(valor) ? valor : null;
    }
    if (valor_proposta !== undefined) {
      const valor = Number(valor_proposta);
      updateData.valor_proposta = Number.isFinite(valor) ? valor : null;
    }
    if (taxa_iva !== undefined) {
      let taxa = Number(taxa_iva);
      if (Number.isFinite(taxa)) {
        if (taxa > 1) taxa = taxa / 100; // Converter percentual para decimal
        updateData.taxa_iva = taxa;
      }
    }
    if (comissao_percentagem !== undefined) {
      let comissao = Number(comissao_percentagem);
      if (Number.isFinite(comissao)) {
        if (comissao > 1) comissao = comissao / 100; // Converter percentual para decimal
        updateData.comissao_percentagem = comissao;
      }
    }

    // Timestamp de atualização
    updateData.updated_at = new Date().toISOString();
    updateData.data_atualizacao = new Date().toISOString();

    console.log('📤 Dados normalizados para Supabase:', updateData);

    const response = await supabaseRequest(`leads?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    });

    const result = await response.json();

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
    // ✅ CORRETO: Bloqueia APENAS durante o build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ message: 'Success' });
    }

    const { id } = params;

    const response = await supabaseRequest(`leads?id=eq.${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

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