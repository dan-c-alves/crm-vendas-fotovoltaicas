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
    const response = await fetch(`${API_URL}/api/leads?page=${page}&page_size=${pageSize}`);
    if (!response.ok) throw new Error('Erro ao buscar leads');
    return response.json();
  },

  async getLead(id: number): Promise<Lead> {
    const response = await fetch(`${API_URL}/api/leads/${id}`);
    if (!response.ok) throw new Error('Lead não encontrado');
    return response.json();
  },

  async createLead(lead: Partial<Lead>): Promise<Lead> {
    const response = await fetch(`${API_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error('Erro ao criar lead');
    return response.json();
  },

  async updateLead(id: number, lead: Partial<Lead>): Promise<Lead> {
    const response = await fetch(`${API_URL}/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error('Erro ao atualizar lead');
    return response.json();
  },

  async deleteLead(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/leads/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar lead');
  },

  // Upload de Imagem
  async uploadImage(formData: FormData): Promise<{ url: string }> {
    const response = await fetch(`${API_URL}/api/upload/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Falha no upload da imagem');
    }

    return response.json();
  },

  // Analytics
  async getDashboardStats(): Promise<any> {
    const response = await fetch(`${API_URL}/api/leads/analytics/dashboard`);
    if (!response.ok) throw new Error('Erro ao buscar estatísticas');
    return response.json();
  },

  // Buscar leads por status específico
  async getLeadsByStatus(status: string): Promise<any> {
    const response = await fetch(`${API_URL}/api/leads/?status=${encodeURIComponent(status)}&page_size=1000`);
    if (!response.ok) throw new Error('Erro ao buscar leads por status');
    return response.json();
  },
};

export { apiClient };
