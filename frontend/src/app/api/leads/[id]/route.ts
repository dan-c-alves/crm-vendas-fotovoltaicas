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
    console.log('📝 Atualizando lead ID:', leadId, 'Dados recebidos:', JSON.stringify(updates, null, 2));

    try {
      // Atualizar lead no Supabase
      const lead = await leadsAPI.update(leadId, updates);
      console.log('✅ Lead atualizado com sucesso:', lead);

      // Integração com Google Calendar (via backend) quando proxima_acao muda
      const backendUrl = process.env.NEXT_PUBLIC_API_URL;
      if (backendUrl) {
        const novaData: string | undefined = updates.proxima_acao;

        // Buscar estado atual para saber google_event_id
        const { data: afterLead, error: afterErr } = await (await import('@/lib/supabase')).supabase
          .from('leads')
          .select('*')
          .eq('id', leadId)
          .single();

        if (!afterErr && (novaData !== undefined)) {
          const eventId: string | null = (afterLead as any)?.google_event_id || null;
          const nome = (afterLead as any)?.nome_lead || 'Lead';
          const telefone = (afterLead as any)?.telefone || '';
          const status = (afterLead as any)?.status || '';
          const notas = (afterLead as any)?.notas_conversa || '';

          // Se foi definida uma nova data (não vazia)
          if (novaData) {
            const payload = {
              summary: `FOLLOW-UP: ${nome}${telefone ? ' (' + telefone + ')' : ''}`,
              description: `Status: ${status}. Notas: ${notas || 'N/A'}`,
              start_time: novaData,
              duration_minutes: 30,
              timezone: 'Europe/Lisbon'
            };

            try {
              if (eventId) {
                // Atualizar evento existente
                await fetch(`${backendUrl}/api/calendar/${encodeURIComponent(eventId)}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });
              } else {
                // Criar novo evento
                const resp = await fetch(`${backendUrl}/api/calendar/event`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });
                if (resp.ok) {
                  const json = await resp.json();
                  const newEventId = json?.event_id;
                  if (newEventId) {
                    await (await import('@/lib/supabase')).supabase
                      .from('leads')
                      .update({ google_event_id: newEventId })
                      .eq('id', leadId);
                  }
                }
              }
            } catch (e) {
              console.warn('⚠️ Falha ao criar/atualizar evento do Google (ignorado):', e);
            }
          } else {
            // Data removida -> apagar evento existente
            if (eventId) {
              try {
                await fetch(`${backendUrl}/api/calendar/${encodeURIComponent(eventId)}`, { method: 'DELETE' });
                await (await import('@/lib/supabase')).supabase
                  .from('leads')
                  .update({ google_event_id: null })
                  .eq('id', leadId);
              } catch (e) {
                console.warn('⚠️ Falha ao apagar evento do Google (ignorado):', e);
              }
            }
          }
        }
      }

      return NextResponse.json(lead);
    } catch (supabaseError: any) {
      console.error('❌ Erro do Supabase:', supabaseError);
      console.error('❌ Detalhes do erro:', {
        message: supabaseError.message,
        details: supabaseError.details,
        hint: supabaseError.hint,
        code: supabaseError.code
      });
      
      return NextResponse.json(
        { 
          error: 'Erro ao atualizar lead no banco de dados',
          details: supabaseError.message || 'Erro desconhecido'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Erro geral ao atualizar lead:', error);
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