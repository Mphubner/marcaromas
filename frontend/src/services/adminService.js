import api from '../lib/api';

export const adminService = {
  // Reviews
  getAllReviews: async (params) => {
    const { data } = await api.get('/reviews', { params });
    return data;
  },
  getReviewStats: async () => {
    const { data } = await api.get('/reviews/stats');
    return data;
  },
  approveReview: async (reviewId) => {
    const { data } = await api.patch(`/reviews/${reviewId}/approve`);
    return data;
  },
  respondToReview: async (reviewId, responseData) => {
    const { data } = await api.patch(`/reviews/${reviewId}/respond`, responseData);
    return data;
  },
  reportReview: async (reviewId, reportData) => {
    const { data } = await api.patch(`/reviews/${reviewId}/report`, reportData);
    return data;
  },
  bulkApproveReviews: async (reviewIds) => {
    const { data } = await api.post('/reviews/bulk-approve', { reviewIds });
    return data;
  },
  bulkRejectReviews: async (reviewIds) => {
    const { data } = await api.post('/reviews/bulk-reject', { reviewIds });
    return data;
  },
  deleteReview: async (reviewId) => {
    await api.delete(`/reviews/${reviewId}`);
  },

  // Orders
  getAllOrders: async () => {
    const { data } = await api.get('/orders');
    return data;
  },
  getOrderById: async (orderId) => {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  },
  updateOrder: async (orderId, updateData) => {
    const { data } = await api.patch(`/orders/${orderId}`, updateData);
    return data;
  },

  // Products
  getAllProducts: async () => {
    const { data } = await api.get('/products/admin');
    return data;
  },
  getProductById: async (productId) => {
    const { data } = await api.get(`/products/admin/${productId}`);
    return data;
  },
  createProduct: async (productData) => {
    const { data } = await api.post('/products', productData);
    return data;
  },
  updateProduct: async (productId, productData) => {
    const { data } = await api.patch(`/products/${productId}`, productData);
    return data;
  },
  deleteProduct: async (productId) => {
    await api.delete(`/products/${productId}`);
  },

  // Users
  getAllUsers: async (params) => {
    const { data } = await api.get('/users/admin', { params });
    return data;
  },
  getUserById: async (userId) => {
    const { data } = await api.get(`/users/admin/${userId}`);
    return data;
  },
  updateUser: async (userId, userData) => {
    const { data } = await api.patch(`/users/admin/${userId}`, userData);
    return data;
  },
  deleteUser: async (userId, soft = true) => {
    await api.delete(`/users/admin/${userId}`, { params: { soft } });
  },
  getUserOrders: async (userId, params) => {
    const { data } = await api.get(`/users/admin/${userId}/orders`, { params });
    return data;
  },
  getUserSubscriptions: async (userId) => {
    const { data } = await api.get(`/users/admin/${userId}/subscriptions`);
    return data;
  },

  // Coupons
  getAllCoupons: async (params) => {
    const { data } = await api.get('/coupons', { params });
    return data;
  },
  getCouponById: async (couponId) => {
    const { data } = await api.get(`/coupons/${couponId}`);
    return data;
  },
  getCouponStats: async () => {
    const { data } = await api.get('/coupons/stats');
    return data;
  },
  createCoupon: async (couponData) => {
    const { data } = await api.post('/coupons', couponData);
    return data;
  },
  updateCoupon: async (couponId, couponData) => {
    const { data } = await api.patch(`/coupons/${couponId}`, couponData);
    return data;
  },
  deleteCoupon: async (couponId) => {
    await api.delete(`/coupons/${couponId}`);
  },
  bulkToggleCoupons: async (couponIds, is_active) => {
    const { data } = await api.post('/coupons/bulk-toggle', { couponIds, is_active });
    return data;
  },

  // Referrals
  getAllReferrals: async (params) => {
    const { data } = await api.get('/admin/referrals', { params });
    return data;
  },
  getReferralStats: async () => {
    const { data } = await api.get('/admin/referrals/stats');
    return data;
  },
  getReferralById: async (referralId) => {
    const { data } = await api.get(`/admin/referrals/${referralId}`);
    return data;
  },
  createReferral: async (referralData) => {
    const { data } = await api.post('/admin/referrals', referralData);
    return data;
  },
  updateReferral: async (referralId, referralData) => {
    const { data } = await api.patch(`/admin/referrals/${referralId}`, referralData);
    return data;
  },
  markReferralAsPaid: async (referralId) => {
    const { data } = await api.post(`/admin/referrals/${referralId}/mark-paid`);
    return data;
  },

  // Referral Programs
  getReferralPrograms: async () => {
    const { data } = await api.get('/admin/referrals/programs');
    return data;
  },
  createReferralProgram: async (programData) => {
    const { data } = await api.post('/admin/referrals/programs', programData);
    return data;
  },
  updateReferralProgram: async (programId, programData) => {
    const { data } = await api.put(`/admin/referrals/programs/${programId}`, programData);
    return data;
  },
  deleteReferralProgram: async (programId) => {
    await api.delete(`/admin/referrals/programs/${programId}`);
  },

  // Referral Analytics
  getTopReferrers: async (limit = 10) => {
    const { data } = await api.get('/admin/referrals/analytics/top-referrers', {
      params: { limit }
    });
    return data;
  },
  getRevenueTimeline: async (dateFrom, dateTo) => {
    const { data } = await api.get('/admin/referrals/analytics/revenue-timeline', {
      params: { dateFrom, dateTo }
    });
    return data;
  },

  // Referral Payouts
  getReferralPayouts: async (status) => {
    const { data } = await api.get('/admin/referrals/payouts', {
      params: { status }
    });
    return data;
  },
  processReferralPayout: async (payoutId, notes) => {
    const { data } = await api.post(`/admin/referrals/payouts/${payoutId}/process`, { notes });
    return data;
  },
  batchProcessPayouts: async (conversionIds, payoutMethod) => {
    const { data } = await api.post('/admin/referrals/batch-payout', {
      conversionIds,
      payoutMethod
    });
    return data;
  },

  // Social Media Mentions
  getSocialMediaMentions: async (filters) => {
    const { data } = await api.get('/admin/referrals/social-mentions', {
      params: filters
    });
    return data;
  },
  approveSocialMention: async (mentionId, rewardAmount) => {
    const { data } = await api.post(`/admin/referrals/social-mentions/${mentionId}/approve`, {
      rewardAmount
    });
    return data;
  },
  rejectSocialMention: async (mentionId) => {
    const { data } = await api.post(`/admin/referrals/social-mentions/${mentionId}/reject`);
    return data;
  },

  // Analytics
  getAnalyticsData: async () => {
    const { data } = await api.get('/analytics');
    return data;
  },

  // Config
  getAllSettings: async () => {
    const { data } = await api.get('/config');
    return data;
  },
  updateSettings: async (settingsData) => {
    const { data } = await api.post('/config', settingsData);
    return data;
  },

  // Content
  getAllContent: async () => {
    const { data } = await api.get('/content');
    return data;
  },
  createContent: async (contentData) => {
    const { data } = await api.post('/content', contentData);
    return data;
  },
  updateContent: async (contentId, contentData) => {
    const { data } = await api.patch(`/content/${contentId}`, contentData);
    return data;
  },
  deleteContent: async (contentId) => {
    await api.delete(`/content/${contentId}`);
  },

  // Boxes
  getAllBoxes: async () => {
    const { data } = await api.get('/boxes');
    return data;
  },
  createBox: async (boxData) => {
    const { data } = await api.post('/boxes', boxData);
    return data;
  },
  // Plans (admin)
  getAllPlansAdmin: async () => {
    const { data } = await api.get('/plans/admin');
    return data;
  },
  getPlanById: async (id) => {
    const { data } = await api.get(`/plans/${id}`);
    return data;
  },
  createPlan: async (planData) => {
    const { data } = await api.post('/plans', planData);
    return data;
  },
  updatePlan: async (id, planData) => {
    const { data } = await api.patch(`/plans/${id}`, planData);
    return data;
  },
  deletePlan: async (id) => {
    await api.delete(`/plans/${id}`);
  },
  updateBox: async (boxId, boxData) => {
    const { data } = await api.patch(`/boxes/${boxId}`, boxData);
    return data;
  },
  deleteBox: async (boxId) => {
    await api.delete(`/boxes/${boxId}`);
  },
};
