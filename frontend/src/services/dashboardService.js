import api from '../lib/api';

export const dashboardService = {
  getDashboardData: async () => {
    const { data } = await api.get('/dashboard');
    return data;
  },

  getStats: async () => {
    const { data } = await api.get('/api/dashboard/stats');
    return data;
  },

  getRecentOrders: async () => {
    const { data } = await api.get('/api/orders/recent');
    return data;
  },
};
