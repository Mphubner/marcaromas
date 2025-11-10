// For this design, cart is client-side (localStorage). Server can create an order from posted cart.
export function echoCart(req, res) {
  res.json({ ok: true, cart: req.body.cart || [] });
}
