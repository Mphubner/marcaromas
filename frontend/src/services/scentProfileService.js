import api from '../lib/api';

export const scentProfileService = {
  getMyProfile: async () => {
    const { data } = await api.get('/users/scent-profile');
    return data;
  },
  updateMyProfile: async (profileData) => {
    const { data } = await api.post('/users/scent-profile', profileData);
    return data;
  },
};
