import api from '../lib/api';

export const reviewService = {
  getApprovedReviews: async () => {
    const { data } = await api.get('/reviews/approved-reviews');
    return data;
  },
};
