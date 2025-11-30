import api from '../lib/api';

export const contactService = {
  submitForm: async (formData) => {
    const { data } = await api.post('/contact', formData);
    return data;
  },
};
