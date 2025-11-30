import { prisma } from '../lib/prisma.js';

// (Admin) Buscar todas as configurações
export const getAllSettings = async (req, res, next) => {
  try {
    const settings = await prisma.config.findMany();
    // Transforma o array em um objeto para facilitar o acesso no frontend
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    res.json(settingsObj);
  } catch (error) {
    next(error);
  }
};

// (Admin) Atualizar configurações
export const updateSettings = async (req, res, next) => {
  try {
    const settings = req.body; // Ex: { MP_PUBLIC_KEY: '...', MP_ACCESS_TOKEN: '...' }

    for (const key in settings) {
      await prisma.config.upsert({
        where: { key },
        update: { value: settings[key] },
        create: { key, value: settings[key] },
      });
    }

    res.json({ message: 'Configurações atualizadas com sucesso.' });
  } catch (error) {
    next(error);
  }
};

// (Public) Get config for homepage (welcome popup)
export const getPublicConfig = async (req, res, next) => {
  try {
    // Get welcome coupon (with first_purchase flag or specific code)
    const welcomeCoupon = await prisma.coupon.findFirst({
      where: {
        is_active: true,
        code: { contains: 'BEMVINDO', mode: 'insensitive' } // Find welcome coupon by code pattern
      }
    });

    // Get shipping config
    const shippingConfig = await prisma.config.findFirst({
      where: { key: 'free_shipping_minimum' }
    });

    res.json({
      welcomeCoupon: welcomeCoupon ? {
        code: welcomeCoupon.code,
        discount: welcomeCoupon.discount_value,
        type: welcomeCoupon.discount_type
      } : null,
      freeShippingMinimum: shippingConfig ? parseFloat(shippingConfig.value) : 199
    });
  } catch (error) {
    console.error('Error fetching public config:', error);
    next(error);
  }
};
