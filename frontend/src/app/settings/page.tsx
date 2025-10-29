// frontend/src/app/settings/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components';
import toast, { Toaster } from 'react-hot-toast';
import { FiCalendar, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'; // NOVOS IMPORTS

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    comissao_percentagem: 5,
    iva_taxa: 23,
    email_notificacoes: true,
    notificacoes_follow_up: true,
    notificacoes_vendas: true,
    tema: 'dark',
    idioma: 'pt-PT',
  });
  const [authStatus, setAuthStatus] = useState<'pending' | 'success' | 'failure'>('pending');

  useEffect(() => {
    // Verificar o status de autenticação após o redirect do Google
    const params = new URLSearchParams(window.location.search);
    const status = params.get('auth');
    if (status === 'success') {
      setAuthStatus('success');
      toast.success('Google Calendar conectado com sucesso!');
    } else if (status === 'failure') {
      setAuthStatus('failure');
      toast.error('Falha na conexão com o Google Calendar.');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettings((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSave = () => {
    toast.success('Configurações guardadas com sucesso!');
  };

  const handleConnectGoogle = () => {
    // Redireciona para a rota de login do Backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    window.location.href = `${backendUrl}/api/auth/google/login`;
  };

  return (
    <Layout>
      <Toaster position="top-right" />
      
      <div className="space-y-6">
        {/* Título */}
        <div>
          <h1 className="text-4xl font-bold text-dark-50 mb-2">Configurações</h1>
          <p className="text-dark-400">Personalize o seu CRM</p>
        </div>

        {/* --- NOVO: INTEGRAÇÃO GOOGLE CALENDAR --- */}
        <div className="card">
          <h2 className="text-2xl font-bold text-dark-50 mb-6">Integração com Google Calendar</h2>
          
          <div className="space-y-4">
            <p className="text-dark-400">
              Conecte a sua conta Google para agendar automaticamente follow-ups no seu calendário pessoal.
            </p>
            
            {authStatus === 'success' ? (
                <div className="flex items-center gap-2 text-green-400 font-medium p-3 rounded-lg bg-green-900/20 border border-green-400/30">
                    <FiCheckCircle size={20} />
                    <span>Conectado! O seu CRM está a agendar eventos no seu calendário.</span>
                </div>
             ) : authStatus === 'failure' ? (
                <div className="flex items-center gap-2 text-red-400 font-medium p-3 rounded-lg bg-red-900/20 border border-red-400/30">
                    <FiAlertTriangle size={20} />
                    <span>Falha na conexão. Tente novamente ou verifique as permissões.</span>
                </div>
            ) : (
                <button onClick={handleConnectGoogle} className="btn btn-secondary flex items-center gap-2">
                    <FiCalendar size={20} />
                    Conectar Google Calendar
                </button>
            )}
          </div>
        </div>

        {/* Configurações Gerais */}
        <div className="card">
          <h2 className="text-2xl font-bold text-dark-50 mb-6">Configurações Gerais</h2>
          
          <div className="space-y-6">
            {/* Comissão */}
            <div>
              <label className="label">Percentagem de Comissão (%)</label>
              <input
                type="number"
                name="comissao_percentagem"
                value={settings.comissao_percentagem}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className="input"
              />
              <p className="text-dark-400 text-sm mt-2">
                Percentagem padrão para cálculo de comissões
              </p>
            </div>

            {/* IVA */}
            <div>
              <label className="label">Taxa de IVA (%)</label>
              <input
                type="number"
                name="iva_taxa"
                value={settings.iva_taxa}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className="input"
              />
              <p className="text-dark-400 text-sm mt-2">
                Taxa de IVA para cálculos
              </p>
            </div>

            {/* Idioma */}
            <div>
              <label className="label">Idioma</label>
              <select
                name="idioma"
                value={settings.idioma}
                onChange={handleChange}
                className="input"
              >
                <option value="pt-PT">Português (Portugal)</option>
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (USA)</option>
                <option value="es-ES">Español (España)</option>
              </select>
            </div>

            {/* Tema */}
            <div>
              <label className="label">Tema</label>
              <select
                name="tema"
                value={settings.tema}
                onChange={handleChange}
                className="input"
              >
                <option value="dark">Escuro (Padrão)</option>
                <option value="light">Claro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div className="card">
          <h2 className="text-2xl font-bold text-dark-50 mb-6">Notificações</h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="email_notificacoes"
                checked={settings.email_notificacoes}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-dark-700 border-dark-600"
              />
              <span className="text-dark-50">Ativar notificações por email</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="notificacoes_follow_up"
                checked={settings.notificacoes_follow_up}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-dark-700 border-dark-600"
              />
              <span className="text-dark-50">Notificações de Follow-up</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="notificacoes_vendas"
                checked={settings.notificacoes_vendas}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-dark-700 border-dark-600"
              />
              <span className="text-dark-50">Notificações de Vendas</span>
            </label>
          </div>
        </div>

        {/* Informações da Conta */}
        <div className="card">
          <h2 className="text-2xl font-bold text-dark-50 mb-6">Informações da Conta</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-dark-400 text-sm mb-1">Email</p>
              <p className="text-dark-50 font-medium">utilizador@email.com</p>
            </div>
            <div>
              <p className="text-dark-400 text-sm mb-1">Plano</p>
              <p className="text-dark-50 font-medium">Premium</p>
            </div>
            <div>
              <p className="text-dark-400 text-sm mb-1">Membro desde</p>
              <p className="text-dark-50 font-medium">Outubro 2025</p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <button onClick={handleSave} className="btn btn-primary">
            Guardar Configurações
          </button>
          <button className="btn btn-secondary">
            Cancelar
          </button>
        </div>

        {/* Zona de Perigo */}
        <div className="card border-red-500/30">
          <h2 className="text-2xl font-bold text-red-400 mb-6">Zona de Perigo</h2>
          
          <div className="space-y-4">
            <p className="text-dark-400">
              Estas ações são irreversíveis. Proceda com cuidado.
            </p>
            <div className="flex gap-4">
              <button className="btn bg-red-500/20 text-red-400 hover:bg-red-500/30">
                Exportar Dados
              </button>
              <button className="btn bg-red-500/20 text-red-400 hover:bg-red-500/30">
                Eliminar Conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
