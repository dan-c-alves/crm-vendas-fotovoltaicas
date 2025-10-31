'use client';

import { useState } from 'react';

export default function TestConnectionPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      // Testar criação de um lead
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome_lead: 'Teste Conexão',
          email: 'teste@email.com',
          telefone: '123456789',
          status: 'Entrada de Lead',
          valor_venda_com_iva: 1000,
        }),
      });

      const data = await response.json();
      setResult({ 
        status: response.status, 
        success: response.ok, 
        data 
      });
    } catch (error) {
      setResult({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads/analytics/dashboard');
      const data = await response.json();
      setResult({ 
        status: response.status, 
        success: response.ok, 
        data 
      });
    } catch (error) {
      setResult({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-dark-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">Teste de Conexão Supabase</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={testSupabaseConnection}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Testar Criação de Lead'}
        </button>

        <button
          onClick={testAnalytics}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium disabled:opacity-50 ml-4"
        >
          {loading ? 'Testando...' : 'Testar Analytics'}
        </button>
      </div>

      {result && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Resultado:</h2>
          <pre className="whitespace-pre-wrap text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}