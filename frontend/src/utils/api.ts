// frontend/src/utils/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface Lead {
  id?: number;
  nome_lead: string;
  email?: string;
  telefone?: string;
  morada?: string;
  status: string;
  valor_venda_com_iva?: number;
  taxa_iva?: number;
  valor_proposta?: number;
  notas_conversa?: string;
  proxima_acao?: string;
  url_imagem_cliente?: string;
  [key: string]: any;
}

const apiClient = {
  // Leads
  async getLeads(page = 1, pageSize = 20): Promise<any> {
    const response = await fetch(`/api/leads?page=${page}&limit=${pageSize}`);
    if (!response.ok) throw new Error('Erro ao buscar leads');
    return response.json();
  },

  async getLead(id: number): Promise<Lead> {
    const response = await fetch(`/api/leads/${id}`);
    if (!response.ok) throw new Error('Lead não encontrado');
    return response.json();
  },

  async createLead(lead: Partial<Lead>): Promise<Lead> {
    const response = await fetch(`/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error('Erro ao criar lead');
    return response.json();
  },

  async updateLead(id: number, lead: Partial<Lead>): Promise<Lead> {
    const response = await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error('Erro ao atualizar lead');
    return response.json();
  },

  async deleteLead(id: number): Promise<void> {
    const response = await fetch(`/api/leads/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar lead');
  },

  // Upload de Imagem
  async uploadImage(formData: FormData): Promise<{ url: string }> {
    const response = await fetch(`/api/upload/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Falha no upload da imagem');
    }

    return response.json();
  },

  // Analytics
  async getDashboardStats(params?: Record<string, string | number | string[]>): Promise<any> {
    let qs = '';
    if (params) {
      const search = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (Array.isArray(v)) {
          if (v.length) search.set(k, v.join(','));
        } else {
          search.set(k, String(v));
        }
      });
      const str = search.toString();
      qs = str ? '?' + str : '';
    }
    const response = await fetch(`/api/leads/analytics/dashboard${qs}`);
    if (!response.ok) throw new Error('Erro ao buscar estatísticas');
    return response.json();
  },

  // Buscar leads por status específico
  async getLeadsByStatus(status: string): Promise<any> {
    const response = await fetch(`/api/leads?status=${encodeURIComponent(status)}&limit=1000`);
    if (!response.ok) throw new Error('Erro ao buscar leads por status');
    return response.json();
  },
};

export { apiClient };
