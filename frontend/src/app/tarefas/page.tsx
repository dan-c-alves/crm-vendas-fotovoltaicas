'use client';

import React, { useState, useEffect } from 'react';
import { FiClock, FiRefreshCw, FiCheck, FiCalendar, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { Layout, LeadModal } from '@/components';
import { apiClient } from '@/utils/api';
import { formatCurrency, formatDateTime } from '@/utils/format';
import toast from 'react-hot-toast';

interface TaskItem {
  id: number;
  nome_lead: string;
  email?: string;
  telefone?: string;
  morada?: string;
  status?: string;
  valor_venda_sem_iva?: number;
  valor_venda_com_iva?: number;
  taxa_iva?: number;
  comissao_valor?: number;
  proxima_acao_texto?: string;
  data_agendada?: string;
  notas_conversa?: string;
}

interface Lead {
  id?: number;
  nome_lead: string;
  email?: string;
  telefone?: string;
  morada?: string;
  status: string;
  valor_venda_com_iva?: number | null;
  valor_venda_sem_iva?: number;
  taxa_iva?: number;
  valor_proposta?: number;
  comissao_percentagem?: number;
  comissao_valor?: number | null;
  notas_conversa?: string;
  origem?: string;
  proxima_acao?: string;
  data_proxima_acao?: string;
  data_entrada?: string;
  created_at?: string;
}

interface TasksData {
  total_tarefas: number;
  tarefas_agendadas: TaskItem[];
}

export default function TarefasPage() {
  const [tasks, setTasks] = useState<TasksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [newDateTime, setNewDateTime] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      // Buscar leads com próxima ação agendada (usar page_size=100 para garantir que pegamos a maioria)
      const response = await fetch('http://localhost:8000/api/leads/?page=1&page_size=100');
      if (response.ok) {
        const data = await response.json();
        const leadsWithTasks = data.data.filter((lead: any) => lead.proxima_acao);
        
        const tasksData = {
          total_tarefas: leadsWithTasks.length,
          tarefas_agendadas: leadsWithTasks.map((lead: any) => ({
            id: lead.id,
            nome_lead: lead.nome_lead,
            email: lead.email,
            telefone: lead.telefone,
            morada: lead.morada,
            status: lead.status,
            valor_venda_sem_iva: lead.valor_venda_com_iva ? lead.valor_venda_com_iva / (1 + (lead.taxa_iva || 23) / 100) : 0,
            valor_venda_com_iva: lead.valor_venda_com_iva,
            taxa_iva: lead.taxa_iva,
            comissao_valor: lead.comissao_valor,
            proxima_acao_texto: lead.proxima_acao,
            data_agendada: lead.proxima_acao,
            notas_conversa: lead.notas_conversa
          }))
        };
        
        setTasks(tasksData);
      } else {
        console.error('Erro ao buscar tarefas:', response.statusText);
        toast.error('Erro ao carregar tarefas');
      }
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const handleEditLead = async (taskId: number) => {
    try {
      const lead = await apiClient.getLead(taskId);
      // Garantir que status não seja undefined
      if (!lead.status) {
        lead.status = 'Entrada de Lead';
      }
      setSelectedLead(lead);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar lead:', error);
      toast.error('Erro ao carregar lead');
    }
  };

  const handleDeleteLead = async (taskId: number, leadName: string) => {
    if (confirm(`Tem certeza que deseja eliminar o lead "${leadName}"?`)) {
      try {
        await apiClient.deleteLead(taskId);
        toast.success('Lead eliminado com sucesso!');
        fetchTasks();
      } catch (error) {
        console.error('Erro ao eliminar lead:', error);
        toast.error('Erro ao eliminar lead');
      }
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      const response = await apiClient.updateLead(taskId, {
        proxima_acao: null
      });
      
      toast.success('Tarefa concluída!');
      fetchTasks();
    } catch (error) {
      console.error('Erro ao concluir tarefa:', error);
      toast.error('Erro ao concluir tarefa');
    }
  };

  const handleRemoveDate = async (taskId: number, leadName: string) => {
    if (confirm(`Remover agendamento do lead "${leadName}"? O lead voltará ao seu status original.`)) {
      try {
        const response = await apiClient.updateLead(taskId, {
          proxima_acao: null
        });

        toast.success('Data removida! Lead voltou ao status original.');
        fetchTasks();
      } catch (error) {
        console.error('Erro ao remover data:', error);
        toast.error('Erro ao remover data');
      }
    }
  };

  const handlePostponeTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    setNewDateTime('');
    setIsDateModalOpen(true);
  };

  const handleSaveNewDateTime = async () => {
    if (!selectedTaskId || !newDateTime) {
      toast.error('Por favor, selecione uma data e hora');
      return;
    }

    try {
      const response = await apiClient.updateLead(selectedTaskId, {
        proxima_acao: newDateTime
      });

      toast.success('Nova data agendada!');
      setIsDateModalOpen(false);
      setSelectedTaskId(null);
      setNewDateTime('');
      fetchTasks();
    } catch (error) {
      console.error('Erro ao agendar nova data:', error);
      toast.error('Erro ao agendar nova data');
    }
  };

  const handleSaveLead = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <FiRefreshCw className="animate-spin text-4xl text-primary-400" />
            <span className="ml-3 text-white">Carregando tarefas...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Lista de Tarefas
            </h1>
            <p className="text-dark-400 mt-1">
              Clientes agendados para contacto - ordenados por data
            </p>
          </div>
          <button
            onClick={fetchTasks}
            className="btn btn-primary flex items-center gap-2"
            disabled={loading}
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <FiClock className="text-2xl text-primary-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{tasks?.total_tarefas || 0}</p>
                <p className="text-dark-400">Total de Tarefas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <FiCalendar className="text-2xl text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {tasks?.tarefas_agendadas.length || 0}
                </p>
                <p className="text-dark-400">Contactos Agendados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tarefas Agendadas */}
        {tasks?.tarefas_agendadas && tasks.tarefas_agendadas.length > 0 ? (
          <div className="bg-dark-800 rounded-2xl border border-dark-600 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <FiClock className="text-xl text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Contactos Agendados</h3>
                <p className="text-dark-400">Total: {tasks.tarefas_agendadas.length} tarefas</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-600">
                    <th className="text-left py-3 px-4 text-dark-300 font-medium">Cliente</th>
                    <th className="text-left py-3 px-4 text-dark-300 font-medium">Contacto</th>
                    <th className="text-left py-3 px-4 text-dark-300 font-medium">Valor Venda</th>
                    <th className="text-left py-3 px-4 text-dark-300 font-medium">Comissão</th>
                    <th className="text-left py-3 px-4 text-dark-300 font-medium">Data/Hora</th>
                    <th className="text-center py-3 px-4 text-dark-300 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.tarefas_agendadas
                    .sort((a, b) => {
                      if (a.data_agendada && b.data_agendada) {
                        // Ordenar por data - mais recente primeiro (DESC)
                        return new Date(b.data_agendada).getTime() - new Date(a.data_agendada).getTime();
                      }
                      return 0;
                    })
                    .map((task) => (
                      <tr key={task.id} className="border-b border-dark-700 hover:bg-dark-700 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-white">{task.nome_lead}</p>
                            <p className="text-sm text-dark-400">Status: {task.status}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            {task.telefone && (
                              <p className="text-white">{task.telefone}</p>
                            )}
                            {task.email && (
                              <p className="text-dark-400">{task.email}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white font-medium">
                          {formatCurrency(task.valor_venda_sem_iva)}
                        </td>
                        <td className="py-4 px-4 text-green-400 font-medium">
                          {formatCurrency(task.comissao_valor)}
                        </td>
                        <td className="py-4 px-4">
                          {task.data_agendada ? (
                            <div>
                              <p className="text-white font-medium">
                                {formatDateTime(task.data_agendada).date}
                              </p>
                              <p className="text-sm text-dark-400">
                                {formatDateTime(task.data_agendada).time}
                              </p>
                            </div>
                          ) : (
                            <span className="text-dark-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleCompleteTask(task.id)}
                              className="p-2 hover:bg-glass-light rounded transition-colors text-green-400 hover:text-green-300"
                              title="Concluído"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() => handlePostponeTask(task.id)}
                              className="p-2 hover:bg-glass-light rounded transition-colors text-yellow-400 hover:text-yellow-300"
                              title="Adiar"
                            >
                              <FiCalendar size={16} />
                            </button>
                            <button
                              onClick={() => handleRemoveDate(task.id, task.nome_lead)}
                              className="p-2 hover:bg-glass-light rounded transition-colors text-orange-400 hover:text-orange-300"
                              title="Remover agendamento"
                            >
                              <FiX size={16} />
                            </button>
                            <button
                              onClick={() => handleEditLead(task.id)}
                              className="p-2 hover:bg-glass-light rounded transition-colors text-blue-400 hover:text-blue-300"
                              title="Editar cliente"
                            >
                              <FiEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(task.id, task.nome_lead)}
                              className="p-2 hover:bg-glass-light rounded transition-colors text-red-400 hover:text-red-300"
                              title="Eliminar cliente"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-dark-800 rounded-2xl border border-dark-600 p-12 text-center">
            <FiClock className="mx-auto text-4xl text-dark-400 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhuma tarefa agendada</h3>
            <p className="text-dark-400">
              Quando agendar contactos com data e hora, eles aparecerão aqui.
            </p>
          </div>
        )}

        {/* Modal para Nova Data */}
        {isDateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md border border-dark-600">
              <h3 className="text-xl font-bold text-white mb-4">Agendar Nova Data</h3>
              <div className="mb-4">
                <label className="block text-dark-300 mb-2">Nova Data e Hora:</label>
                <input
                  type="datetime-local"
                  value={newDateTime}
                  onChange={(e) => setNewDateTime(e.target.value)}
                  className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDateModalOpen(false)}
                  className="flex-1 py-2 px-4 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveNewDateTime}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Agendar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lead Modal */}
        {selectedLead && (
          <LeadModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedLead(null);
            }}
            onSave={handleSaveLead}
            lead={selectedLead}
          />
        )}
      </div>
    </Layout>
  );
}
