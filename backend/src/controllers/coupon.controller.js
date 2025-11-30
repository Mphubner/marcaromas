import { prisma } from '../lib/prisma.js';

// (Admin) Listar todos os cupons com filtros
export const getAllCoupons = async (req, res, next) => {
  try {
    const { search, type, status, expiringSoon } = req.query;

    const where = {};

    if (search) {
      where.code = { contains: search, mode: 'insensitive' };
    }

    if (type) {
      where.type = type;
    }

    if (status === 'active') {
      where.is_active = true;
    } else if (status === 'inactive') {
      where.is_active = false;
    }

    // Expiring soon: next 7 days
    if (expiringSoon === 'true') {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      where.expiry_date = {
        gte: new Date(),
        lte: sevenDaysFromNow,
      };
      where.is_active = true;
    }

    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

// (Admin) Obter um cupom específico
export const getCouponById = async (req, res, next) => {
  try {
    const { couponId } = req.params;
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Cupom não encontrado' });
    }

    res.json(coupon);
  } catch (error) {
    next(error);
  }
};

// (Admin) Obter estatísticas de cupons
export const getCouponStats = async (req, res, next) => {
  try {
    const totalCoupons = await prisma.coupon.count();
    const activeCoupons = await prisma.coupon.count({
      where: { is_active: true },
    });

    const coupons = await prisma.coupon.findMany({
      select: { times_used: true, amount: true, type: true },
    });

    const totalUsage = coupons.reduce((sum, c) => sum + c.times_used, 0);

    // Estimate total discount given (rough calculation)
    const totalDiscountGiven = coupons.reduce((sum, c) => {
      if (c.type === 'percent') {
        return sum + (c.times_used * c.amount * 50); // Assumed avg order $50
      } else if (c.type === 'fixed') {
        return sum + (c.times_used * c.amount);
      }
      return sum;
    }, 0);

    res.json({
      totalCoupons,
      activeCoupons,
      totalUsage,
      totalDiscountGiven: parseFloat(totalDiscountGiven.toFixed(2)),
    });
  } catch (error) {
    next(error);
  }
};

// (Admin) Criar um novo cupom
export const createCoupon = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      code: req.body.code.toUpperCase(), // Always uppercase
    };

    const newCoupon = await prisma.coupon.create({ data });
    res.status(201).json(newCoupon);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Código de cupom já existe' });
    }
    next(error);
  }
};

// (Admin) Atualizar um cupom
export const updateCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params;
    const data = { ...req.body };

    if (data.code) {
      data.code = data.code.toUpperCase();
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id: couponId },
      data,
    });

    res.json(updatedCoupon);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Cupom não encontrado' });
    }
    next(error);
  }
};

// (Admin) Deletar um cupom
export const deleteCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params;
    await prisma.coupon.delete({
      where: { id: couponId },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Cupom não encontrado' });
    }
    next(error);
  }
};

// (Admin) Alternar status de múltiplos cupons
export const bulkToggleStatus = async (req, res, next) => {
  try {
    const { couponIds, is_active } = req.body;

    if (!Array.isArray(couponIds) || couponIds.length === 0) {
      return res.status(400).json({ error: 'Nenhum cupom fornecido' });
    }

    await prisma.coupon.updateMany({
      where: { id: { in: couponIds } },
      data: { is_active },
    });

    res.json({ updated: couponIds.length });
  } catch (error) {
    next(error);
  }
};

// (Admin) Importar cupons em lote
export const bulkImportCoupons = async (req, res, next) => {
  try {
    const { codes, type = 'percent', amount = 10 } = req.body;

    if (!Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({ error: 'Nenhum código fornecido.' });
    }

    const created = await Promise.all(
      codes.map(code =>
        prisma.coupon.create({
          data: {
            code: code.toUpperCase(),
            type,
            amount,
            is_active: true,
          },
        })
      )
    );

    res.json({ imported: created.length });
  } catch (error) {
    next(error);
  }
};

// (Público) Validar um cupom
export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { cartTotal, userEmail, productIds } = req.query;

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Cupom não encontrado' });
    }

    // Validações
    if (!coupon.is_active) {
      return res.status(400).json({ message: 'Cupom inativo' });
    }

    // Check start date
    if (coupon.startDate && new Date(coupon.startDate) > new Date()) {
      return res.status(400).json({ message: 'Cupom ainda não está ativo' });
    }

    // Check expiry date
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return res.status(400).json({ message: 'Cupom expirado' });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return res.status(400).json({ message: 'Limite de uso atingido' });
    }

    // Check minimum purchase
    if (coupon.min_purchase && parseFloat(cartTotal) < coupon.min_purchase) {
      return res.status(400).json({
        message: `Compra mínima de R$ ${coupon.min_purchase.toFixed(2)} necessária`
      });
    }

    // Check user-specific
    if (coupon.userSpecific?.length > 0 && userEmail) {
      if (!coupon.userSpecific.includes(userEmail)) {
        return res.status(400).json({ message: 'Cupom não disponível para este usuário' });
      }
    }

    // Check product-specific
    if (coupon.applies_to === 'specific' && coupon.specific_ids?.length > 0 && productIds) {
      const productIdsArray = Array.isArray(productIds) ? productIds : [productIds];
      const hasValidProduct = productIdsArray.some(id => coupon.specific_ids.includes(id));

      if (!hasValidProduct) {
        return res.status(400).json({ message: 'Cupom não aplicável aos produtos no carrinho' });
      }
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        amount: coupon.amount,
        maxDiscountAmount: coupon.maxDiscountAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};
