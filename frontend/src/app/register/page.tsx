"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Falha no registo')
      toast.success('Conta criada com sucesso! Faça login.')
      router.replace('/login')
    } catch (err: any) {
      toast.error(err.message || 'Erro no registo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <form onSubmit={onSubmit} className="bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Criar Conta</h1>
          <p className="text-sm text-gray-600">Preencha os dados para começar</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
            <input 
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
              placeholder="Digite seu nome"
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input 
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
              type="email"
              placeholder="seu@email.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
            <input 
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required 
              minLength={6}
            />
          </div>
        </div>

        <button 
          disabled={loading} 
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </button>

        <div className="text-sm mt-6 text-center">
          <span className="text-gray-600">Já tem conta? </span>
          <a href="/login" className="text-blue-600 font-semibold hover:underline">Fazer login</a>
        </div>
      </form>
    </div>
  )
}
