'use client';

import React, { useEffect, useState } from 'react';
import { FiMenu, FiBell } from 'react-icons/fi';

interface HeaderProps {
  onMenuClick: () => void;
}

interface UserInfo {
  nome: string;
  email: string;
  foto?: string;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    // Tentar obter informações do usuário do token JWT
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        // Decodificar JWT (apenas a parte do payload)
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({
          nome: payload.nome || 'Usuário',
          email: payload.sub || '',
          foto: payload.foto || ''
        })
      } catch (error) {
        console.error('Erro ao decodificar token:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    // Limpar localStorage
    localStorage.removeItem('auth_token')
    // Limpar cookie
    document.cookie = "auth_token=; path=/; max-age=0"
    // Redirecionar para login
    window.location.href = "/"
  }

  return (
    <header className="glass border-b border-glass-light px-6 py-4 flex items-center justify-between">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 hover:bg-glass-light rounded-lg transition-colors"
      >
        <FiMenu size={24} />
      </button>

      <h1 className="hidden md:block text-2xl font-bold text-dark-50">
        CRM Vendas Fotovoltaicas
      </h1>

      <div className="flex items-center gap-4">
        {/* Informações do Usuário */}
        {user && (
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-glass-light rounded-lg">
            {user.foto ? (
              <img 
                src={user.foto} 
                alt={user.nome}
                className="w-8 h-8 rounded-full border-2 border-blue-400"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                {user.nome.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-dark-50">{user.nome}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>
          </div>
        )}

        {/* Botão Sair */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
          title="Sair do sistema"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:block text-sm font-medium">Sair</span>
        </button>
      </div>
    </header>
  );
}

