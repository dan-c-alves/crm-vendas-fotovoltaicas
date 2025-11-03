import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = parseInt(params.id, 10);
    if (isNaN(leadId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    // Buscar lead atual (para obter google_event_id, se existir)
    const { data: lead, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (fetchError) {
      console.error('Erro ao buscar lead antes de concluir:', fetchError);
    }

    // Atualizar: marcar como concluído e remover a data
    const { data, error } = await supabase
      .from('leads')
      .update({ tarefa_concluida: true, proxima_acao: null })
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao concluir tarefa:', error);
      return NextResponse.json({ error: 'Erro ao concluir tarefa' }, { status: 500 });
    }

    // Se existir google_event_id, pedir ao backend para eliminar o evento
    const eventId = (lead as any)?.google_event_id;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (eventId && backendUrl) {
      try {
        await fetch(`${backendUrl}/api/calendar/${encodeURIComponent(eventId)}`, {
          method: 'DELETE'
        });
        // Limpar o campo google_event_id no Supabase
        await supabase
          .from('leads')
          .update({ google_event_id: null })
          .eq('id', leadId);
      } catch (e) {
        console.warn('Falha ao eliminar evento do Google Calendar (ignorado):', e);
      }
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (e) {
    console.error('Erro geral ao concluir tarefa:', e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
