import { API_URL } from '../utils/api.js';

/**
 * planService - Serviço centralizado para requisições de planos de assinatura
 * Fornece métodos para buscar planos com diferentes filtros e comparações
 */

const fetchData = async (endpoint) => {
  const response = await fetch(`${API_URL}/api${endpoint}`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar ${endpoint}: ${response.statusText}`);
  }
  return response.json();
};

export const planService = {
  /**
   * Busca todos os planos de assinatura
   * @returns {Promise<Array>} Array de planos
   */
  getAll: async () => {
    return fetchData('/plans');
  },

  /**
   * Busca um plano pelo ID
   * @param {string} id - ID do plano
   * @returns {Promise<Object>} Dados do plano
   */
  getById: async (id) => {
    return fetchData(`/plans/${id}`);
  },

  /**
   * Busca planos em destaque
   * @returns {Promise<Array>} Array de planos em destaque
   */
  getFeatured: async () => {
    return fetchData('/plans/featured');
  },

  /**
   * Busca os planos mais populares
   * @returns {Promise<Array>} Array dos planos populares
   */
  getPopular: async () => {
    return fetchData('/plans/popular');
  },

  /**
   * Busca planos por tipo
   * @param {string} type - Tipo do plano (e.g., 'monthly', 'quarterly')
   * @returns {Promise<Array>} Array de planos do tipo especificado
   */
  getByType: async (type) => {
    return fetchData(`/plans/type/${type}`);
  },

  /**
   * Busca dados para comparação de planos
   * @param {Array<string>} planIds - Array de IDs de planos para comparar
   * @returns {Promise<Object>} Dados comparativos dos planos
   */
  compare: async (planIds) => {
    const ids = planIds.join(',');
    return fetchData(`/plans/compare?ids=${ids}`);
  },

  /**
   * Busca planos que estão ativos/disponíveis
   * @returns {Promise<Array>} Array de planos ativos
   */
  getActive: async () => {
    return fetchData('/plans/active');
  },

  /**
   * Busca os benefícios disponíveis em um plano
   * @param {string} planId - ID do plano
   * @returns {Promise<Array>} Array de benefícios do plano
   */
  getBenefits: async (planId) => {
    return fetchData(`/plans/${planId}/benefits`);
  },
};
