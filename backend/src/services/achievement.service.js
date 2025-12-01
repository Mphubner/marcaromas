import { prisma } from '../lib/prisma.js';

/**
 * Achievement Service
 * Handles achievement progress tracking and unlocking logic
 */

export const achievementService = {
    /**
     * Track user progress and auto-unlock achievements
     */
    async trackProgress(userId, type, currentValue) {
        try {
            // Find relevant achievements
            const achievements = await prisma.achievement.findMany({
                where: { requirementType: type },
            });

            for (const achievement of achievements) {
                // Get or create user achievement
                let userAchievement = await prisma.userAchievement.findUnique({
                    where: {
                        userId_achievementId: {
                            userId,
                            achievementId: achievement.id,
                        },
                    },
                });

                if (!userAchievement) {
                    userAchievement = await prisma.userAchievement.create({
                        data: {
                            userId,
                            achievementId: achievement.id,
                            progress: currentValue,
                            unlocked: currentValue >= achievement.requirementTarget,
                            unlockedAt: currentValue >= achievement.requirementTarget ? new Date() : null,
                        },
                    });
                } else if (!userAchievement.unlocked) {
                    // Update progress
                    const unlocked = currentValue >= achievement.requirementTarget;
                    userAchievement = await prisma.userAchievement.update({
                        where: { id: userAchievement.id },
                        data: {
                            progress: currentValue,
                            unlocked,
                            unlockedAt: unlocked ? new Date() : null,
                        },
                    });
                }
            }
        } catch (error) {
            console.error('Error tracking achievement progress:', error);
        }
    },

    /**
     * Calculate total points for a user
     */
    async calculateUserPoints(userId) {
        const userAchievements = await prisma.userAchievement.findMany({
            where: {
                userId,
                unlocked: true,
            },
            include: {
                achievement: true,
            },
        });

        return userAchievements.reduce((total, ua) => total + ua.achievement.points, 0);
    },

    /**
     * Get user's rank in leaderboard
     */
    async getUserRank(userId) {
        // Get all users with their points
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                userAchievements: {
                    where: { unlocked: true },
                    include: {
                        achievement: {
                            select: { points: true },
                        },
                    },
                },
            },
        });

        // Calculate points for each user
        const usersWithPoints = users.map(user => ({
            id: user.id,
            name: user.name,
            points: user.userAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0),
        }));

        // Sort by points
        usersWithPoints.sort((a, b) => b.points - a.points);

        // Find user's rank
        const rank = usersWithPoints.findIndex(u => u.id === userId) + 1;

        return {
            rank,
            totalUsers: usersWithPoints.length,
            points: usersWithPoints.find(u => u.id === userId)?.points || 0,
        };
    },

    /**
     * Get progress for specific achievement type
     */
    async getProgressValue(userId, type) {
        switch (type) {
            case 'purchase_count': {
                const count = await prisma.order.count({
                    where: {
                        userId,
                        status: 'DELIVERED',
                    },
                });
                return count;
            }

            case 'subscription_months': {
                const subscription = await prisma.subscription.findFirst({
                    where: {
                        userId,
                        status: 'ACTIVE',
                    },
                    orderBy: {
                        startedAt: 'asc',
                    },
                });

                if (!subscription) return 0;

                const monthsDiff = Math.floor(
                    (new Date() - new Date(subscription.startedAt)) / (1000 * 60 * 60 * 24 * 30)
                );
                return Math.max(0, monthsDiff);
            }

            case 'review_count': {
                const count = await prisma.review.count({
                    where: {
                        userEmail: (await prisma.user.findUnique({ where: { id: userId } }))?.email,
                        is_approved: true,
                    },
                });
                return count;
            }

            case 'referral_count': {
                const count = await prisma.referralConversion.count({
                    where: {
                        referrer_user_id: userId,
                        conversion_type: 'PURCHASE',
                    },
                });
                return count;
            }

            case 'product_collection': {
                const orders = await prisma.order.findMany({
                    where: {
                        userId,
                        status: 'DELIVERED',
                    },
                    include: {
                        items: {
                            select: {
                                productId: true,
                            },
                        },
                    },
                });

                const uniqueProducts = new Set();
                orders.forEach(order => {
                    order.items.forEach(item => {
                        uniqueProducts.add(item.productId);
                    });
                });

                return uniqueProducts.size;
            }

            default:
                return 0;
        }
    },

    /**
     * Update all achievements for a user
     */
    async updateAllAchievements(userId) {
        const achievementTypes = [
            'purchase_count',
            'subscription_months',
            'review_count',
            'referral_count',
            'product_collection',
        ];

        for (const type of achievementTypes) {
            const value = await this.getProgressValue(userId, type);
            await this.trackProgress(userId, type, value);
        }
    },
};
