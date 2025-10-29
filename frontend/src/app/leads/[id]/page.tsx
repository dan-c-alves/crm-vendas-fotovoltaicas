// frontend/src/app/leads/[id]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components';
import { apiClient } from '@/utils/api';
import { FiUpload, FiCalendar, FiSave, FiXCircle, FiArrowLeft } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Definição de tipos (Baseada nos Schemas do Backend)
interface LeadData {
  nome_lead: string;
  email: string | null;
  telefone: string | null;
  morada: string | null;
  status: string;
  valor_venda_com_iva: number | null;
  taxa_iva: number | null;
  valor_proposta: number | null;
  comissao_percentagem: number | null;
  notas_conversa: string | null;
  motivo_perda: string | null;
  proxima_acao: string | null; // Data/hora em string ISO
  origem: string | null;
  tags: string | null;
  url_imagem_cliente: string | null; // NOVO
}

const statusOptions = [
  'Entrada de Lead', 'Contactados', 'Levantamento Técnico', 'Em Orçamentação', 
  'Proposta Entregue', 'Negociação', 'Hot Lead', 'Ganho', 'Perdidos', 'Não Atende'
];

export default function LeadEditPage({ params }: { params: { id: string } }) {
  const leadId = parseInt(params.id);
  const router = useRouter();
  const [formData, setFormData] = useState<LeadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Carregar dados do lead
    const fetchLead = async () => {
      if (leadId === 0) { // Novo Lead
        setFormData({
          nome_lead: '', email: null, telefone: null, morada: null, status: 'Entrada de Lead',
          valor_venda_com_iva: 0, taxa_iva: 23, valor_proposta: 0, comissao_percentagem: 5,
          notas_conversa: null, motivo_perda: null, proxima_acao: null, origem: null, tags: null,
          url_imagem_cliente: null,
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/leads/${leadId}`);
        if (!response.ok) throw new Error('Lead não encontrado');
        const lead = await response.json();
        
        setFormData({
          ...lead,
          // Formatar a data para o input 'datetime-local'
          proxima_acao: lead.proxima_acao ? new Date(lead.proxima_acao).toISOString().slice(0, 16) : null,
        });
      } catch (error) {
        toast.error('Erro ao carregar dados do Lead.');
        router.push('/leads');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [leadId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      toast.loading('A carregar imagem...', { id: 'upload' });
      
      const response = await fetch('http://localhost:8000/api/upload/image', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Falha no upload');
      
      const result = await response.json();
      toast.dismiss('upload');
      
      setFormData(prev => (prev ? { ...prev, url_imagem_cliente: result.url } : null));
      toast.success('Imagem carregada com sucesso!');

    } catch (error) {
      toast.dismiss('upload');
      toast.error('Erro ao carregar imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const url = leadId === 0 
        ? 'http://localhost:8000/api/leads'
        : `http://localhost:8000/api/leads/${leadId}`;
      
      const method = leadId === 0 ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erro ao guardar');

      if (leadId === 0) {
        toast.success('Novo Lead criado com sucesso!');
      } else {
        toast.success('Lead atualizado! (Verifique o Google Calendar)');
      }
      router.push('/leads');
    } catch (error) {
      toast.error('Erro ao guardar Lead.');
    }
  };

  if (loading || !formData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-dark-400">A carregar...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.push('/leads')} 
          className="btn btn-secondary flex items-center gap-2"
        >
          <FiArrowLeft />
          Voltar
        </button>
        <h1 className="text-4xl font-bold text-dark-50">
          {leadId === 0 ? 'Novo Lead' : `Editar: ${formData.nome_lead}`}
        </h1>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="glass p-6 rounded-lg space-y-6">
        
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">Nome do Lead *</label>
            <input 
              type="text" 
              name="nome_lead" 
              value={formData.nome_lead} 
              onChange={handleChange} 
              className="input" 
              required 
            />
          </div>
          
          <div>
            <label className="label">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email || ''} 
              onChange={handleChange} 
              className="input" 
            />
          </div>

          <div>
            <label className="label">Telefone</label>
            <input 
              type="text" 
              name="telefone" 
              value={formData.telefone || ''} 
              onChange={handleChange} 
              className="input" 
            />
          </div>

          <div className="md:col-span-3">
            <label className="label">Morada</label>
            <input 
              type="text" 
              name="morada" 
              value={formData.morada || ''} 
              onChange={handleChange} 
              className="input" 
            />
          </div>
        </div>

        {/* Status e Próxima Ação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dark-700">
          <div>
            <label className="label">Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              className="input"
            >
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <FiCalendar size={16} /> 
              Próxima Ação (Google Calendar)
            </label>
            <input 
              type="datetime-local" 
              name="proxima_acao" 
              value={formData.proxima_acao || ''} 
              onChange={handleChange} 
              className="input" 
            />
            <p className="text-dark-400 text-sm mt-1">
              🔔 Será agendado no seu Google Calendar com alerta
            </p>
          </div>
        </div>

        {/* Informações Financeiras */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-dark-700">
          <div>
            <label className="label">Valor Venda (c/ IVA) €</label>
            <input 
              type="number" 
              name="valor_venda_com_iva" 
              value={formData.valor_venda_com_iva || 0} 
              onChange={handleChange} 
              className="input" 
              step="0.01" 
            />
          </div>
          
          <div>
            <label className="label">Taxa IVA (%)</label>
            <input 
              type="number" 
              name="taxa_iva" 
              value={formData.taxa_iva || 23} 
              onChange={handleChange} 
              className="input" 
              step="0.01" 
            />
          </div>
          
          <div>
            <label className="label">Valor Proposta €</label>
            <input 
              type="number" 
              name="valor_proposta" 
              value={formData.valor_proposta || 0} 
              onChange={handleChange} 
              className="input" 
              step="0.01" 
            />
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="label">Notas da Conversa</label>
          <textarea 
            name="notas_conversa" 
            value={formData.notas_conversa || ''} 
            onChange={handleChange} 
            className="input h-32"
            placeholder="Detalhes da conversa, necessidades do cliente, observações..."
          />
        </div>

        {/* Upload de Imagem */}
        <div className="border-t border-dark-700 pt-6">
          <h3 className="text-xl font-bold text-dark-50 mb-4 flex items-center gap-2">
            📸 Documentação Visual
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                id="image-upload"
                disabled={uploading}
              />
              <label 
                htmlFor="image-upload" 
                className={`btn cursor-pointer flex items-center gap-2 ${
                  uploading ? 'btn-secondary opacity-50' : 'btn-primary'
                }`}
              >
                <FiUpload />
                {uploading ? 'A carregar...' : formData.url_imagem_cliente ? 'Mudar Imagem' : 'Carregar Imagem'}
              </label>
              
              {formData.url_imagem_cliente && (
                <div className="relative group">
                  <a 
                    href={formData.url_imagem_cliente} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img 
                      src={formData.url_imagem_cliente} 
                      alt="Documentação do Cliente" 
                      className="w-24 h-24 object-cover rounded-lg border-2 border-green-500/50 hover:border-green-500 transition-colors" 
                    />
                  </a>
                  <button 
                    type="button" 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    onClick={() => setFormData(prev => prev ? { ...prev, url_imagem_cliente: null } : null)}
                  >
                    <FiXCircle size={16} />
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-dark-400 text-sm">
              📷 Pode carregar fotos do local, plantas, documentos ou orçamentos. 
              {formData.url_imagem_cliente && (
                <><br />✅ URL: <span className="text-green-400">{formData.url_imagem_cliente}</span></>
              )}
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4 pt-6 border-t border-dark-700">
          <button 
            type="button" 
            onClick={() => router.push('/leads')} 
            className="btn btn-secondary flex items-center gap-2"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary flex items-center gap-2"
          >
            <FiSave />
            {leadId === 0 ? 'Criar Lead' : 'Guardar Alterações'}
          </button>
        </div>
      </form>
    </Layout>
  );
}