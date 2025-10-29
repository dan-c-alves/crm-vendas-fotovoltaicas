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
        {/* Notificações */}
        <button className="relative p-2 hover:bg-glass-light rounded-lg transition-colors">
          <FiBell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* Perfil */}
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-glass-light rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <FiUser size={16} />
          </div>
          <span className="hidden sm:block text-sm font-medium">Utilizador</span>
        </button>
      </div>
    </header>
  );
}

