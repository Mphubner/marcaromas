import { prisma } from '../lib/prisma.js';

// ============ USER ENDPOINTS ============

export const createOrder = async (req, res, next) => {
  try {
    const { items, subtotal, shippingCost, total, shippingAddress, couponCode } = req.body;
    const user = req.user;

    // Gerar orderNumber único
    const lastOrder = await prisma.order.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true }
    });
    const nextId = (lastOrder?.id || 0) + 1;
    const orderNumber = `ORD-2025-${String(nextId).padStart(6, '0')}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        subtotal: subtotal || 0,
        shippingCost: shippingCost || 0,
        total,
        couponCode,
        status: 'pending',
        channel: 'website',
        deliveryAddress: shippingAddress, // Usar o novo campo
        shippingAddress, // Manter compatibilidade
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
      },
    });

    // Limpar carrinho
    const cart = await prisma.cart.findFirst({ where: { userId: user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const user = req.user;
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// ============ ADMIN ENDPOINTS ============

// Listar todos os pedidos (admin)
export const getAllOrders = async (req, res, next) => {
  try {
    const { search, status, channel, paymentMethod, dateFrom, dateTo } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { tracking_code: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) where.status = status;
    if (channel) where.channel = channel;
    if (paymentMethod) where.paymentMethod = paymentMethod;

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const orders = await prisma.order.findMany({
      where,
      select: {
        id: true,
        orderNumber: true,
        createdAt: true,
        status: true,
        total: true,
        paymentStatus: true,
        paymentMethod: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            }
          }
        },
        _count: {
          select: {
            history: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Buscar pedido por ID (admin)
export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        },
        history: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Atualizar pedido (admin) - genérico
export const updateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;

    // Adicionar updatedAt automaticamente
    updateData.updatedAt = new Date();

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: updateData,
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// Atualizar status do pedido (admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;

    const updateData = {
      status,
      updatedAt: new Date()
    };

    // Adicionar timestamps específicos baseado no status
    if (status === 'confirmed') {
      updateData.confirmedAt = new Date();
    } else if (status === 'shipped') {
      updateData.shippedAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    } else if (status === 'canceled' && !updateData.canceledAt) {
      updateData.canceledAt = new Date();
    }

    if (notes) {
      updateData.notes = notes;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: updateData,
    });

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// Atualizar informações de envio (admin)
export const updateOrderShipping = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { carrier, shippingMethod, tracking_code, estimatedDeliveryDate } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        carrier,
        shippingMethod,
        tracking_code,
        estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : undefined,
        shippedAt: new Date(), // Marca como enviado ao adicionar tracking
        status: 'shipped',
        updatedAt: new Date()
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// Gerar etiqueta de envio (admin)
export const generateShippingLabel = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // Aqui você integraria com API de transportadora
    // Por ora, apenas marca que foi gerada
    const labelUrl = `https://storage.example.com/labels/ORD-${orderId}.pdf`;

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        labelUrl,
        labelGeneratedAt: new Date(),
        updatedAt: new Date()
      },
    });

    res.json({ labelUrl, order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

// Cancelar pedido (admin)
export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { cancellationReason } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: 'canceled',
        canceledAt: new Date(),
        cancellationReason,
        updatedAt: new Date()
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// Processar reembolso (admin)
export const refundOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { refundAmount, notes } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) }
    });

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: 'refunded',
        paymentStatus: 'refunded',
        refundedAt: new Date(),
        refundAmount: refundAmount || order.total,
        notes: notes || order.notes,
        updatedAt: new Date()
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// Adicionar observação ao pedido (admin)
export const addOrderNote = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { note } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      select: { notes: true }
    });

    const existingNotes = order?.notes || '';
    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] ${note}`;
    const updatedNotes = existingNotes ? `${existingNotes}\n${newNote}` : newNote;

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        notes: updatedNotes,
        updatedAt: new Date()
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
