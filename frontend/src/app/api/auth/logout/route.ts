import { NextResponse } from 'next/server'
import { clearAuthCookie } from '../utils'

export async function POST() {
  clearAuthCookie()
  return NextResponse.json({ ok: true })
}
