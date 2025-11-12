import { MercadoPagoConfig, Preference } from "mercadopago";
import Stripe from "stripe";
import { paymentConfig } from "../config/paymentConfig.js";

// Support multiple Mercado Pago credentials:
// - Subscriptions (recurring products)
// - Transparent/Payments (checkout transparente for store products)

function createMpClient(accessToken) {
  return new MercadoPagoConfig({ accessToken });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-01",
});

export async function createPaymentSession(items, opts = {}) {
  // opts.type: 'subscription' | 'transparent' | undefined
  if (paymentConfig.defaultGateway === "mercadopago") {
    // choose credentials
    const isSubscription = opts.type === 'subscription';
    const accessToken = isSubscription
      ? (process.env.MERCADOPAGO_ACCESS_TOKEN_SUBS || process.env.MERCADOPAGO_ACCESS_TOKEN)
      : (process.env.MERCADOPAGO_ACCESS_TOKEN_TRANSPARENT || process.env.MERCADOPAGO_ACCESS_TOKEN);

    const client = createMpClient(accessToken);
    const preference = new Preference(client);

    const body = {
      items: items.map((it) => ({
        title: it.name,
        quantity: Number(it.quantity || 1),
        currency_id: "BRL",
        unit_price: Number(it.price),
      })),
      back_urls: {
        success: `${process.env.FRONTEND_URL}/checkout/sucesso`,
        failure: `${process.env.FRONTEND_URL}/checkout/falha`,
        pending: `${process.env.FRONTEND_URL}/checkout/pendente`,
      },
      auto_return: "approved",
    };

    const result = await preference.create({ body });
    return { gateway: "mercadopago", init_point: result.init_point, preference: result };
  } else {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((it) => ({
        price_data: {
          currency: "brl",
          product_data: { name: it.name },
          unit_amount: Math.round(Number(it.price) * 100),
        },
        quantity: Number(it.quantity || 1),
      })),
      success_url: `${process.env.FRONTEND_URL}/checkout/sucesso`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/falha`,
    });
    return { gateway: "stripe", init_point: session.url, session };
  }
}

export async function handleMercadoPagoWebhook(rawBody) {
  try {
    const text = rawBody.toString();
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }
    return payload;
  } catch (err) {
    throw err;
  }
}
