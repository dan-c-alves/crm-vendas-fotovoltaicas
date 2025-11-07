"use client"
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('railway.app')
    ? 'https://crm-vendas-fotovoltaicas-production.up.railway.app'
    : 'http://localhost:8000')

function LoginContent() {
  const [rememberMe, setRememberMe] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenFromUrl = searchParams?.get('token')
    const error = searchParams?.get('error')

    if (tokenFromUrl) {
      localStorage.setItem('auth_token', tokenFromUrl)
      document.cookie = `auth_token=${tokenFromUrl}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
      return
    }
    
    if (error === 'unauthorized') {
      toast.error('Acesso negado!')
      return
    }
    
    if (error === 'auth_failed') {
      toast.error('Erro na autenticação.')
      return
    }

    const existingToken = localStorage.getItem('auth_token')
    if (existingToken) {
      document.cookie = `auth_token=${existingToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
      router.push('/dashboard')
    }
  }, [searchParams, router])

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google/login`
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#1e293b 0%,#1e40af 50%,#1e293b 100%)'}}>
      <Toaster position="top-center"/>
      <div style={{background:'rgba(255,255,255,0.1)',backdropFilter:'blur(20px)',borderRadius:'24px',padding:'48px 32px',maxWidth:'420px',width:'100%',border:'1px solid rgba(255,255,255,0.2)',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <div style={{width:'80px',height:'80px',margin:'0 auto 24px',background:'linear-gradient(135deg,#60a5fa,#2563eb)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 10px 30px rgba(59,130,246,0.4)'}}>
            <svg style={{width:'40px',height:'40px',color:'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h1 style={{fontSize:'28px',fontWeight:'bold',color:'white',marginBottom:'8px'}}>CRM Fotovoltaico</h1>
          <p style={{color:'#93c5fd',fontSize:'14px'}}>Sistema de Gestão de Vendas</p>
        </div>
        <button onClick={handleGoogleLogin} style={{width:'100%',height:'56px',background:'white',color:'#1f2937',fontSize:'16px',fontWeight:'600',borderRadius:'12px',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'12px',transition:'all 0.2s',boxShadow:'0 4px 12px rgba(0,0,0,0.1)',marginBottom:'24px'}}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/><path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/><path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/><path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/></svg>
          Entrar com Google
        </button>
        <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',color:'white',fontSize:'14px',justifyContent:'center',marginBottom:'24px'}}><input type="checkbox" checked={rememberMe} onChange={(e)=>setRememberMe(e.target.checked)} style={{width:'18px',height:'18px',cursor:'pointer',accentColor:'#3b82f6'}}/>Manter-me conectado por 30 dias</label>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#1e293b 0%,#1e40af 50%,#1e293b 100%)',color:'white',fontSize:'18px'}}>Carregando...</div>}><LoginContent/></Suspense>
}
