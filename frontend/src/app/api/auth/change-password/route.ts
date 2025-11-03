import { NextResponse } from 'next/server'
import { getTokenFromCookie, verifyToken } from '../utils'
import { supabase } from '@/lib/supabase'
import { hashPassword } from '../utils'

export async function POST(req: Request) {
  try {
    const token = getTokenFromCookie()
    const payload = verifyToken(token || undefined)
    if (!payload) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const body = await req.json()
    const { newPassword } = body || {}
    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 400 })
    }

    const password_hash = hashPassword(newPassword)
    const { error } = await supabase
      .from('users')
      .update({ password_hash })
      .eq('id', payload.sub)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Erro ao trocar senha:', e)
    return NextResponse.json({ error: 'Falha ao trocar senha' }, { status: 500 })
  }
}
