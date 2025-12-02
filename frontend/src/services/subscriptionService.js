import api from '../lib/api';

export const subscriptionService = {
  createSubscription: async (subscriptionData) => {
    const { data } = await api.post('/subscriptions', subscriptionData);
    return data;
  },

  getMySubscriptions: async () => {
    const { data } = await api.get('/subscriptions/my-subscriptions');
    return data;
  },

  getMySubscription: async () => {
    const { data } = await api.get('/subscriptions/my-subscription');
    return data;
  },

  updateSubscription: async (subscriptionId, updateData) => {
    const { data } = await api.patch(`/subscriptions/${subscriptionId}`, updateData);
    return data;
  },

  cancelSubscription: async (subscriptionId) => {
    await api.delete(`/subscriptions/${subscriptionId}`);
  },

  pauseSubscription: async (subscriptionId, reason) => {
    const { data } = await api.post(`/subscriptions/${subscriptionId}/pause`, { reason });
    return data;
  },

  resumeSubscription: async (subscriptionId) => {
    const { data } = await api.post(`/subscriptions/${subscriptionId}/resume`);
    return data;
  },

  changePlan: async (subscriptionId, newPlanId) => {
    const { data } = await api.post(`/subscriptions/${subscriptionId}/change-plan`, { newPlanId });
    return data;
  },
};

