import React, { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from '../utils/api';

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
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(`${API_URL}/api/cart`, {
        headers,
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCart(data.items || []);
      } else {
        // Se não estiver autenticado ou houver erro, tenta carregar do localStorage
        const saved = JSON.parse(localStorage.getItem("cart_v1") || "[]");
        setCart(saved);
      }
    } catch (err) {
      setError(err.message);
      // Em caso de erro, tenta carregar do localStorage
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
      const response = await fetch(`${API_URL}/api/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          productId: item.id,
          quantity: 1,
          name: item.name,
          price: item.price,
        }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart.items);
      } else {
        // Fallback para localStorage se não estiver autenticado
        setCart((prev) => {
          const existing = prev.find((i) => i.id === item.id);
          if (existing) {
            // Product already in cart: increment quantity instead of adding a new entry
            return prev.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          // Product not in cart: add it with quantity 1 and preserve all item properties
          return [...prev, { ...item, quantity: 1 }];
        });
      }
    } catch (err) {
      setError(err.message);
      // Fallback para localStorage em caso de erro
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
      const response = await fetch(`${API_URL}/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart.items);
      } else {
        // Fallback para localStorage
        setCart((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )
        );
      }
    } catch (err) {
      setError(err.message);
      // Fallback para localStorage
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
      const response = await fetch(`${API_URL}/api/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
        },
        credentials: 'include',
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart.items);
      } else {
        // Fallback para localStorage
        setCart((prev) => prev.filter((item) => item.id !== itemId));
      }
    } catch (err) {
      setError(err.message);
      // Fallback para localStorage
      setCart((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  // Limpar carrinho
  const clear = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: 'DELETE',
        headers: {
          ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
        },
        credentials: 'include',
      });

      if (response.ok) {
        setCart([]);
      } else {
        // Fallback para localStorage
        setCart([]);
      }
    } catch (err) {
      setError(err.message);
      // Fallback para localStorage
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
