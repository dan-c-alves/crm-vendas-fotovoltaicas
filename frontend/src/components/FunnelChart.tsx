'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FunnelChartProps {
  data: Record<string, number>;
  title?: string;
}

export default function FunnelChart({ data, title = 'Funil de Vendas' }: FunnelChartProps) {
  // Converter dados para formato do Recharts
  const chartData = Object.entries(data).map(([stage, count]) => ({
    stage: stage.substring(0, 15) + (stage.length > 15 ? '...' : ''),
    count,
    fullStage: stage,
  }));

  return (
    <div className="card h-full">
      <h2 className="text-lg font-bold text-dark-50 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="stage" stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#f3f4f6',
            }}
            formatter={(value) => [value, 'Leads']}
            labelFormatter={(label) => `Estágio: ${label}`}
          />
          <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

