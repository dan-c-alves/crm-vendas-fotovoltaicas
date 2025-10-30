export async function GET() {
  return Response.json({ 
    status: 'OK',
    message: 'API is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL
  });
}