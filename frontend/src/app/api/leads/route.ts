import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API leads GET chamada');

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limitParam = searchParams.get('limit') || searchParams.get('page_size') || '1000';
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    console.log('📊 Parâmetros:', { page, limit: limitParam, status, search });

    // Construir URL do backend FastAPI
    let backendUrl = `${BACKEND_URL}/api/leads?page=${page}&page_size=${limitParam}`;
    if (status && status !== 'Todos') {
      backendUrl += `&status=${encodeURIComponent(status)}`;
    }
    if (search) {
      backendUrl += `&search=${encodeURIComponent(search)}`;
    }

    console.log('📡 Chamando backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend retornou erro: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Leads encontrados:', data?.data?.length || 0, 'Total:', data?.total);

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Erro ao buscar leads:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📥 API leads POST chamada');

    const body = await request.json();
    console.log('📥 Dados recebidos para criação:', body);

    // Enviar diretamente para o backend FastAPI
    const backendUrl = `${BACKEND_URL}/api/leads`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      return NextResponse.json(
        { error: errorData.detail || errorData.error || 'Erro ao criar lead' },
        { status: response.status }
      );
    }

    const lead = await response.json();
    console.log('✅ Lead criado com sucesso:', lead);
    
    return NextResponse.json(lead, { status: 201 });
    
  } catch (error) {
    console.error('❌ Erro ao criar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: String(error) },
      { status: 500 }
    );
  }
}