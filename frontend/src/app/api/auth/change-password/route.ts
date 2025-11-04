import { NextResponse } from 'next/server'

// Rota descontinuada: não há senha local com OAuth Google.
export async function POST() {
  return NextResponse.json({
    error: 'Rota descontinuada. Troca de senha não se aplica a OAuth Google.'
  }, { status: 410 })
}
