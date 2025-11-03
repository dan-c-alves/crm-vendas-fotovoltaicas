import { NextResponse } from 'next/server'
import { getUserByEmailOrUsername, setAuthCookie, signToken, verifyPassword } from '../utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { identifier, password } = body || {}

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Credenciais incompletas' }, { status: 400 })
    }

    const user = await getUserByEmailOrUsername(identifier)
    if (!user || !user.password_hash) {
      return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 })
    }

    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 })
    }

    const token = signToken({ id: user.id, email: user.email, nome: user.nome, username: user.username })
    setAuthCookie(token)

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, nome: user.nome, username: user.username }
    })
  } catch (e) {
    console.error('Erro no login:', e)
    return NextResponse.json({ error: 'Falha no login' }, { status: 500 })
  }
}
