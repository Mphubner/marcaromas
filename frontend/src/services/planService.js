import api from '../lib/api';

export const planService = {
  getAll: async () => {
    const { data } = await api.get('/plans');
    return data;
  },
  getPopular: async () => {
    const { data } = await api.get('/plans');
    return data; // Backend pode adicionar ?popular=true futuramente
  },
};
