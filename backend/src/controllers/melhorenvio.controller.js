import * as melhorEnvioService from '../services/melhorenvio.service.js';
import { prisma } from '../lib/prisma.js';

/**
 * POST /api/melhor-envio/calculate
 * Calculate shipping rates
 */
export const calculateShipping = async (req, res, next) => {
  try {
    // Validate Melhor Envio token
    if (!process.env.MELHOR_ENVIO_TOKEN) {
      return res.status(503).json({
        error: 'shipping_not_configured',
        message: 'Serviço de frete não está configurado.',
      });
    }

    const { from, to, package: pkg } = req.body;

    // Validate required fields
    if (!to?.postalCode || !pkg) {
      return res.status(400).json({
        error: 'missing_fields',
        message: 'CEP de destino e informações do pacote são obrigatórios.',
      });
    }

    // Default from address (your warehouse)
    const fromAddress = from || {
      postalCode: process.env.WAREHOUSE_POSTAL_CODE || '01310-100',
    };

    const rates = await melhorEnvioService.calculateShipping({
      from: fromAddress,
      to,
      package: pkg,
    });

    res.json({
      ok: true,
      rates,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/melhor-envio/create-order
 * Create shipping order and generate label
 */
export const createShippingOrder = async (req, res, next) => {
  try {
    if (!process.env.MELHOR_ENVIO_TOKEN) {
      return res.status(503).json({
        error: 'shipping_not_configured',
        message: 'Serviço de frete não está configurado.',
      });
    }

    const { orderId, serviceId, shippingData } = req.body;

    if (!orderId || !serviceId) {
      return res.status(400).json({
        error: 'missing_fields',
        message: 'ID do pedido e serviço de frete são obrigatórios.',
      });
    }

    // Find order
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { items: { include: { product: true } }, user: true },
    });

    if (!order) {
      return res.status(404).json({
        error: 'order_not_found',
        message: 'Pedido não encontrado.',
      });
    }

    // Prepare shipping data
    const orderData = {
      serviceId,
      from: shippingData?.from || {
        name: 'Marc Aromas',
        phone: process.env.WAREHOUSE_PHONE || '11999999999',
        email: process.env.WAREHOUSE_EMAIL || 'contato@marcaromas.com',
        document: process.env.WAREHOUSE_DOCUMENT || '00000000000000',
        address: process.env.WAREHOUSE_ADDRESS || 'Rua Exemplo',
        number: process.env.WAREHOUSE_NUMBER || '100',
        complement: process.env.WAREHOUSE_COMPLEMENT || '',
        district: process.env.WAREHOUSE_DISTRICT || 'Centro',
        city: process.env.WAREHOUSE_CITY || 'São Paulo',
        state: process.env.WAREHOUSE_STATE || 'SP',
        postalCode: process.env.WAREHOUSE_POSTAL_CODE || '01310-100',
      },
      to: {
        name: order.shippingAddress?.name || order.user.name,
        phone: order.shippingAddress?.phone || '11999999999',
        email: order.user.email,
        document: order.shippingAddress?.document || '00000000000',
        address: order.shippingAddress?.street || '',
        number: order.shippingAddress?.number || '',
        complement: order.shippingAddress?.complement || '',
        district: order.shippingAddress?.neighborhood || '',
        city: order.shippingAddress?.city || '',
        state: order.shippingAddress?.state || '',
        postalCode: order.shippingAddress?.zipCode || '',
      },
      products: order.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        unitaryValue: parseFloat(item.price),
      })),
      volumes: [{
        height: shippingData?.package?.height || 10,
        width: shippingData?.package?.width || 20,
        length: shippingData?.package?.length || 30,
        weight: shippingData?.package?.weight || 0.5,
      }],
      insuranceValue: parseFloat(order.total) || 0,
      receipt: shippingData?.receipt || false,
      ownHand: shippingData?.ownHand || false,
    };

    const shipping = await melhorEnvioService.createShippingOrder(orderData);

    // Update order with shipping info
    await prisma.order.update({
      where: { id: order.id },
      data: {
        shippingDetails: {
          melhorEnvioId: shipping.id,
          protocol: shipping.protocol,
          status: shipping.status,
        },
      },
    });

    res.json({
      ok: true,
      shipping,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/melhor-envio/tracking/:code
 * Get tracking information
 */
export const getTracking = async (req, res, next) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        error: 'missing_code',
        message: 'Código de rastreamento é obrigatório.',
      });
    }

    const tracking = await melhorEnvioService.getTrackingInfo(code);

    if (!tracking) {
      return res.status(404).json({
        error: 'tracking_not_found',
        message: 'Informações de rastreamento não encontradas.',
      });
    }

    res.json({
      ok: true,
      tracking,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/melhor-envio/cancel
 * Cancel shipping
 */
export const cancelShipping = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        error: 'missing_order_id',
        message: 'ID do envio é obrigatório.',
      });
    }

    await melhorEnvioService.cancelShipping(orderId);

    res.json({
      ok: true,
      message: 'Envio cancelado com sucesso.',
    });

  } catch (error) {
    next(error);
  }
};

export default {
  calculateShipping,
  createShippingOrder,
  getTracking,
  cancelShipping,
};
