import api from '../lib/api';

export const boxService = {
  getCurrentBox: async () => {
    // Assumindo que este endpoint será criado no backend
    const { data } = await api.get('/boxes/current');
    return data;
  },
};
