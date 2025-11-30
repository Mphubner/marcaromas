import api from '../lib/api';

const referralService = {
  /**
   * Get user's referral dashboard data
   * @returns {Promise} Dashboard data with stats, links, conversions
   */
  getMyDashboard: async () => {
    const response = await api.get('/referrals/my-dashboard');
    return response.data;
  },

  /**
   * Get detailed conversions list
   * @param {Object} params - Filter parameters
   * @param {string} params.status - Filter by status (PENDING, APPROVED, PAID, CANCELLED)
   * @param {string} params.dateFrom - Start date filter
   * @param {string} params.dateTo - End date filter
   * @param {number} params.limit - Number of results
   * @returns {Promise} Array of conversions
   */
  getMyConversions: async (params = {}) => {
    const response = await api.get('/referrals/my-conversions', { params });
    return response.data;
  },

  /**
   * Generate shareable link for platform
   * @param {string} platform - WHATSAPP, INSTAGRAM, FACEBOOK, EMAIL
   * @param {string} message - Optional custom message
   * @returns {Promise} Share URL and tracking code
   */
  generateShareLink: async (platform, message = null) => {
    const response = await api.post('/referrals/share', {
      platform,
      message
    });
    return response.data;
  },

  /**
   * Request payout of earnings
   * @param {Object} payoutData
   * @param {number} payoutData.amount - Amount to withdraw
   * @param {string} payoutData.method - PIX, BANK_TRANSFER, STORE_CREDIT
   * @param {string} payoutData.pixKey - PIX key (if method is PIX)
   * @returns {Promise} Payout request confirmation
   */
  requestPayout: async (payoutData) => {
    const response = await api.post('/referrals/request-payout', payoutData);
    return response.data;
  },

  /**
   * Get payout history
   * @returns {Promise} Array of payout requests
   */
  getMyPayouts: async () => {
    const response = await api.get('/referrals/my-payouts');
    return response.data;
  }
};

export default referralService;
