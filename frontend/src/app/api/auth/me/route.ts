import { NextResponse } from 'next/server'

// Rota descontinuada: utilize o endpoint equivalente no backend se necessário.
export async function GET() {
  return NextResponse.json({
    error: 'Rota descontinuada. Consulte /api/auth/me no backend.'
  }, { status: 410 })
}
