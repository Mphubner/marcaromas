import api from '../lib/api';

export const achievementService = {
  /**
   * Get all achievements with user progress
   */
  getMyAchievements: async (category = null) => {
    const params = category ? { category } : {};
    const { data } = await api.get('/achievements/my-achievements', { params });
    return data;
  },

  /**
   * Get only unlocked achievements
   */
  getUnlockedAchievements: async () => {
    const { data } = await api.get('/achievements/unlocked');
    return data;
  },

  /**
   * Get progress for specific achievement
   */
  getProgress: async (id) => {
    const { data } = await api.get(`/achievements/progress/${id}`);
    return data;
  },

  /**
   * Get leaderboard
   */
  getLeaderboard: async (limit = 10, category = null) => {
    const params = { limit };
    if (category) params.category = category;
    const { data } = await api.get('/achievements/leaderboard', { params });
    return data;
  },

  /**
   * Get user's achievement stats
   */
  getMyStats: async () => {
    const { data } = await api.get('/achievements/my-stats');
    return data;
  },

  /**
   * Get available rewards
   */
  getRewards: async () => {
    const { data } = await api.get('/achievements/rewards');
    return data;
  },

  /**
   * Claim a reward
   */
  claimReward: async (rewardId) => {
    const { data } = await api.post(`/achievements/rewards/${rewardId}/claim`);
    return data;
  },
};
