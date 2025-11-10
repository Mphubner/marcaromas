import prisma from "../config/db.js";

/**
 * For initial implementation we create subscription records in DB and leave payment
 * actual process to MercadoPago Subscription API integration (can be added).
 */
export async function listPlans(req, res, next) {
  // For now return plans from DB Config or static sample
  res.json([
    { id: "monthly-1", title: "Clube Mensal - 1 vela", price: 59.9 },
    { id: "quarter-1", title: "Clube Trimestral - 3 meses", price: 169.9 }
  ]);
}

export async function createSubscription(req, res, next) {
  try {
    const { userId, planId } = req.body;
    // TODO: integrate with MP Subscriptions API
    const sub = await prisma.subscription.create({ data: { userId, planId, status: "pending" }});
    res.json(sub);
  } catch (err) {
    next(err);
  }
}
