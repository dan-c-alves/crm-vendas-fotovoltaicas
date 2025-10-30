'use client';

import { useState, useEffect, useCallback } from 'react';

interface TaskStats {
  total_tarefas: number;
  follow_ups: number;
  hot_leads: number;
  sem_contacto: number;
}

export function useTaskUpdates() {
  const [taskStats, setTaskStats] = useState<TaskStats>({ 
    total_tarefas: 0, 
    follow_ups: 0, 
    hot_leads: 0, 
    sem_contacto: 0 
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchTaskStats = useCallback(async () => {
    try {
      // Buscar leads com próxima ação agendada para contar tarefas reais
      const leadsResponse = await fetch('/api/leads?page=1&page_size=100');
      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        const leadsWithTasks = leadsData.data.filter((lead: any) => lead.proxima_acao);
        
        // Buscar stats gerais do dashboard
        const dashboardResponse = await fetch('/api/leads/analytics/dashboard');
        let dashboardStats = {};
        if (dashboardResponse.ok) {
          dashboardStats = await dashboardResponse.json();
        }
        
        setTaskStats({
          total_tarefas: leadsWithTasks.length, // Número real de tarefas agendadas
          follow_ups: (dashboardStats as any).leads_por_status?.['Contactados'] || 0,
          hot_leads: (dashboardStats as any).leads_por_status?.['Hot Lead'] || 0,
          sem_contacto: (dashboardStats as any).leads_por_status?.['Não Atende'] || 0
        });
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.log('Erro ao buscar stats de tarefas:', error);
    }
  }, []);

  // Função para forçar atualização (usada após mudanças nos leads)
  const triggerUpdate = useCallback(() => {
    fetchTaskStats();
  }, [fetchTaskStats]);

  useEffect(() => {
    // Buscar dados iniciais
    fetchTaskStats();
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchTaskStats, 30000);
    
    // Listener para mudanças nos leads (via eventos customizados)
    const handleLeadUpdate = () => {
      // Delay pequeno para garantir que o backend processou a mudança
      setTimeout(fetchTaskStats, 1000);
    };

    // Registrar listeners de eventos customizados
    window.addEventListener('leadUpdated', handleLeadUpdate);
    window.addEventListener('leadCreated', handleLeadUpdate);
    window.addEventListener('leadDeleted', handleLeadUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('leadUpdated', handleLeadUpdate);
      window.removeEventListener('leadCreated', handleLeadUpdate);
      window.removeEventListener('leadDeleted', handleLeadUpdate);
    };
  }, [fetchTaskStats]);

  return {
    taskStats,
    lastUpdate,
    triggerUpdate,
    refreshTasks: fetchTaskStats
  };
}

// Função utilitária para disparar eventos de atualização
export const emitLeadUpdate = (eventType: 'leadUpdated' | 'leadCreated' | 'leadDeleted', leadId?: number) => {
  const event = new CustomEvent(eventType, { 
    detail: { leadId, timestamp: new Date() } 
  });
  window.dispatchEvent(event);
};

// Hook para controle de auto-refresh baseado na visibilidade da página
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
}