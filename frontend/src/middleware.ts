import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Páginas protegidas: leads, tarefas, settings, dashboard
const protectedPrefixes = ['/leads', '/tarefas', '/settings']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const needsAuth = protectedPrefixes.some((p) => pathname.startsWith(p))

  if (!needsAuth) {
    return NextResponse.next()
  }

  const token = request.cookies.get('app_token')?.value
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/leads/:path*',
    '/tarefas/:path*',
    '/settings/:path*'
  ]
}
