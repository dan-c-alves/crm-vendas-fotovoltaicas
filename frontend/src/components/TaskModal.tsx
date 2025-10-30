'use client';

import React, { useState } from 'react';
import { FiX, FiUser, FiCalendar, FiMessageCircle, FiDollarSign, FiCheckCircle, FiExternalLink } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { emitLeadUpdate } from '../hooks/useTaskUpdates';

interface TaskItem {
  id: number;
  tipo: string;
  titulo: string;
  descricao: string;
  prioridade: string;
  lead_nome: string;
  lead_status: string;
  proxima_acao?: string;
  data_proxima_acao?: string;
  dias_sem_contacto?: number;
  valor_proposta?: number;
  created_at: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem;
  onUpdate: () => void;
}

export default function TaskModal({ isOpen, onClose, task, onUpdate }: TaskModalProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'text-red-400 bg-red-500/20';
      case 'media':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'baixa':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const handleOpenLead = () => {
    router.push(`/leads?edit=${task.id}`);
    onClose();
  };

  const handleQuickAction = async (action: string) => {
    setIsUpdating(true);
    try {
      let updateData: any = {};
      let message = '';

      switch (action) {
        case 'contactado':
          updateData = {
            status: 'Contactados',
            proxima_acao: 'Aguardar resposta do cliente',
            data_proxima_acao: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +2 dias
          };
          message = 'Lead marcado como contactado!';
          break;
        
        case 'follow_up':
          updateData = {
            status: 'Follow-up',
            proxima_acao: 'Reagendar contacto',
            data_proxima_acao: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +1 dia
          };
          message = 'Follow-up agendado para amanhã!';
          break;
        
        case 'interessado':
          updateData = {
            status: 'Interessados',
            proxima_acao: 'Preparar proposta',
            data_proxima_acao: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +1 dia
          };
          message = 'Lead marcado como interessado!';
          break;
        
        case 'hot_lead':
          updateData = {
            status: 'Hot Lead',
            proxima_acao: 'Finalizar negociação',
            data_proxima_acao: new Date().toISOString().split('T')[0] // hoje
          };
          message = 'Lead promovido para Hot Lead!';
          break;
      }

      const response = await fetch(`/api/leads/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success(message);
        emitLeadUpdate('leadUpdated', task.id); // Disparar evento de sincronização
        onUpdate();
        onClose();
      } else {
        toast.error('Erro ao atualizar lead');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao atualizar lead');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-glass-light">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-dark-50 mb-2">{task.titulo}</h2>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.prioridade)}`}>
                  {task.prioridade.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-glass-light text-dark-300 rounded-full text-xs">
                  {task.tipo.replace('_', ' ')}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-glass-light rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Descrição */}
          <p className="text-dark-400 mb-6">{task.descricao}</p>

          {/* Detalhes do Lead */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <FiUser className="text-primary-400" size={18} />
              <div>
                <span className="text-dark-500 text-sm">Cliente:</span>
                <p className="text-dark-50 font-medium">{task.lead_nome}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-blue-400" size={18} />
              <div>
                <span className="text-dark-500 text-sm">Status Atual:</span>
                <p className="text-dark-50 font-medium">{task.lead_status}</p>
              </div>
            </div>

            {task.proxima_acao && (
              <div className="flex items-center gap-3">
                <FiMessageCircle className="text-yellow-400" size={18} />
                <div>
                  <span className="text-dark-500 text-sm">Próxima Ação:</span>
                  <p className="text-dark-50 font-medium">{task.proxima_acao}</p>
                </div>
              </div>
            )}

            {task.data_proxima_acao && (
              <div className="flex items-center gap-3">
                <FiCalendar className="text-green-400" size={18} />
                <div>
                  <span className="text-dark-500 text-sm">Data Agendada:</span>
                  <p className="text-dark-50 font-medium">{formatDate(task.data_proxima_acao)}</p>
                </div>
              </div>
            )}

            {task.valor_proposta && (
              <div className="flex items-center gap-3">
                <FiDollarSign className="text-green-400" size={18} />
                <div>
                  <span className="text-dark-500 text-sm">Valor da Proposta:</span>
                  <p className="text-green-400 font-bold text-lg">
                    €{task.valor_proposta.toLocaleString('pt-PT', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>
              </div>
            )}

            {task.dias_sem_contacto && (
              <div className="flex items-center gap-3">
                <FiCalendar className="text-red-400" size={18} />
                <div>
                  <span className="text-dark-500 text-sm">Sem Contacto:</span>
                  <p className="text-red-400 font-medium">{task.dias_sem_contacto} dias</p>
                </div>
              </div>
            )}
          </div>

          {/* Ações Rápidas */}
          <div className="space-y-4">
            <h3 className="text-dark-50 font-semibold mb-3">Ações Rápidas:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {task.tipo === 'sem_contacto' && (
                <>
                  <button
                    onClick={() => handleQuickAction('contactado')}
                    disabled={isUpdating}
                    className="p-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50"
                  >
                    ✅ Marcar como Contactado
                  </button>
                  <button
                    onClick={() => handleQuickAction('follow_up')}
                    disabled={isUpdating}
                    className="p-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors disabled:opacity-50"
                  >
                    📅 Agendar Follow-up
                  </button>
                </>
              )}

              {task.tipo === 'follow_up' && (
                <>
                  <button
                    onClick={() => handleQuickAction('interessado')}
                    disabled={isUpdating}
                    className="p-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50"
                  >
                    👍 Cliente Interessado
                  </button>
                  <button
                    onClick={() => handleQuickAction('hot_lead')}
                    disabled={isUpdating}
                    className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                  >
                    🔥 Promover para Hot Lead
                  </button>
                </>
              )}

              {task.tipo === 'hot_lead' && (
                <>
                  <button
                    onClick={() => handleQuickAction('follow_up')}
                    disabled={isUpdating}
                    className="p-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors disabled:opacity-50"
                  >
                    📞 Reagendar Contacto
                  </button>
                  <button
                    onClick={handleOpenLead}
                    className="p-3 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-colors"
                  >
                    ✏️ Finalizar Venda
                  </button>
                </>
              )}
            </div>

            {/* Ação Universal */}
            <button
              onClick={handleOpenLead}
              className="w-full p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FiExternalLink size={16} />
              Abrir Lead Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}