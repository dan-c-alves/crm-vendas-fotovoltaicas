import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('✅ API Test funcionando');
    
    return NextResponse.json({
      status: 'success',
      message: 'API funcionando!',
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL
      }
    });

  } catch (error) {
    console.error('❌ Erro no test:', error);
    return NextResponse.json({
      status: 'error',
      error: 'Erro no teste'
    }, { status: 500 });
  }
}