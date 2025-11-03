"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const search = useSearchParams()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Falha no login')
      toast.success('Sessão iniciada')
      const from = search.get('from') || '/'
      router.replace(from)
    } catch (err: any) {
      toast.error(err.message || 'Erro no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={onSubmit} className="bg-white shadow rounded p-6 w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4">Entrar</h1>
        <p className="text-sm text-gray-600 mb-4">Use o seu email ou username e a sua senha.</p>
        <label className="block text-sm font-medium">Email ou Username</label>
        <input className="w-full border rounded px-3 py-2 mb-3" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
        <label className="block text-sm font-medium">Senha</label>
        <input className="w-full border rounded px-3 py-2 mb-4" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <div className="text-sm mt-4 text-center">
          <a href="/register" className="text-blue-600 hover:underline">Criar conta</a>
        </div>
      </form>
    </div>
  )
}
