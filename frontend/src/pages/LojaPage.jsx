import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_URL } from "../utils/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card.jsx";
import Button from "../components/ui/button";
import { useCart } from "../context/CartContext";

export default function LojaPage() {
  const [products, setProducts] = useState([]);
  const { add } = useCart();

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-20">
      <h1 className="text-2xl font-bold mb-6">Loja</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <img src={p.image} alt={p.name} className="rounded-md mb-2 h-48 w-full object-cover" />
              <h4 className="font-semibold">{p.name}</h4>
              <p className="text-gray-500 mb-2">{p.priceFormatted}</p>
              <Button className="w-full" onClick={() => add(p)}>
                Adicionar ao carrinho
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
