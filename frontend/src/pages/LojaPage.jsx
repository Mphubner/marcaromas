import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../utils/api";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
import { Badge } from "../components/ui/badge";
import { Search } from "lucide-react";
import ProductCard from "../components/ProductCard.jsx"; // Novo componente
import { productService } from "../services/productService.js"; // Novo serviço

const filterCategories = [
  { id: 'all', name: 'Todas' },
  { id: 'aromas', name: 'Todos Aromas' },
  { id: 'ocasioes', name: 'Todas Ocasiões' },
];

export default function LojaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { add } = useCart();

  // Fetch products using the new service
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll
  });

  // Filter products based on search and category
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'aromas' && product.category === 'aromas') ||
                         (activeFilter === 'ocasioes' && product.category === 'ocasioes');
    return matchesSearch && matchesFilter;
  });

  // Simular perfil do usuário - em produção viria do backend
  const userProfile = {
    categorias: "citrus, floral, woody",
    intensidade: "intense",
    notas: "Lavanda, Sândalo, Limão, vanilla, Baunilha, cascas e folhas, Laranja"
  };

  return (
    <section className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar velas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {filterCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeFilter === category.id ? "default" : "outline"}
                onClick={() => setActiveFilter(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando produtos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} index={index} onAddToCart={add} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    );
}
