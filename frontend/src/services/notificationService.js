import api from '../lib/api';

export const notificationService = {
  getMyNotifications: async () => {
    const { data } = await api.get('/notifications');
    return data;
  },
  markAsRead: async (notificationId) => {
    const { data } = await api.patch(`/notifications/${notificationId}/read`);
    return data;
  },
};
