import { NextResponse } from 'next/server'

// Rota descontinuada: autenticação migrou para OAuth Google no backend.
export async function POST() {
  return NextResponse.json({
    error: 'Rota descontinuada. Use o login com Google na página inicial.'
  }, { status: 410 })
}
