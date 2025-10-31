import { NextRequest, NextResponse } from 'next/server';
import { leadsAPI } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // ✅ CONVERTER string para number
    const leadId = parseInt(id, 10);
    
    if (isNaN(leadId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const lead = await leadsAPI.getById(leadId);
    return NextResponse.json(lead);

  } catch (error) {
    console.error('Erro ao buscar lead:', error);
    return NextResponse.json(
      { error: 'Lead não encontrado' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // ✅ CONVERTER string para number
    const leadId = parseInt(id, 10);
    
    if (isNaN(leadId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const updates = await request.json();
    console.log('📝 Atualizando lead ID:', leadId, 'Dados:', updates);
    
    const lead = await leadsAPI.update(leadId, updates);
    return NextResponse.json(lead);

  } catch (error) {
    console.error('❌ Erro ao atualizar lead:', error);
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
    
    // ✅ CONVERTER string para number
    const leadId = parseInt(id, 10);
    
    if (isNaN(leadId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    await leadsAPI.delete(leadId);
    return NextResponse.json({ message: 'Lead deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}