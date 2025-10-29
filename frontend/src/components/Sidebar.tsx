'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiTrendingUp, FiSettings, FiMenu, FiX, FiCheckSquare } from 'react-icons/fi';
import clsx from 'clsx';
import { useTaskUpdates } from '@/hooks/useTaskUpdates';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { taskStats } = useTaskUpdates();

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Leads', href: '/leads', icon: FiUsers },
    { 
      name: 'Tarefas', 
      href: '/tarefas', 
      icon: FiCheckSquare,
      badge: taskStats.total_tarefas > 0 ? taskStats.total_tarefas : null
    },
    { name: 'Vendas', href: '/vendas', icon: FiTrendingUp },
    { name: 'Configurações', href: '/settings', icon: FiSettings },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed md:relative w-64 h-screen glass-lg border-r border-glass-light transition-all duration-300 z-50',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-glass-light flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">☀️</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-dark-50">CRM Solar</h1>
              <p className="text-xs text-dark-400">Fotovoltaicas</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="md:hidden p-2 hover:bg-glass-light rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative',
                  isActive
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-dark-300 hover:bg-glass-light hover:text-dark-50'
                )}
              >
                <Icon size={20} />
                <span className="font-medium flex-1">{item.name}</span>
                {item.badge && (
                  <span className={clsx(
                    'px-2 py-1 text-xs rounded-full font-bold min-w-[20px] text-center',
                    isActive 
                      ? 'bg-primary-400 text-white' 
                      : 'bg-red-500 text-white'
                  )}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-glass-light">
          <div className="glass-sm p-4 text-center">
            <p className="text-xs text-dark-400 mb-2">Versão 1.0.0</p>
            <p className="text-xs text-primary-400 font-medium">Sistema Inovador</p>
          </div>
        </div>
      </aside>
    </>
  );
}

