'use client';

import React from 'react';
import { FiChevronRight, FiClock, FiAlertTriangle, FiPhone, FiDollarSign } from 'react-icons/fi';
import clsx from 'clsx';

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

interface TaskSectionProps {
  title: string;
  description: string;
  tasks: TaskItem[];
  onTaskClick: (task: TaskItem) => void;
  emptyMessage: string;
  priority: string;
}

export default function TaskSection({ 
  title, 
  description, 
  tasks, 
  onTaskClick, 
  emptyMessage,
  priority 
}: TaskSectionProps) {
  
  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'border-red-500/50 bg-red-500/10';
      case 'media':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'baixa':
        return 'border-green-500/50 bg-green-500/10';
      default:
        return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const getPriorityIcon = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <FiAlertTriangle className="text-red-400" size={16} />;
      case 'media':
        return <FiClock className="text-yellow-400" size={16} />;
      default:
        return <FiPhone className="text-green-400" size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    if (date.toDateString() === hoje.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === amanha.toDateString()) {
      return 'Amanhã';
    } else if (date < hoje) {
      const dias = Math.floor((hoje.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      return `Há ${dias} dia${dias > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('pt-PT');
    }
  };

  return (
    <div className="glass-card p-6">
      {/* Header da Seção */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-dark-50">{title}</h2>
          <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
            {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
          </span>
        </div>
        <p className="text-dark-400 text-sm">{description}</p>
      </div>

      {/* Lista de Tarefas */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-dark-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={clsx(
                'p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02]',
                getPriorityColor(task.prioridade),
                'hover:border-primary-400/50 hover:bg-primary-500/5'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Título da Tarefa */}
                  <div className="flex items-center gap-2 mb-2">
                    {getPriorityIcon(task.prioridade)}
                    <h3 className="font-semibold text-dark-50">{task.titulo}</h3>
                  </div>

                  {/* Descrição */}
                  <p className="text-dark-400 text-sm mb-3">{task.descricao}</p>

                  {/* Detalhes */}
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1 text-dark-500">
                      <span className="font-medium">Status:</span>
                      <span className="px-2 py-1 bg-glass-light rounded">
                        {task.lead_status}
                      </span>
                    </div>

                    {task.data_proxima_acao && (
                      <div className="flex items-center gap-1 text-dark-500">
                        <FiClock size={12} />
                        <span>{formatDate(task.data_proxima_acao)}</span>
                      </div>
                    )}

                    {task.valor_proposta && (
                      <div className="flex items-center gap-1 text-green-400">
                        <FiDollarSign size={12} />
                        <span className="font-medium">
                          €{task.valor_proposta.toLocaleString('pt-PT', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      </div>
                    )}

                    {task.dias_sem_contacto && (
                      <div className="flex items-center gap-1 text-red-400">
                        <span>{task.dias_sem_contacto} dias sem contacto</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Seta */}
                <div className="ml-4 opacity-60">
                  <FiChevronRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}