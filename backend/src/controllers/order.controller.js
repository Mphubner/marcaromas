import prisma from "../config/db.js";
import { createPaymentSession } from "../utils/paymentService.js";

export async function createOrderAndPayment(req, res, next) {
  try {
    const { userId, items } = req.body; // items: [{ productId, quantity }]
    if (!items || !items.length) return res.status(400).json({ error: "Nenhum item" });

    // calculate total and fetch products
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } }});
    const itemsForPayment = items.map((it) => {
      const p = products.find((x) => x.id === it.productId);
      return { name: p.name, price: p.price, quantity: it.quantity };
    });
    const total = itemsForPayment.reduce((s, it) => s + it.price * it.quantity, 0);

    // create order in DB in pending state
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        total,
        status: "pending",
      }
    });

    // create items
    for (const it of itemsForPayment) {
      const prod = products.find((p) => p.name === it.name);
      await prisma.orderItem.create({ data: { orderId: order.id, productId: prod.id, quantity: it.quantity, price: it.price }});
    }

    // create payment session (Mercado Pago or Stripe)
    const payment = await createPaymentSession(itemsForPayment);

    // If mercadopago preference exists, store mpPreferenceId for correlating later
    if (payment.gateway === "mercadopago" && payment.preference) {
      await prisma.order.update({ where: { id: order.id }, data: { mpPreferenceId: payment.preference.id }});
    }

    res.json({ order, payment });
  } catch (err) {
    next(err);
  }
}
