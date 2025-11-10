import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart_v1") || "[]");
    setCart(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart_v1", JSON.stringify(cart));
  }, [cart]);

  const add = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const remove = (id) => setCart((c) => c.filter((i) => i.id !== id));
  const clear = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}
