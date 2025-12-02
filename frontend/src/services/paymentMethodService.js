// Payment Method Service
import api from '../lib/api';

export const paymentMethodService = {
    // Get all user payment methods
    getMyMethods: async () => {
        const response = await api.get('/payment-methods/my');
        return response.data;
    },

    // Add new payment method
    add: async (data) => {
        const response = await api.post('/payment-methods', data);
        return response.data;
    },

    // Delete payment method
    delete: async (id) => {
        const response = await api.delete(`/payment-methods/${id}`);
        return response.data;
    },

    // Set default payment method
    setDefault: async (id) => {
        const response = await api.put(`/payment-methods/${id}/set-default`);
        return response.data;
    }
};
