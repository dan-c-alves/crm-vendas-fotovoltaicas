"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Falha no registo')
      toast.success('Conta criada com sucesso')
      router.replace('/settings')
    } catch (err: any) {
      toast.error(err.message || 'Erro no registo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={onSubmit} className="bg-white shadow rounded p-6 w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4">Criar conta</h1>
        <p className="text-sm text-gray-600 mb-4">Registo simples apenas com Nome e Email. Depois poderá definir a sua senha.</p>
        <label className="block text-sm font-medium">Nome</label>
        <input className="w-full border rounded px-3 py-2 mb-3" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <label className="block text-sm font-medium">Email</label>
        <input className="w-full border rounded px-3 py-2 mb-4" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'A criar...' : 'Criar conta'}
        </button>
        <div className="text-sm mt-4 text-center">
          <a href="/login" className="text-blue-600 hover:underline">Já tenho conta</a>
        </div>
      </form>
    </div>
  )
}
