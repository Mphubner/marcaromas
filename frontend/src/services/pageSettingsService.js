import api from '../lib/api';

export const pageSettingsService = {
  getHeroSettings: async () => {
    // Assumindo que este endpoint será criado no backend
    const { data } = await api.get('/page-settings/hero');
    return data;
  },
};
