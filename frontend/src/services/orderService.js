import api from '../lib/api';

export const orderService = {
  createOrder: async (orderData) => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },
  getMyOrders: async () => {
    const { data } = await api.get('/orders/my-orders');
    return data;
  },
};
