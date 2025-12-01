import api from '../lib/api';

export const dashboardService = {
  getDashboardData: async () => {
    const { data } = await api.get('/dashboard');
    return data;
  },

  getStats: async () => {
    const { data } = await api.get('/dashboard/stats');
    return data;
  },

  getRecentOrders: async () => {
    const { data } = await api.get('/orders/recent');
    return data;
  },
};
