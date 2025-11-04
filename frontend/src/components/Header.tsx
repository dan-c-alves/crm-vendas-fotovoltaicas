'use client';

import React from 'react';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
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
        {/* Botão Sair */}
        <button 
          onClick={() => {
            document.cookie = "crm_auth=; path=/; max-age=0"
            window.location.href = "/"
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
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

