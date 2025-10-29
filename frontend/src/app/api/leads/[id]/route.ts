import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Pool inline para evitar problemas de importação
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : false,
      connectionTimeoutMillis: 60000,
      idleTimeoutMillis: 600000,
      max: 1,
      allowExitOnIdle: true
    });
  }
  return pool;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const query = `
      SELECT 
        id,
        nome_lead as nome,
        email,
        telefone,
        morada as endereco,
        status,
        valor_venda_com_iva as valor_estimado,
        valor_proposta,
        comissao_valor,
        notas_conversa as observacoes,
        data_entrada as created_at,
        data_atualizacao as updated_at,
        proxima_acao,
        url_imagem_cliente,
        origem,
        tags,
        ativo
      FROM leads WHERE id = $1
    `;
    const result = await getPool().query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Lead não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);

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

    const query = `
      UPDATE leads SET 
        nome_lead = $1, email = $2, telefone = $3, morada = $4,
        origem = $5, interesse = $6, notas_conversa = $7,
        valor_venda_com_iva = $8, status = $9, data_atualizacao = NOW()
      WHERE id = $10
      RETURNING 
        id,
        nome_lead as nome,
        email,
        telefone,
        morada as endereco,
        status,
        valor_venda_com_iva as valor_estimado,
        data_entrada as created_at,
        data_atualizacao as updated_at
    `;

    const values = [
      nome, email, telefone, endereco, fonte, interesse,
      observacoes, valor_estimado, status, id
    ];

    const result = await getPool().query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Lead não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);

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

    const query = 'DELETE FROM leads WHERE id = $1 RETURNING *';
    const result = await getPool().query(query, [id]);

    if (result.rows.length === 0) {
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