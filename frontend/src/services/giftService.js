import api from '../lib/api';

export const giftService = {
    // Create a gift subscription
    createGift: async (giftData) => {
        const { data } = await api.post('/gifts', giftData);
        return data;
    },

    // Get gift by ID
    getGiftById: async (giftId) => {
        const { data } = await api.get(`/gifts/${giftId}`);
        return data;
    },

    // Send gift notification to recipient
    sendGiftNotification: async (giftId) => {
        const { data } = await api.post(`/gifts/${giftId}/notify`);
        return data;
    },

    // Get installment options from Mercado Pago
    getInstallmentOptions: async (amount) => {
        const { data } = await api.get(`/payment/installments?amount=${amount}`);
        return data;
    },
};
