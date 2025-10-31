// lib/supabase-config.ts - VERSÃO SIMPLIFICADA

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  console.log('🔧 Supabase Config:', {
    hasUrl: !!url,
    hasKey: !!anonKey
  });

  return { url, anonKey };
}

export async function supabaseRequest(endpoint: string, options: RequestInit = {}) {
  const config = getSupabaseConfig();
  
  console.log('🌐 Supabase Request:', endpoint);

  // Se não tem configuração, retorna dados vazios
  if (!config.url || !config.anonKey) {
    console.log('⚠️  No Supabase config - returning empty data');
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = `${config.url}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': config.anonKey,
    'Authorization': `Bearer ${config.anonKey}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  console.log('📤 Request URL:', url);

  try {
    const response = await fetch(url, { 
      ...options, 
      headers 
    });

    console.log('📡 Response:', response.status);
    return response;
  } catch (error) {
    console.error('💥 Request error:', error);
    return new Response(JSON.stringify({ error: 'Request failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}