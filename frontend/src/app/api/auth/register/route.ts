import { NextResponse } from 'next/server'

// Rota descontinuada: registro local não é suportado (login via Google apenas).
export async function POST() {
  return NextResponse.json({
    error: 'Rota descontinuada. Registro local desativado (use OAuth Google).'
  }, { status: 410 })
}
