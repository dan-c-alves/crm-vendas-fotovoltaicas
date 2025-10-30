// lib/supabase-config.ts

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  // ✅ USA APENAS variáveis de ambiente - SEM hardcoded
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // ✅ Durante o build, retorna vazio
  if (typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('⚠️  Build environment detected - using empty config');
    return { url: '', anonKey: '' };
  }

  if (!url || !anonKey) {
    console.error('❌ Supabase credentials not configured');
    console.log('URL:', url ? '✅ Set' : '❌ Missing');
    console.log('Key:', anonKey ? '✅ Set' : '❌ Missing');
    return { url: '', anonKey: '' };
  }

  console.log('✅ Supabase config loaded successfully');
  return { url, anonKey };
}

export async function supabaseRequest(endpoint: string, options: RequestInit = {}) {
  const config = getSupabaseConfig();
  
  console.log('🔧 Supabase Request Config:', {
    hasUrl: !!config.url,
    hasKey: !!config.anonKey,
    endpoint
  });

  // Se não tem configuração válida, retorna dados vazios
  if (!config.url || !config.anonKey) {
    console.log('⚠️  No Supabase config - returning empty data');
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-Debug': 'no-supabase-config'
      }
    });
  }

  const url = `${config.url}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': config.anonKey,
    'Authorization': `Bearer ${config.anonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...options.headers,
  };

  console.log('🌐 Making request to:', url);

  try {
    const response = await fetch(url, { 
      ...options, 
      headers 
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      console.error('❌ Supabase request failed:', response.statusText);
      throw new Error(`Supabase request failed: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('💥 Supabase request error:', error);
    // Retorna resposta vazia em caso de erro
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-Debug': 'supabase-error'
      }
    });
  }
}