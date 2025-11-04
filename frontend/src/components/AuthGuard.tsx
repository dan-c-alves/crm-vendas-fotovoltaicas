"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      router.replace('/')
      return
    }
    
    // Opcional: validar token com o backend
    // Por enquanto, apenas verificar se existe
    setIsAuthenticated(true)
    
    // Sincronizar com cookie para o middleware
    document.cookie = `auth_token=${token}; path=/; max-age=2592000` // 30 dias
  }, [router])

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #1e293b 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>
          Verificando autenticação...
        </div>
      </div>
    )
  }

  return <>{children}</>
}
