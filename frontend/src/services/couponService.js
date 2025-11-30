import api from '../lib/api';

export const couponService = {
  validateCoupon: async (code) => {
    const { data } = await api.get(`/coupons/validate/${code}`);
    return data;
  },
};
