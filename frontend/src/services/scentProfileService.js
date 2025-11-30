import api from '../lib/api';

export const scentProfileService = {
  getMyProfile: async () => {
    const { data } = await api.get('/user/scent-profile');
    return data;
  },
  updateMyProfile: async (profileData) => {
    const { data } = await api.post('/user/scent-profile', profileData);
    return data;
  },
};
