import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que precisam de autenticação
const ROTAS_PROTEGIDAS = ['/leads', '/tarefas', '/settings']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verificar se a rota precisa de proteção
  const rotaProtegida = ROTAS_PROTEGIDAS.some(rota => pathname.startsWith(rota))
  
  if (rotaProtegida) {
    // Verificar se tem token no cookie auth_token
    const authToken = request.cookies.get('auth_token')
    
    // Se não tem token no cookie, verificar se tem no localStorage (será feito no client)
    // O middleware só verifica cookies, o client-side verificará localStorage
    if (!authToken || !authToken.value) {
      // Redirecionar para página de login
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Aqui poderíamos validar o JWT, mas por simplicidade vamos confiar
    // A validação real será feita nas chamadas à API
  }
  
  return NextResponse.next()
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: ['/leads/:path*', '/tarefas/:path*', '/settings/:path*']
}
