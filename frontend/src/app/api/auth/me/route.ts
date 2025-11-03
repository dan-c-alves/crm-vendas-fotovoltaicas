import { NextResponse } from 'next/server'
import { getTokenFromCookie, verifyToken } from '../utils'

export async function GET() {
  const token = getTokenFromCookie()
  const payload = verifyToken(token || undefined)
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
  return NextResponse.json({ authenticated: true, user: payload }, { status: 200 })
}
