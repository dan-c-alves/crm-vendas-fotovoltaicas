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

export async function GET(request: NextRequest) {
  try {
    console.log('API leads GET chamada');
    console.log('DATABASE_URL disponível:', !!process.env.DATABASE_URL);

    // Teste de conexão
    await getPool().query('SELECT 1');
    console.log('Conexão com banco OK');
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (nome_lead ILIKE $${paramCount} OR email ILIKE $${paramCount} OR telefone ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      params.push(status);
    }

    // Query para contar total
    const countQuery = `SELECT COUNT(*) FROM leads ${whereClause}`;
    const countResult = await getPool().query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Query para buscar leads
    params.push(limit, offset);
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
      FROM leads 
      ${whereClause}
      ORDER BY data_entrada DESC 
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    const result = await getPool().query(query, params);

    return NextResponse.json({
      data: result.rows,
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

    const query = `
      INSERT INTO leads (
        nome_lead, email, telefone, morada, origem, interesse, 
        notas_conversa, valor_venda_com_iva, status, data_entrada, data_atualizacao
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
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
      observacoes, valor_estimado, status
    ];

    const result = await getPool().query(query, values);

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error('Erro ao criar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}