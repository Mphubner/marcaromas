import api from '../lib/api';

export const cartService = {
  getCart: async () => {
    const { data } = await api.get('/cart');
    return data;
  },
  addItem: async (item) => {
    const { data } = await api.post('/cart/items', item);
    return data;
  },
  updateItem: async (itemId, quantity) => {
    const { data } = await api.patch(`/cart/items/${itemId}`, { quantity });
    return data;
  },
  removeItem: async (itemId) => {
    await api.delete(`/cart/items/${itemId}`);
  },
  clearCart: async () => {
    await api.delete('/cart');
  },
};
