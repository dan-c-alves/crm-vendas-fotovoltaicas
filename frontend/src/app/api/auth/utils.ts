import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

export type SafeUser = {
  id: number
  email: string
  nome?: string | null
  username?: string | null
}

const TOKEN_COOKIE = 'app_token'
const DEFAULT_JWT_SECRET = process.env.APP_JWT_SECRET || process.env.NEXT_PRIVATE_JWT_SECRET || 'dev-secret'

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

export function verifyPassword(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash)
  } catch {
    return false
  }
}

export function signToken(user: SafeUser): string {
  return jwt.sign({ sub: user.id, email: user.email, username: user.username }, DEFAULT_JWT_SECRET, {
    expiresIn: '7d'
  })
}

export function setAuthCookie(token: string) {
  const c = cookies()
  c.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 dias
  })
}

export function clearAuthCookie() {
  const c = cookies()
  c.set(TOKEN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  })
}

export function getTokenFromCookie(): string | null {
  const c = cookies()
  const token = c.get(TOKEN_COOKIE)?.value
  return token || null
}

export function verifyToken(token?: string): null | { sub: number; email: string; username?: string } {
  if (!token) return null
  try {
    return jwt.verify(token, DEFAULT_JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function getUserByEmailOrUsername(identifier: string) {
  // Primeiro tenta por email, depois por username
  let { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', identifier)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    const res = await supabase
      .from('users')
      .select('*')
      .eq('username', identifier)
      .maybeSingle()
    data = res.data as any
    if (res.error) throw res.error
  }

  return data
}

export async function createUser({
  email,
  nome,
  username,
  password
}: { email: string; nome?: string; username?: string; password?: string }) {
  const finalUsername = username || (email.includes('@') ? email.split('@')[0] : email)
  const password_hash = password ? hashPassword(password) : null

  const { data, error } = await supabase
    .from('users')
    .insert({ email, nome: nome || null, username: finalUsername, password_hash })
    .select()
    .single()

  if (error) throw error
  return data
}
