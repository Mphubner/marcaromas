import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

export default function ProductRecommendations({ products = [], title = "Você também pode gostar" }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-8">
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
