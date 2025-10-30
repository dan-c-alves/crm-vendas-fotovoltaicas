export async function GET() {
  const debugInfo = {
    nextPhase: process.env.NEXT_PHASE,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    isBuild: process.env.NEXT_PHASE === 'phase-production-build',
    isProduction: process.env.NODE_ENV === 'production',
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    timestamp: new Date().toISOString()
  };

  return Response.json(debugInfo);
}