import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Teste 1: Buscar leads existentes
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .limit(5);

    if (error) {
      return NextResponse.json({ 
        status: '❌ Erro ao buscar leads',
        error: error.message 
      });
    }

    // Teste 2: Tentar criar um lead simples
    const leadTeste = {
      nome_lead: 'Debug Test',
      email: 'debug@test.com',
      telefone: '123456789',
      valor_venda_com_iva: 1000
    };

    const { data: novoLead, error: insertError } = await supabase
      .from('leads')
      .insert([leadTeste])
      .select()
      .single();

    return NextResponse.json({
      status: '✅ Debug completo',
      leads_existentes: leads?.length || 0,
      novo_lead: novoLead || null,
      insert_error: insertError?.message || null
    });

  } catch (error) {
    return NextResponse.json({
      status: '❌ Erro no debug',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}