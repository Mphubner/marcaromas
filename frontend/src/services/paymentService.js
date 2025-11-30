import api from '../lib/api';

export const paymentService = {
  createPreference: async (orderId) => {
    const { data } = await api.post('/payment/create-preference', { orderId });
    return data;
  },
};
