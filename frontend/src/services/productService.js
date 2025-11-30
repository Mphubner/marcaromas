import api from '../lib/api';

export const productService = {
  getAll: async () => {
    // Endpoint unificado que retorna produtos + boxes
    const { data } = await api.get('/store/products');
    return data;
  },
  getBySlug: async (slug) => {
    const { data } = await api.get(`/products/${slug}`);
    return data;
  },
  getFeatured: async () => {
    const { data } = await api.get('/products');
    return data; // Backend pode adicionar ?featured=true futuramente
  },
};
