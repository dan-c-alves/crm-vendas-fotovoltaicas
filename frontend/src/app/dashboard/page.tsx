'use client';

import React from 'react';
import { Layout } from '../../components';
import { FiUsers, FiDollarSign, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

export default function DashboardPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-blue-100">Visão geral do seu CRM de vendas fotovoltaicas</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total de Leads */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">-</h3>
            <p className="text-sm text-gray-600">Leads Cadastrados</p>
          </div>

          {/* Vendas */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Mês</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">-</h3>
            <p className="text-sm text-gray-600">Vendas Realizadas</p>
          </div>

          {/* Valor Total */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">-</h3>
            <p className="text-sm text-gray-600">Valor em Vendas</p>
          </div>

          {/* Taxa de Conversão */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Geral</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">-</h3>
            <p className="text-sm text-gray-600">Taxa de Conversão</p>
          </div>
        </div>

        {/* Mensagem de Boas-Vindas */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bem-vindo ao CRM Fotovoltaico! 🌞
          </h2>
          <p className="text-gray-600 mb-6">
            Esta é sua página de dashboard. As estatísticas serão exibidas aqui quando você começar a adicionar leads.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/leads"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Leads
            </a>
            <a
              href="/tarefas"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ver Tarefas
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
