import api from '../lib/api';

export const userService = {
  getMyProfile: async () => {
    const { data } = await api.get('/user/profile');
    return data;
  },
  updateMyProfile: async (profileData) => {
    const { data } = await api.patch('/user/profile', profileData);
    return data;
  },
};
