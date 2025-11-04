import { NextResponse } from 'next/server'

// Rota descontinuada: sessão é gerida pelo backend OAuth/JWT.
export async function POST() {
  return NextResponse.json({
    error: 'Rota descontinuada. Use o logout via backend se aplicável.'
  }, { status: 410 })
}
