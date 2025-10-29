'use client';

import React from 'react';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import clsx from 'clsx';
import { formatCurrency } from '../utils/format';

interface Lead {
  id: number;
  nome_lead: string;
  email?: string;
  telefone?: string;
  status: string;
  valor_venda_com_iva?: number;
  comissao_valor?: number;
  data_entrada?: string;
  [key: string]: any;
}

interface LeadsTableProps {
  leads: Lead[];
  loading?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number, nome: string) => void;
  onView?: (lead: Lead) => void;
}

const statusColors: Record<string, string> = {
  'Entrada de Lead': 'badge-secondary',
  'Contactados': 'badge-info',
  'Levantamento Técnico': 'badge-warning',
  'Em Orçamentação': 'badge-warning',
  'Proposta Entregue': 'badge-primary',
  'Negociação': 'badge-warning',
  'Hot Lead': 'badge-danger',
  'Ganho': 'badge-success',
  'Perdidos': 'badge-secondary',
  'Não Atende': 'badge-secondary',
};

export default function LeadsTable({
  leads,
  loading = false,
  onEdit,
  onDelete,
  onView,
}: LeadsTableProps) {
  if (loading) {
    return (
      <div className="card">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-dark-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-dark-400">Nenhum lead encontrado</p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th className="hidden md:table-cell">Email</th>
            <th className="hidden lg:table-cell">Telefone</th>
            <th>Status</th>
            <th className="hidden md:table-cell">Valor (€)</th>
            <th className="hidden lg:table-cell">Comissão (€)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-dark-800/50 transition-colors">
              <td className="font-medium">{lead.nome_lead}</td>
              <td className="hidden md:table-cell text-sm text-dark-400">{lead.email || '-'}</td>
              <td className="hidden lg:table-cell text-sm text-dark-400">{lead.telefone || '-'}</td>
              <td>
                <span className={clsx('badge', statusColors[lead.status] || 'badge-primary')}>
                  {lead.status}
                </span>
              </td>
              <td className="hidden md:table-cell font-medium">
                {formatCurrency(lead.valor_venda_com_iva)}
              </td>
              <td className="hidden lg:table-cell font-medium text-primary-400">
                {formatCurrency(lead.comissao_valor)}
              </td>
              <td>
                <div className="flex items-center gap-2">
                  {onView && (
                    <button
                      onClick={() => onView(lead)}
                      className="p-2 hover:bg-glass-light rounded transition-colors"
                      title="Ver detalhes"
                    >
                      <FiEye size={16} />
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(lead.id)}
                      className="p-2 hover:bg-glass-light rounded transition-colors text-blue-400"
                      title="Editar"
                    >
                      <FiEdit size={16} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(lead.id, lead.nome_lead)}
                      className="p-2 hover:bg-glass-light rounded transition-colors text-red-400"
                      title="Eliminar"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

