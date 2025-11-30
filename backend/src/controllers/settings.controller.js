import { prisma } from '../lib/prisma.js';

export const getSettingsBySection = async (req, res, next) => {
  try {
    const { section } = req.params;
    const settings = await prisma.siteSettings.findUnique({
      where: { section },
    });

    if (!settings) {
      // Retornar um objeto vazio ou um erro? Por enquanto, um objeto vazio.
      return res.json({});
    }

    res.json(settings.content);
  } catch (error) {
    next(error);
  }
};
