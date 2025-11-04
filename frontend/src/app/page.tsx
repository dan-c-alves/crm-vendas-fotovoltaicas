"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

const PIN_CORRETO = "1010"

export default function PinPage() {
  const [pin, setPin] = useState('')
  const router = useRouter()

  const verificarPin = () => {
    if (pin === PIN_CORRETO) {
      document.cookie = "crm_auth=ok; path=/; max-age=86400"
      toast.success('Acesso autorizado!')
      router.push('/leads')
    } else {
      toast.error('PIN incorreto!')
      setPin('')
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #1e293b 100%)'}}>
      <Toaster />
      <div style={{background:'rgba(255,255,255,0.1)',backdropFilter:'blur(20px)',borderRadius:'24px',padding:'32px',maxWidth:'400px',width:'100%',border:'1px solid rgba(255,255,255,0.2)'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{width:'80px',height:'80px',margin:'0 auto 16px',background:'linear-gradient(135deg, #60a5fa, #2563eb)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg style={{width:'40px',height:'40px',color:'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 style={{fontSize:'24px',fontWeight:'bold',color:'white',marginBottom:'8px'}}>CRM Fotovoltaico</h1>
          <p style={{color:'#93c5fd',fontSize:'14px'}}>Digite seu PIN de acesso</p>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:'12px',marginBottom:'32px'}}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{width:'56px',height:'56px',borderRadius:'12px',border:'2px solid '+(pin.length > i ? '#60a5fa' : 'rgba(255,255,255,0.2)'),background:pin.length > i ? '#3b82f6' : 'rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',fontWeight:'bold',color:'white',transform:pin.length > i ? 'scale(1.1)' : 'scale(1)',transition:'all 0.2s'}}>
              {pin.length > i ? '' : ''}
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'12px'}}>
          {['1','2','3','4','5','6','7','8','9'].map(n => (
            <button key={n} onClick={() => {if(pin.length < 4){const novo = pin + n; setPin(novo); if(novo.length === 4) setTimeout(verificarPin, 100)}}} style={{height:'64px',background:'rgba(255,255,255,0.1)',color:'white',fontSize:'20px',fontWeight:'600',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer'}} onMouseEnter={e => e.target.style.background='rgba(255,255,255,0.2)'} onMouseLeave={e => e.target.style.background='rgba(255,255,255,0.1)'}>{n}</button>
          ))}
          <button onClick={() => setPin('')} style={{height:'64px',background:'rgba(239,68,68,0.2)',color:'#fca5a5',fontSize:'14px',fontWeight:'600',borderRadius:'12px',border:'1px solid rgba(239,68,68,0.2)',cursor:'pointer'}}>Limpar</button>
          <button onClick={() => {if(pin.length < 4) setPin(pin + '0')}} style={{height:'64px',background:'rgba(255,255,255,0.1)',color:'white',fontSize:'20px',fontWeight:'600',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer'}}>0</button>
          <button onClick={verificarPin} style={{height:'64px',background:'linear-gradient(135deg, #3b82f6, #2563eb)',color:'white',fontSize:'14px',fontWeight:'600',borderRadius:'12px',border:'none',cursor:'pointer'}}>Entrar</button>
        </div>
        <p style={{textAlign:'center',fontSize:'12px',color:'rgba(255,255,255,0.4)',marginTop:'24px'}}>Sistema protegido  Acesso restrito</p>
      </div>
    </div>
  )
}
