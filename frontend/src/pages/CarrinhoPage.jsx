import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card.jsx";

export default function CarrinhoPage() {
  const navigate = useNavigate();

  // Exemplo estático até integração final do carrinho global
  const cartItems = [
    { name: "Vela Aromática de Lavanda", price: 79.9, quantity: 1 },
    { name: "Home Spray Citrus", price: 49.9, quantity: 1 },
  ];

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Seu Carrinho</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-6">
            {cartItems.map((item, i) => (
              <li key={i} className="flex justify-between py-3">
                <span>{item.name}</span>
                <span>R$ {item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mb-6">
            <span className="font-semibold text-lg">Total:</span>
            <span className="text-xl font-bold">R$ {total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-primary text-white rounded-lg py-3 hover:bg-primary/90 transition"
          >
            Finalizar compra
          </button>
        </>
      )}
    </div>
  );
}
