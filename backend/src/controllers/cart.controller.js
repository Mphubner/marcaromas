import prisma from "../config/db.js";

// Helper: get or create cart for user
async function getOrCreateCartForUser(userId) {
  let cart = await prisma.cart.findFirst({ where: { userId }, include: { items: true } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } , include: { items: true } });
  }
  return cart;
}

export async function getCart(req, res) {
  try {
    const user = req.user;
    if (!user) return res.json({ items: [] });
    const cart = await prisma.cart.findFirst({ where: { userId: user.id }, include: { items: true } });
    res.json({ items: cart?.items || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao carregar carrinho' });
  }
}

export async function addItem(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const { productId, quantity = 1, name, price } = req.body;
    const cart = await getOrCreateCartForUser(user.id);
    const item = await prisma.cartItem.create({ data: { cartId: cart.id, productId, name, quantity, price } });
    const items = await prisma.cartItem.findMany({ where: { cartId: cart.id } });
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar item' });
  }
}

export async function updateItem(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    const cart = await prisma.cart.findFirst({ where: { userId: user.id }, include: { items: true } });
    res.json({ items: cart?.items || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
}

export async function removeItem(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const itemId = Number(req.params.itemId);
    await prisma.cartItem.delete({ where: { id: itemId } });
    const cart = await prisma.cart.findFirst({ where: { userId: user.id }, include: { items: true } });
    res.json({ items: cart?.items || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover item' });
  }
}

export async function clearCart(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const cart = await prisma.cart.findFirst({ where: { userId: user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.json({ items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao limpar carrinho' });
  }
}

// Backwards-compatible echo
export function echoCart(req, res) {
  res.json({ ok: true, cart: req.body.cart || [] });
}
