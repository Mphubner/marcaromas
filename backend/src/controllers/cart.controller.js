import { prisma } from '../lib/prisma.js';

// Helper: get or create cart for user
async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findFirst({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return cart;
}

export const getCart = async (req, res, next) => {
  try {
    if (!req.user) return res.json([]); // Retorna carrinho vazio para não logados

    const cartItems = await prisma.cartItem.findMany({
      where: { cart: { userId: req.user.id } },
      include: { product: true }, // Inclui os detalhes do produto
    });
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
};

export const addItemToCart = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Autenticação necessária.' });

    const { productId, quantity } = req.body;
    const cart = await getOrCreateCart(req.user.id);

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      // Se o item já existe, atualiza a quantidade
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      res.json(updatedItem);
    } else {
      // Se não existe, cria um novo item
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
      res.status(201).json(newItem);
    }
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: parseInt(itemId) } });
      return res.status(204).send();
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: parseInt(itemId) },
      data: { quantity },
    });
    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Autenticação necessária.' });
    const cart = await prisma.cart.findFirst({ where: { userId: req.user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

