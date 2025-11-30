import { prisma } from '../lib/prisma.js';

export const getScentProfile = async (req, res, next) => {
  try {
    const profile = await prisma.scentProfile.findUnique({
      where: { userId: req.user.id },
    });
    if (!profile) {
      // Retorna um perfil padrão se não existir
      return res.json({
        aroma_families: [],
        intensity_preference: "medium",
        favorite_notes: [],
        occasions: [],
        dislikes: []
      });
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateScentProfile = async (req, res, next) => {
  try {
    const profile = await prisma.scentProfile.upsert({
      where: { userId: req.user.id },
      update: req.body,
      create: {
        userId: req.user.id,
        ...req.body,
      },
    });
    res.json(profile);
  } catch (error) {
    next(error);
  }
};
