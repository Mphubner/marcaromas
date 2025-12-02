// Address Service
import api from '../lib/api';

export const addressService = {
    // Get all user addresses
    getMyAddresses: async () => {
        const response = await api.get('/addresses/my');
        return response.data;
    },

    // Get single address
    getById: async (id) => {
        const response = await api.get(`/addresses/${id}`);
        return response.data;
    },

    // Create new address
    create: async (data) => {
        const response = await api.post('/addresses', data);
        return response.data;
    },

    // Update address
    update: async (id, data) => {
        const response = await api.put(`/addresses/${id}`, data);
        return response.data;
    },

    // Delete address
    delete: async (id) => {
        const response = await api.delete(`/addresses/${id}`);
        return response.data;
    },

    // Set default address
    setDefault: async (id) => {
        const response = await api.put(`/addresses/${id}/set-default`);
        return response.data;
    }
};
