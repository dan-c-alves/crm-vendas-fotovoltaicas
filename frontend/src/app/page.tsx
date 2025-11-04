"use client"
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Verificar se já está autenticado
    const token = localStorage.getItem('auth_token')
    if (token) {
      router.replace('/leads')
      return
    }

    // Verificar se voltou do Google com token
    const tokenFromUrl = searchParams?.get('token')
    const error = searchParams?.get('error')

    if (tokenFromUrl) {
      localStorage.setItem('auth_token', tokenFromUrl)
      toast.success('Login realizado com sucesso!')
      setTimeout(() => router.replace('/leads'), 1000)
    } else if (error === 'unauthorized') {
      toast.error('Acesso negado! Apenas danilocalves86@gmail.com pode acessar.')
    } else if (error === 'auth_failed') {
      toast.error('Erro na autenticação. Tente novamente.')
    }
  }, [searchParams, router])

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/google/login`)
      const data = await response.json()
      
      if (data.authorization_url) {
        // Redirecionar para o Google
        window.location.href = data.authorization_url
      }
    } catch (error) {
      console.error('Erro ao iniciar login:', error)
      toast.error('Erro ao conectar com o servidor')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #1e293b 100%)'
    }}>
      <Toaster position="top-center" />
      
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '48px 32px',
        maxWidth: '420px',
        width: '100%',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Logo e Título */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #60a5fa, #2563eb)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)'
          }}>
            <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px'
          }}>
            CRM Fotovoltaico
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '14px' }}>
            Sistema de Gestão de Vendas
          </p>
        </div>

        {/* Botão Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            height: '56px',
            background: 'white',
            color: '#1f2937',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '12px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            opacity: loading ? 0.7 : 1,
            marginBottom: '24px'
          }}
          onMouseEnter={e => {
            if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {loading ? (
            'Carregando...'
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
              </svg>
              Entrar com Google
            </>
          )}
        </button>

        {/* Checkbox Lembrar-me */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: 'white',
          fontSize: '14px',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              accentColor: '#3b82f6'
            }}
          />
          Manter-me conectado por 30 dias
        </label>

        {/* Rodapé */}
        <div style={{
          textAlign: 'center',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <p style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: '1.5'
          }}>
            🔒 Sistema protegido<br />
            Acesso restrito a usuários autorizados
          </p>
        </div>
      </div>
    </div>
  )
}
