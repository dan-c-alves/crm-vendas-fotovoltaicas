import { NextResponse } from 'next/server'
import { createUser, getUserByEmailOrUsername, setAuthCookie, signToken } from '../utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nome, email, username, password } = body || {}

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    // Registro simples: nome + email (senha opcional)
    const existing = await getUserByEmailOrUsername(email)
    if (existing) {
      return NextResponse.json({ error: 'Já existe um utilizador com este email ou username' }, { status: 409 })
    }

    const user = await createUser({ email, nome, username, password })

    const token = signToken({ id: user.id, email: user.email, nome: user.nome, username: user.username })
    setAuthCookie(token)

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, nome: user.nome, username: user.username }
    })
  } catch (e: any) {
    console.error('Erro no registro:', e)
    return NextResponse.json({ error: 'Falha ao registar utilizador' }, { status: 500 })
  }
}
