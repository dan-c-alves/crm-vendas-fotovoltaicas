'use client';

import { useState } from 'react';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const createTestData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads/seed', {
        method: 'POST',
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Erro:', error);
      setResult({ error: 'Erro ao criar dados de teste' });
    } finally {
      setLoading(false);
    }
  };

  const testAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads/analytics/dashboard');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Erro:', error);
      setResult({ error: 'Erro ao testar analytics' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste de APIs</h1>
      
      <div className="space-y-4">
        <button
          onClick={createTestData}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar Dados de Teste'}
        </button>

        <button
          onClick={testAnalytics}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 ml-4"
        >
          {loading ? 'Testando...' : 'Testar Analytics'}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}