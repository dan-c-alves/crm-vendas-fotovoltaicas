import { create } from 'zustand';

interface Lead {
  id: number;
  nome_lead: string;
  email?: string;
  telefone?: string;
  status: string;
  valor_venda_com_iva: number;
  comissao_valor: number;
  data_entrada: string;
}

interface Stats {
  total_leads: number;
  total_vendas: number;
  valor_total_vendas: number;
  comissao_total: number;
  taxa_conversao: number;
}

interface AppStore {
  // Estado
  leads: Lead[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  selectedLead: Lead | null;
  filterStatus: string;
  searchQuery: string;
  
  // Ações
  setLeads: (leads: Lead[]) => void;
  setStats: (stats: Stats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedLead: (lead: Lead | null) => void;
  setFilterStatus: (status: string) => void;
  setSearchQuery: (query: string) => void;
  addLead: (lead: Lead) => void;
  removeLead: (id: number) => void;
  updateLead: (id: number, lead: Partial<Lead>) => void;
  reset: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Estado inicial
  leads: [],
  stats: null,
  loading: false,
  error: null,
  selectedLead: null,
  filterStatus: 'Todos',
  searchQuery: '',

  // Ações
  setLeads: (leads) => set({ leads }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  addLead: (lead) => set((state) => ({
    leads: [lead, ...state.leads],
  })),
  
  removeLead: (id) => set((state) => ({
    leads: state.leads.filter((lead) => lead.id !== id),
  })),
  
  updateLead: (id, lead) => set((state) => ({
    leads: state.leads.map((l) => (l.id === id ? { ...l, ...lead } : l)),
  })),
  
  reset: () => set({
    leads: [],
    stats: null,
    loading: false,
    error: null,
    selectedLead: null,
    filterStatus: 'Todos',
    searchQuery: '',
  }),
}));

