import { prisma } from '../lib/prisma.js';
import { achievementService } from '../services/achievement.service.js';

/**
 * Get all achievements with user's progress
 */
export const getMyAchievements = async (req, res, next) => {
  try {
    const user = req.user;
    const { category } = req.query;

    // Update all achievements first
    await achievementService.updateAllAchievements(user.id);

    // Build query
    const where = category ? { category: category.toUpperCase() } : {};

    // Get all achievements
    const achievements = await prisma.achievement.findMany({
      where,
      orderBy: [{ points: 'asc' }, { createdAt: 'asc' }],
    });

    // Get user's progress for each achievement
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: user.id },
    });

    // Map user progress to achievements
    const achievementsWithProgress = achievements.map(achievement => {
      const userAchievement = userAchievements.find(
        ua => ua.achievementId === achievement.id
      );

      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        tier: achievement.tier,
        points: achievement.points,
        progress: userAchievement?.progress || 0,
        total: achievement.requirementTarget,
        unlocked: userAchievement?.unlocked || false,
        unlockedAt: userAchievement?.unlockedAt,
      };
    });

    res.json(achievementsWithProgress);
  } catch (error) {
    next(error);
  }
};

/**
 * Get only unlocked achievements
 */
export const getMyUnlockedAchievements = async (req, res, next) => {
  try {
    const user = req.user;

    const userAchievements = await prisma.userAchievement.findMany({
      where: {
        userId: user.id,
        unlocked: true,
      },
      include: {
        achievement: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });

    const achievements = userAchievements.map(ua => ({
      id: ua.achievement.id,
      name: ua.achievement.name,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      category: ua.achievement.category,
      tier: ua.achievement.tier,
      points: ua.achievement.points,
      unlockedAt: ua.unlockedAt,
    }));

    res.json(achievements);
  } catch (error) {
    next(error);
  }
};

/**
 * Get progress for a specific achievement
 */
export const getAchievementProgress = async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const achievement = await prisma.achievement.findUnique({
      where: { id },
    });

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    const userAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: user.id,
          achievementId: id,
        },
      },
    });

    res.json({
      achievement: {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        tier: achievement.tier,
        points: achievement.points,
        requirementTarget: achievement.requirementTarget,
      },
      progress: userAchievement?.progress || 0,
      unlocked: userAchievement?.unlocked || false,
      unlockedAt: userAchievement?.unlockedAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get leaderboard
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10, category } = req.query;

    // Get all users with their achievements
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        userAchievements: {
          where: {
            unlocked: true,
            ...(category && {
              achievement: {
                category: category.toUpperCase(),
              },
            }),
          },
          include: {
            achievement: {
              select: {
                points: true,
                category: true,
              },
            },
          },
        },
      },
    });

    // Calculate points and filter
    const usersWithPoints = users
      .map(user => ({
        id: user.id,
        name: user.name,
        points: user.userAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0),
        achievementCount: user.userAchievements.length,
      }))
      .filter(user => user.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, parseInt(limit));

    // Add rank
    const leaderboard = usersWithPoints.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
};

/**
 * Get available rewards based on user points
 */
export const getAvailableRewards = async (req, res, next) => {
  try {
    const user = req.user;

    // Calculate user's total points
    const totalPoints = await achievementService.calculateUserPoints(user.id);

    // Get all active rewards
    const rewards = await prisma.achievementReward.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        requiredPoints: 'asc',
      },
    });

    // Map rewards with eligibility
    const rewardsWithEligibility = rewards.map(reward => ({
      id: reward.id,
      name: reward.name,
      description: reward.description,
      type: reward.type,
      value: reward.value,
      requiredPoints: reward.requiredPoints,
      eligible: totalPoints >= reward.requiredPoints,
    }));

    res.json({
      totalPoints,
      rewards: rewardsWithEligibility,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Claim a reward
 */
export const claimReward = async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;

    // Get reward
    const reward = await prisma.achievementReward.findUnique({
      where: { id },
    });

    if (!reward || !reward.isActive) {
      return res.status(404).json({ message: 'Reward not found or inactive' });
    }

    // Check if user has enough points
    const totalPoints = await achievementService.calculateUserPoints(user.id);

    if (totalPoints < reward.requiredPoints) {
      return res.status(400).json({
        message: 'Insufficient points',
        required: reward.requiredPoints,
        current: totalPoints,
      });
    }

    // TODO: Implement reward claiming logic
    // - For DISCOUNT: Create a coupon code
    // - For CREDIT: Add credits to user account
    // - For FREE_SHIPPING: Create shipping coupon
    // - For EXCLUSIVE_CONTENT: Grant access

    res.json({
      message: 'Reward claimed successfully',
      reward: {
        id: reward.id,
        name: reward.name,
        type: reward.type,
        value: reward.value,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's achievement stats
 */
export const getMyStats = async (req, res, next) => {
  try {
    const user = req.user;

    const totalPoints = await achievementService.calculateUserPoints(user.id);
    const rankInfo = await achievementService.getUserRank(user.id);

    const totalAchievements = await prisma.achievement.count();
    const unlockedCount = await prisma.userAchievement.count({
      where: {
        userId: user.id,
        unlocked: true,
      },
    });

    res.json({
      totalPoints,
      rank: rankInfo.rank,
      totalUsers: rankInfo.totalUsers,
      achievementsUnlocked: unlockedCount,
      totalAchievements,
      completionPercentage: Math.round((unlockedCount / totalAchievements) * 100),
    });
  } catch (error) {
    next(error);
  }
};
