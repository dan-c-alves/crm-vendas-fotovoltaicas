'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components';

interface Lead {
  id: number;
  nome_lead: string;
  email?: string;
  telefone?: string;
  status: string;
}

export default function LeadsPageSimple() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        console.log('🚀 Iniciando busca de leads...');
        const response = await fetch('http://localhost:8000/api/leads/?page=1&page_size=10');
        
        console.log('📡 Resposta recebida:', response.status);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 Dados recebidos:', data);
        
        setLeads(data.data || []);
        setError(null);
      } catch (err) {
        console.error('❌ Erro:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Leads - Teste Simples</h1>
        
        {loading && (
          <div className="text-white">🔄 Carregando...</div>
        )}
        
        {error && (
          <div className="text-red-400 p-4 bg-red-900/20 rounded">
            ❌ Erro: {error}
          </div>
        )}
        
        {!loading && !error && (
          <div>
            <p className="text-green-400 mb-4">✅ {leads.length} leads carregados</p>
            
            <div className="grid gap-4">
              {leads.map(lead => (
                <div key={lead.id} className="bg-gray-800 p-4 rounded">
                  <h3 className="text-white font-bold">{lead.nome_lead}</h3>
                  <p className="text-gray-300">Email: {lead.email || 'N/A'}</p>
                  <p className="text-gray-300">Telefone: {lead.telefone || 'N/A'}</p>
                  <p className="text-gray-300">Status: {lead.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}