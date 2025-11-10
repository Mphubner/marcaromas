import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_URL } from "../utils/api";
import Button from "./ui/button";

export default function ProductRecommendations({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/products?cat=${category}`)
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [category]);

  if (!products.length) return null;

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Você também pode gostar</h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h4 className="font-medium">{p.name}</h4>
            <p className="text-sm text-gray-500">{p.priceFormatted}</p>
            <Button
              size="sm"
              className="mt-2 w-full"
              onClick={() => alert("Adicionar ao carrinho")}
            >
              Adicionar
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
