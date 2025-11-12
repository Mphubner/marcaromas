import { API_URL } from '../utils/api.js';

/**
 * productService - Serviço centralizado para requisições de produtos
 * Fornece métodos para buscar produtos com diferentes filtros
 */

const fetchData = async (endpoint) => {
  const response = await fetch(`${API_URL}/api${endpoint}`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar ${endpoint}: ${response.statusText}`);
  }
  return response.json();
};

export const productService = {
  /**
   * Busca todos os produtos
   * @returns {Promise<Array>} Array de produtos
   */
  getAll: async () => {
    return fetchData('/products');
  },

  /**
   * Busca um produto pelo ID
   * @param {string} id - ID do produto
   * @returns {Promise<Object>} Dados do produto
   */
  getById: async (id) => {
    return fetchData(`/products/${id}`);
  },

  /**
   * Busca produtos por categoria
   * @param {string} category - Nome da categoria
   * @returns {Promise<Array>} Array de produtos da categoria
   */
  getByCategory: async (category) => {
    return fetchData(`/products/category/${category}`);
  },

  /**
   * Busca produtos que correspondem a um termo de busca
   * @param {string} query - Termo de busca
   * @returns {Promise<Array>} Array de produtos encontrados
   */
  search: async (query) => {
    return fetchData(`/products/search?q=${encodeURIComponent(query)}`);
  },

  /**
   * Busca produtos em destaque
   * @returns {Promise<Array>} Array de produtos em destaque
   */
  getFeatured: async () => {
    return fetchData('/products/featured');
  },

  /**
   * Busca os produtos mais vendidos
   * @returns {Promise<Array>} Array dos produtos top
   */
  getTopSellers: async () => {
    return fetchData('/products/top-sellers');
  },

  /**
   * Busca produtos relacionados a um produto específico
   * @param {string} productId - ID do produto
   * @returns {Promise<Array>} Array de produtos relacionados
   */
  getRelated: async (productId) => {
    return fetchData(`/products/${productId}/related`);
  },

  /**
   * Busca todas as categorias disponíveis
   * @returns {Promise<Array>} Array de categorias
   */
  getCategories: async () => {
    return fetchData('/products/categories');
  },
};
