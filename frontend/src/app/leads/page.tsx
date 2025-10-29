'use client';

import React, { useState, useEffect } from 'react';
import { Layout, LeadsTable } from '../../components';
import { apiClient } from '../../utils/api';
import { FiPlus, FiRefreshCw, FiSearch, FiFilter } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface Lead {
  id: number;
  nome_lead: string;
  email?: string;
  telefone?: string;
  morada?: string;
  status: string;
  valor_venda_com_iva?: number;
  origem?: string;
  data_contacto?: string;
  proxima_acao?: string;
  url_imagem_cliente?: string;
  created_at?: string;
  updated_at?: string;
  comissao_valor?: number;
  data_entrada?: string;
  [key: string]: any;
}

interface LeadsResponse {
  data: Lead[];
  total: number;
  page: number;
  totalPages: number;
}

const statusOptions = [
  'Todos',
  'Entrada de Lead', 
  'Contactados', 
  'Levantamento Técnico', 
  'Em Orçamentação', 
  'Proposta Entregue', 
  'Negociação', 
  'Hot Lead', 
  'Ganho', 
  'Perdidos', 
  'Não Atende'
];

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Carregar leads
  const fetchLeads = async (currentPage = 1, search = '', status = 'Todos') => {
    try {
      setLoading(true);
      
      // Construir URL com filtros - usar API Routes local
      let url = `/api/leads?page=${currentPage}&limit=20`;
      
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      
      if (status !== 'Todos') {
        url += `&status=${encodeURIComponent(status)}`;
      }

      console.log('Fazendo requisição para:', url); // Debug
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data: LeadsResponse = await response.json();
      console.log('Dados recebidos:', data); // Debug
      
      setLeads(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || 1);
      
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
      toast.error('Erro ao carregar leads. Verifique se o servidor está ativo.');
      setLeads([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar dados iniciais
  useEffect(() => {
    console.log('🚀 Componente montado, carregando leads...');
    fetchLeads();
  }, []);

  // Função para aplicar filtros
  const handleFilter = () => {
    fetchLeads(1, searchTerm, statusFilter);
  };

  // Função para refresh
  const handleRefresh = () => {
    fetchLeads(page, searchTerm, statusFilter);
    toast.success('Dados atualizados!');
  };

  // Função para trocar página
  const handlePageChange = (newPage: number) => {
    fetchLeads(newPage, searchTerm, statusFilter);
  };

  // Função para criar novo lead
  const handleNewLead = () => {
    router.push('/leads/0'); // ID 0 significa novo lead
  };

  // Função para editar lead
  const handleEditLead = (id: number) => {
    router.push(`/leads/${id}`);
  };

  // Função para eliminar lead
  const handleDeleteLead = async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja eliminar o lead "${nome}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao eliminar lead');
      }

      toast.success('Lead eliminado com sucesso!');
      fetchLeads(page, searchTerm, statusFilter); // Recarregar dados
      
    } catch (error) {
      console.error('Erro ao eliminar lead:', error);
      toast.error('Erro ao eliminar lead.');
    }
  };

  return (
    <Layout>
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-dark-50">Gestão de Leads</h1>
          <p className="text-dark-400 mt-1">
            {loading ? 'A carregar...' : `${total} leads encontrados`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="btn btn-secondary flex items-center gap-2"
            disabled={loading}
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
          
          <button
            onClick={handleNewLead}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus />
            Novo Lead
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="glass p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Pesquisa */}
          <div className="lg:col-span-2">
            <label className="label">🔍 Pesquisar</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nome, email, telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                className="input pl-10"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={18} />
            </div>
          </div>

          {/* Filtro por Status */}
          <div>
            <label className="label">📊 Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={handleFilter}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiFilter />
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-dark-400">A carregar leads...</p>
          </div>
        </div>
      ) : leads.length === 0 ? (
        <div className="glass p-8 rounded-lg text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-dark-50 mb-2">Nenhum lead encontrado</h3>
          <p className="text-dark-400 mb-4">
            {searchTerm || statusFilter !== 'Todos' 
              ? 'Tente ajustar os filtros de pesquisa.'
              : 'Comece criando o seu primeiro lead.'
            }
          </p>
          <p className="text-sm text-red-400 mb-4">
            Debug: Total={total}, Leads array length={leads.length}
          </p>
          {(!searchTerm && statusFilter === 'Todos') && (
            <button
              onClick={handleNewLead}
              className="btn btn-primary flex items-center gap-2 mx-auto"
            >
              <FiPlus />
              Criar Primeiro Lead
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Tabela de Leads */}
          <div className="glass rounded-lg overflow-hidden">
            <LeadsTable
              leads={leads}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
            />
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="btn btn-secondary disabled:opacity-50"
              >
                ← Anterior
              </button>
              
              <span className="text-dark-300">
                Página {page} de {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="btn btn-secondary disabled:opacity-50"
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
