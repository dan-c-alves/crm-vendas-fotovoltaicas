'use client';

import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { apiClient } from '../utils/api';
import toast from 'react-hot-toast';
import { emitLeadUpdate } from '../hooks/useTaskUpdates';

interface Lead {
  id?: number;
  nome_lead: string;
  email?: string;
  telefone?: string;
  morada?: string;
  status: string;
  valor_venda_com_iva?: number | null;
  taxa_iva?: number;
  valor_proposta?: number;
  comissao_percentagem?: number;
  comissao_valor?: number | null;
  notas_conversa?: string;
  origem?: string;
  proxima_acao?: string;
  data_entrada?: string;
}

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  lead?: Lead;
}

const statusOptions = [
  'Entrada de Lead',
  'Contactados',
  'Levantamento Técnico',
  'Em Orçamentação',
  'Proposta Entregue',
  'Negociação',
  'Hot Lead',
  'Ganho',
  'Perdidos',
  'Não Atende',
];

export default function LeadModal({ isOpen, onClose, onSave, lead }: LeadModalProps) {
  const [formData, setFormData] = useState<Lead>({
    nome_lead: '',
    email: '',
    telefone: '',
    morada: '',
    status: 'Entrada de Lead',
    valor_venda_com_iva: 0,
    taxa_iva: 0.23,
    valor_proposta: 0,
    comissao_percentagem: 0.05,
    notas_conversa: '',
    origem: '',
    proxima_acao: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        ...lead,
        valor_venda_com_iva: lead.valor_venda_com_iva || 0,
        taxa_iva: lead.taxa_iva || 0.23,
        valor_proposta: lead.valor_proposta || 0,
        comissao_percentagem: lead.comissao_percentagem || 0.05,
      });
    } else {
      setFormData({
        nome_lead: '',
        email: '',
        telefone: '',
        morada: '',
        status: 'Entrada de Lead',
        valor_venda_com_iva: 0,
        taxa_iva: 0.23,
        valor_proposta: 0,
        comissao_percentagem: 0.05,
        notas_conversa: '',
        origem: '',
        proxima_acao: '',
      });
    }
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparar dados garantindo tipos corretos
      const submitData = {
        ...formData,
        valor_venda_com_iva: formData.valor_venda_com_iva ? Number(formData.valor_venda_com_iva) : 0,
        taxa_iva: formData.taxa_iva ? Number(formData.taxa_iva) : 23,
        valor_proposta: formData.valor_proposta ? Number(formData.valor_proposta) : 0,
        comissao_percentagem: formData.comissao_percentagem ? Number(formData.comissao_percentagem) : 10,
      };

      console.log('📤 Enviando dados:', submitData);

      if (lead?.id) {
        await apiClient.updateLead(lead.id, submitData);
        toast.success('Lead atualizado com sucesso!');
        emitLeadUpdate('leadUpdated', lead.id);
      } else {
        const newLead = await apiClient.createLead(submitData);
        toast.success('Lead criado com sucesso!');
        emitLeadUpdate('leadCreated', newLead.id);
      }
      onSave();
      onClose();
    } catch (error: any) {
      console.error('❌ Erro completo ao salvar lead:', {
        error,
        message: error?.message,
        response: error?.response,
        responseData: error?.response?.data,
        status: error?.response?.status,
        config: error?.config
      });
      
      let errorMessage = 'Erro desconhecido';
      
      if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.code) {
        errorMessage = `Erro de rede: ${error.code}`;
      }
      
      toast.error(`Erro ao salvar lead: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark-50">
              {lead ? 'Editar Lead' : 'Novo Lead'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-glass-light rounded transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Nome do Lead *
                </label>
                <input
                  type="text"
                  name="nome_lead"
                  value={formData.nome_lead}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="input"
                  placeholder="+351 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Morada */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Morada
              </label>
              <input
                type="text"
                name="morada"
                value={formData.morada}
                onChange={handleChange}
                className="input"
                placeholder="Morada completa"
              />
            </div>

            {/* Informações Financeiras */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Valor Venda (com IVA) €
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="valor_venda_com_iva"
                  value={formData.valor_venda_com_iva || 0}
                  onChange={handleChange}
                  className="input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Taxa IVA
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="taxa_iva"
                  value={formData.taxa_iva}
                  onChange={handleChange}
                  className="input"
                  placeholder="0.23"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  % Comissão
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="comissao_percentagem"
                  value={formData.comissao_percentagem}
                  onChange={handleChange}
                  className="input"
                  placeholder="0.05"
                />
              </div>
            </div>

            {/* Outros campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Origem
                </label>
                <input
                  type="text"
                  name="origem"
                  value={formData.origem}
                  onChange={handleChange}
                  className="input"
                  placeholder="Facebook, Google, Referência..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Próxima Ação
                </label>
                <input
                  type="datetime-local"
                  name="proxima_acao"
                  value={formData.proxima_acao}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Notas da Conversa
              </label>
              <textarea
                name="notas_conversa"
                value={formData.notas_conversa}
                onChange={handleChange}
                rows={4}
                className="input resize-none"
                placeholder="Anotações sobre o contacto, necessidades, etc..."
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary flex-1"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'A guardar...' : (lead ? 'Atualizar' : 'Criar Lead')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}