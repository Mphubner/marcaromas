import api from '../lib/api';

export const userService = {
  getMyProfile: async () => {
    const { data } = await api.get('/users/profile');
    return data;
  },
  updateMyProfile: async (profileData) => {
    const { data } = await api.patch('/users/profile', profileData);
    return data;
  },
};
