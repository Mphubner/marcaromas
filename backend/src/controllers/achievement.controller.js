import { prisma } from '../lib/prisma.js';

export const getMyAchievements = async (req, res, next) => {
  try {
    const user = req.user;
    const achievements = await prisma.achievement.findMany({
      where: { userEmail: user.email },
      orderBy: { createdAt: 'desc' },
    });
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};
