import React, { createContext, useContext, useEffect, useState } from "react";
import api from '../lib/api';

const CartContext = createContext();
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar carrinho do backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      console.log('CartContext: Fetching cart from API...');
      const { data } = await api.get('/cart');
      console.log('CartContext: Fetch cart API response:', data);
      setCart(data || []);
    } catch (err) {
      console.error('CartContext: Error fetching cart:', err);
      setError(err.message);
      const saved = JSON.parse(localStorage.getItem("cart_v1") || "[]");
      setCart(saved);
    } finally {
      setLoading(false);
    }
  };

  // Carregar carrinho inicial
  useEffect(() => {
    fetchCart();
  }, []);

  // Sincronizar com localStorage
  useEffect(() => {
    localStorage.setItem("cart_v1", JSON.stringify(cart));
  }, [cart]);

  // Adicionar item ao carrinho
  const add = async (item) => {
    try {
      console.log('CartContext: Adding item to cart via API:', item);
      await api.post('/cart/items', {
        productId: item.id,
        quantity: 1,
        name: item.name,
        price: item.price,
      });
      console.log('CartContext: Item added successfully, fetching updated cart...');
      // Fetch the updated cart since API only returns the added item
      await fetchCart();
    } catch (err) {
      console.error('CartContext: API error, using local fallback:', err);
      setError(err.message);
      setCart((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    }
  };

  // Atualizar quantidade
  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.patch(`/cart/items/${itemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      setError(err.message);
      setCart((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Remover item do carrinho
  const remove = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      await fetchCart();
    } catch (err) {
      setError(err.message);
      setCart((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  // Limpar carrinho
  const clear = async () => {
    try {
      await api.delete('/cart');
      setCart([]);
    } catch (err) {
      setError(err.message);
      setCart([]);
    }
  };

  const value = {
    cart,
    loading,
    error,
    add,
    remove,
    clear,
    updateQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
