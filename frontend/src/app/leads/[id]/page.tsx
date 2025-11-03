'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '../../../components';
import { useRouter, useParams } from 'next/navigation';
import { FiSave, FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

interface Lead {
  id?: number;
  nome_lead: string;
  email: string;
  telefone: string;
  morada?: string;
  status: string;
  origem?: string;
  interesse?: string;
  observacoes?: string;
  notas_conversa?: string;
  valor_venda_com_iva?: number;
  valor_proposta?: number;
  motivo_perda?: string;
  proxima_acao?: string;
  data_proxima_acao?: string;
  tags?: string;
  url_imagem_cliente?: string;
}

const statusOptions = [
  'Entrada de Lead',
  'Em Análise', 
  'Proposta Enviada', 
  'Em Negociação', 
  'Vendido', 
  'Perdido', 
  'Cancelado'
];

const origemOptions = [
  'Website',
  'Facebook', 
  'Instagram',
  'Google Ads',
  'Indicação',
  'Telefone',
  'Email',
  'Evento',
  'Outros'
];

export default function LeadFormPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params?.id === 'novo' ? null : Number(params?.id);
  const isEditing = leadId !== null;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Lead>({
    nome_lead: '',
    email: '',
    telefone: '',
    morada: '',
    status: 'Entrada de Lead',
    origem: 'Website',
    interesse: '',
    observacoes: '',
    notas_conversa: '',
    valor_venda_com_iva: undefined,
    valor_proposta: undefined,
    motivo_perda: '',
    proxima_acao: '',
    data_proxima_acao: '',
    tags: '',
    url_imagem_cliente: ''
  });

  useEffect(() => {
    if (isEditing && leadId) {
      loadLead(leadId);
    }
  }, [isEditing, leadId]);

  const loadLead = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/leads/${id}`);
      
      if (!response.ok) {
        throw new Error('Lead não encontrado');
      }
      
      const lead = await response.json();
      setFormData({
        nome_lead: lead.nome_lead || '',
        email: lead.email || '',
        telefone: lead.telefone || '',
        morada: lead.morada || '',
        status: lead.status || 'Entrada de Lead',
        origem: lead.origem || 'Website',
        interesse: lead.interesse || '',
        observacoes: lead.observacoes || '',
        notas_conversa: lead.notas_conversa || '',
        valor_venda_com_iva: lead.valor_venda_com_iva || 0,
        valor_proposta: lead.valor_proposta || 0,
        motivo_perda: lead.motivo_perda || '',
          proxima_acao: lead.proxima_acao ? new Date(lead.proxima_acao).toISOString().slice(0, 16) : '',
          data_proxima_acao: '',
        tags: lead.tags || '',
        url_imagem_cliente: lead.url_imagem_cliente || ''
      });
      
    } catch (error) {
      console.error('Erro ao carregar lead:', error);
      toast.error('Erro ao carregar lead. Redirecionando...');
      setTimeout(() => router.push('/leads'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('valor') ? (value ? Number(value) : undefined) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_lead.trim()) {
      toast.error('Nome do lead é obrigatório');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('Email é obrigatório');
      return;
    }
    
    if (!formData.telefone.trim()) {
      toast.error('Telefone é obrigatório');
      return;
    }

    try {
      setSaving(true);
      
      // Preparar dados para envio, mantendo apenas campos válidos
      const submitData: any = {
        nome_lead: formData.nome_lead.trim(),
        email: formData.email.trim(),
        telefone: formData.telefone.trim(),
        status: formData.status
      };
      
      // Adicionar campos opcionais apenas se tiverem valor
      if (formData.morada && formData.morada.trim()) {
        submitData.morada = formData.morada.trim();
      }
      
      if (formData.origem) {
        submitData.origem = formData.origem;
      }
      
      if (formData.valor_venda_com_iva && formData.valor_venda_com_iva > 0) {
        submitData.valor_venda_com_iva = Number(formData.valor_venda_com_iva);
      }
      
      if (formData.valor_proposta && formData.valor_proposta > 0) {
        submitData.valor_proposta = Number(formData.valor_proposta);
      }
      
      if (formData.interesse && formData.interesse.trim()) {
        submitData.interesse = formData.interesse.trim();
      }
      
      if (formData.observacoes && formData.observacoes.trim()) {
        submitData.observacoes = formData.observacoes.trim();
      }
      
      if (formData.notas_conversa && formData.notas_conversa.trim()) {
        submitData.notas_conversa = formData.notas_conversa.trim();
      }
      
      if (formData.motivo_perda && formData.motivo_perda.trim()) {
        submitData.motivo_perda = formData.motivo_perda.trim();
      }
      
        // Adicionar próxima ação se preenchida
        if (formData.proxima_acao && formData.proxima_acao.trim()) {
          try {
            // Converter datetime-local para ISO
            const dataISO = new Date(formData.proxima_acao).toISOString();
            submitData.proxima_acao = dataISO;
            submitData.tarefa_concluida = false; // Nova tarefa sempre não concluída
          } catch (e) {
            console.warn('Erro ao converter data:', e);
          }
        }
      
      console.log('Enviando dados:', submitData);

      const url = isEditing ? `/api/leads/${leadId}` : `/api/leads`;
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar lead');
      }

      const savedLead = await response.json();

      // Decidir para onde redirecionar
      // Se existir próxima ação (tarefa pendente), ir para /tarefas, caso contrário manter em /leads
      const shouldGoToTasks = Boolean(submitData.proxima_acao && submitData.tarefa_concluida !== true);

      toast.success(isEditing ? 'Lead atualizado com sucesso!' : 'Lead criado com sucesso!');

      setTimeout(() => {
        router.push(shouldGoToTasks ? '/tarefas' : '/leads');
      }, 800);
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar lead');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-dark-400">A carregar lead...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster position="top-right" />
      
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/leads')}
          className="btn btn-secondary flex items-center gap-2"
        >
          <FiArrowLeft />
          Voltar
        </button>
        
        <div>
          <h1 className="text-4xl font-bold text-dark-50">
            {isEditing ? 'Editar Lead' : 'Novo Lead'}
          </h1>
          <p className="text-dark-400 mt-1">
            {isEditing ? `Lead #${leadId}` : 'Criar um novo lead no sistema'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass p-6 rounded-lg">
          <h2 className="text-xl font-bold text-dark-50 mb-4 flex items-center gap-2">
            <FiUser />
            Informações Básicas
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <FiUser className="inline mr-2" />
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome_lead"
                value={formData.nome_lead}
                onChange={handleInputChange}
                className="input"
                placeholder="Nome completo do lead"
                required
              />
            </div>
            
            <div>
              <label className="label">
                <FiMail className="inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                placeholder="email@exemplo.com"
                required
              />
            </div>
            
            <div>
              <label className="label">
                <FiPhone className="inline mr-2" />
                Telefone *
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                className="input"
                placeholder="+351 xxx xxx xxx"
                required
              />
            </div>
            
            <div>
              <label className="label">
                <FiMapPin className="inline mr-2" />
                Morada
              </label>
              <input
                type="text"
                name="morada"
                value={formData.morada}
                onChange={handleInputChange}
                className="input"
                placeholder="Rua, cidade, distrito"
              />
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-lg">
          <h2 className="text-xl font-bold text-dark-50 mb-4 flex items-center gap-2">
            📝 Notas e Observações
          </h2>
          
          <div>
            <label className="label">
              Apontamentos sobre o Cliente
            </label>
            <textarea
              name="notas_conversa"
              value={formData.notas_conversa || ''}
              onChange={handleInputChange}
              className="input h-40"
              placeholder="Escreva aqui todas as informações importantes sobre as conversas com o cliente, necessidades específicas, preferências, histórico de contactos, etc..."
            />
            <p className="text-sm text-dark-400 mt-2">
              💡 Use este espaço para registar tudo sobre as suas interações com o cliente
            </p>
          </div>
        </div>

          {/* CAMPO DE PRÓXIMA AÇÃO - TAREFAS */}
          <div className="glass p-6 rounded-lg border-2 border-primary-500/30 bg-primary-500/5">
            <h2 className="text-xl font-bold text-primary-400 mb-4 flex items-center gap-2">
              📅 Agendar Próxima Ação
            </h2>
          
            <div>
              <label className="label text-primary-300">
                Data e Hora da Próxima Ação
              </label>
              <input
                type="datetime-local"
                name="proxima_acao"
                value={formData.proxima_acao || ''}
                onChange={handleInputChange}
                className="input"
              />
              <p className="text-sm text-dark-400 mt-2 flex items-start gap-1">
                <span>💡</span>
                <span>Esta tarefa aparecerá automaticamente na página Tarefas e será vinculada a este lead</span>
              </p>
            </div>
          </div>

        <div className="glass p-6 rounded-lg">
          <h2 className="text-xl font-bold text-dark-50 mb-4">📊 Status e Vendas</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="label">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="label">💰 Valor Venda (com IVA 23%) €</label>
              <input
                type="number"
                name="valor_venda_com_iva"
                value={formData.valor_venda_com_iva || ''}
                onChange={handleInputChange}
                className="input"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {formData.valor_venda_com_iva && formData.valor_venda_com_iva > 0 && (
                <div className="mt-2 text-sm text-green-400">
                  <p>💶 Valor sem IVA: €{(formData.valor_venda_com_iva / 1.23).toFixed(2)}</p>
                  <p>💼 Comissão (5%): €{((formData.valor_venda_com_iva / 1.23) * 0.05).toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {formData.status === 'Perdido' && (
          <div className="glass p-6 rounded-lg">
            <h2 className="text-xl font-bold text-dark-50 mb-4">❌ Motivo da Perda</h2>
            <div>
              <label className="label">Motivo da Perda</label>
              <textarea
                name="motivo_perda"
                value={formData.motivo_perda}
                onChange={handleInputChange}
                className="input h-24"
                placeholder="Motivo pelo qual o lead foi perdido..."
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary flex items-center gap-2 min-w-32"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <FiSave />
                Salvar Lead
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/leads')}
            className="btn btn-secondary"
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
}
