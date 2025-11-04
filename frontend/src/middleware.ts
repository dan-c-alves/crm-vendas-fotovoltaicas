import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que precisam de autenticação (PIN)
const ROTAS_PROTEGIDAS = ['/leads', '/tarefas', '/dashboard', '/settings']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verificar se a rota precisa de proteção
  const rotaProtegida = ROTAS_PROTEGIDAS.some(rota => pathname.startsWith(rota))
  
  if (rotaProtegida) {
    // Verificar se tem cookie de autenticação simples
    const authCookie = request.cookies.get('crm_auth')
    
    if (!authCookie || authCookie.value !== 'ok') {
      // Redirecionar para página inicial (tela de PIN)
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: ['/leads/:path*', '/tarefas/:path*', '/dashboard/:path*', '/settings/:path*']
}
