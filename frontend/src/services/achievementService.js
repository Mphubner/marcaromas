import api from '../lib/api';

export const achievementService = {
  getMyAchievements: async () => {
    const { data } = await api.get('/achievements/my-achievements');
    return data;
  },
};
