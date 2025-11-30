import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  ShoppingBag,
  Search,
  Filter,
  Star,
  Sparkles,
  ArrowRight,
  Wand2,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

// Meu serviço de API
import { productService } from "../services/productService";

function ProductActionButtons({ product }) {
  const navigate = useNavigate();
  const cart = useCart();

  const handleAdd = async () => {
    console.log('LojaPage: handleAdd called with product:', product);
    console.log('LojaPage: cart object:', cart);
    try {
      await cart.add(product);
      toast.success("Produto adicionado ao carrinho!");
    } catch (err) {
      console.error('LojaPage: Error in handleAdd:', err);
      toast.error('Erro ao adicionar ao carrinho');
    }
  };

  const handleBuy = async () => {
    try {
      await cart.add(product);
      navigate('/carrinho');
    } catch (err) {
      console.error('Erro ao adicionar e comprar', err);
      alert('Erro ao processar compra');
    }
  };

  return (
    <>
      <Button size="sm" className="bg-[#8B7355] text-white" onClick={handleAdd} disabled={product.stock_quantity <= 0}>Adicionar</Button>
      <Button size="sm" variant="outline" onClick={handleBuy} disabled={product.stock_quantity <= 0}>Comprar</Button>
    </>
  );
}

export default function Loja() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAroma, setSelectedAroma] = useState("all");
  const [selectedOccasion, setSelectedOccasion] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [user, setUser] = useState(null); // Mock

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getAll,
  });

  const categories = [
    { value: "all", label: "Todas" },
    { value: "classic", label: "Clássicas" },
    { value: "aromatherapy", label: "Aromaterapia" },
    { value: "seasonal", label: "Temporada" },
    { value: "decorative", label: "Decorativas" },
    { value: "gift_set", label: "Kits Presente" },
    { value: "box", label: "📦 Boxes Mensais" }
  ];

  const aromaFamilies = [
    { value: "all", label: "Todos Aromas" },
    { value: "sweet", label: "Doces" },
    { value: "woody", label: "Amadeirados" },
    { value: "floral", label: "Florais" },
    { value: "citrus", label: "Cítricos" },
    { value: "herbal", label: "Herbáceos" }
  ];

  const occasions = [
    { value: "all", label: "Todas Ocasiões" },
    { value: "relaxation", label: "Relaxamento" },
    { value: "meditation", label: "Meditação" },
    { value: "work", label: "Trabalho/Estudo" },
    { value: "spa", label: "Spa/Banho" },
    { value: "dinner", label: "Jantar" },
    { value: "reading", label: "Leitura" },
    { value: "yoga", label: "Yoga" },
    { value: "sleep", label: "Dormir" }
  ];

  const categoryColors = {
    classic: "bg-blue-100 text-blue-800",
    aromatherapy: "bg-purple-100 text-purple-800",
    seasonal: "bg-orange-100 text-orange-800",
    decorative: "bg-pink-100 text-pink-800",
    gift_set: "bg-green-100 text-green-800",
    box: "bg-amber-100 text-amber-800"
  };

  const aromaFamilyConfig = {
    sweet: { color: "bg-pink-100 text-pink-800", icon: "🍰", label: "Doces" },
    woody: { color: "bg-amber-100 text-amber-800", icon: "🌲", label: "Amadeirados" },
    floral: { color: "bg-purple-100 text-purple-800", icon: "🌸", label: "Florais" },
    citrus: { color: "bg-yellow-100 text-yellow-800", icon: "🍊", label: "Cítricos" },
    herbal: { color: "bg-green-100 text-green-800", icon: "🌿", label: "Herbáceos" }
  };

  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesAroma = selectedAroma === "all" ||
      (product.type !== 'box' && product.aroma_family === selectedAroma);
    let matchesOccasion = selectedOccasion === "all";
    if (!matchesOccasion && product.tags) {
      matchesOccasion = product.tags.some(tag =>
        tag.toLowerCase().includes(selectedOccasion.toLowerCase())
      );
    }
    return matchesSearch && matchesCategory && matchesAroma && matchesOccasion;
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "featured") return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    if (sortBy === "price_low") return a.price - b.price;
    if (sortBy === "price_high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/10 via-transparent to-[#D4A574]/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B7355]/10 text-[#8B7355] mb-6">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm font-medium">Loja de Velas e Boxes</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#2C2419] mb-6 leading-tight">
              Descubra aromas<br />
              <span className="text-[#8B7355]">únicos e exclusivos</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Velas artesanais feitas à mão, com ingredientes naturais e aromas que transformam ambientes
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar velas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex gap-3 flex-wrap lg:flex-nowrap">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full lg:w-40 h-12">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedAroma}
                onValueChange={setSelectedAroma}
              >
                <SelectTrigger className="w-full lg:w-40 h-12">
                  <SelectValue placeholder="Aroma" />
                </SelectTrigger>
                <SelectContent>
                  {aromaFamilies.map(aroma => (
                    <SelectItem key={aroma.value} value={aroma.value}>{aroma.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedOccasion}
                onValueChange={setSelectedOccasion}
              >
                <SelectTrigger className="w-full lg:w-40 h-12">
                  <SelectValue placeholder="Ocasião" />
                </SelectTrigger>
                <SelectContent>
                  {occasions.map(occ => (
                    <SelectItem key={occ.value} value={occ.value}>{occ.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-full lg:w-40 h-12">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Destaques</SelectItem>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="price_low">Menor Preço</SelectItem>
                  <SelectItem value="price_high">Maior Preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros ou busca
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-600">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'} encontrado{filteredProducts.length === 1 ? '' : 's'}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => {
                  const aromaConfig = aromaFamilyConfig[product.aroma_family] || {};
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white h-full overflow-hidden group">
                        <div className="aspect-square overflow-hidden bg-gradient-to-br from-[#8B7355] to-[#D4A574] relative">
                          {product.is_featured && (
                            <Badge className="absolute top-3 left-3 bg-[#8B7355] text-white z-10">
                              <Star className="w-3 h-3 mr-1" />
                              Destaque
                            </Badge>
                          )}
                          {product.compare_at_price && product.compare_at_price > product.price && (
                            <Badge className="absolute top-3 right-3 bg-red-500 text-white z-10">
                              -{Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
                            </Badge>
                          )}
                          {product.type !== 'box' && aromaConfig.icon && (
                            <Badge className={`absolute bottom-3 left-3 ${aromaConfig.color} z-10 text-sm`}>
                              {aromaConfig.icon} {aromaConfig.label}
                            </Badge>
                          )}
                          {product.type === 'box' && (
                            <Badge className="absolute bottom-3 left-3 bg-amber-100 text-amber-800 z-10 text-sm">
                              📦 Box Mensal
                            </Badge>
                          )}
                          {product.images && product.images[0] ? (
                            <Link to={product.type === 'box' ? `/box/${product.slug}` : `/produto/${product.slug}`} className="w-full h-full block">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </Link>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Sparkles className="w-16 h-16 text-white opacity-50" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6">
                          {product.category && (
                            <Badge className={`mb-3 ${categoryColors[product.category] || "bg-gray-100 text-gray-800"}`}>
                              {categories.find(c => c.value === product.category)?.label || product.category}
                            </Badge>
                          )}
                          <h3 className="text-lg font-bold text-[#2C2419] mb-2 line-clamp-2 group-hover:text-[#8B7355] transition-colors">
                            <Link to={product.type === 'box' ? `/box/${product.slug}` : `/produto/${product.slug}`} className="hover:text-[#8B7355]">{product.name}</Link>
                          </h3>
                          {product.short_description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {product.short_description}
                            </p>
                          )}
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-2xl font-bold text-[#8B7355]">
                              R$ {product.price.toFixed(2).replace('.', ',')}
                            </span>
                            {product.compare_at_price && product.compare_at_price > product.price && (
                              <span className="text-sm text-gray-400 line-through">
                                R$ {product.compare_at_price.toFixed(2).replace('.', ',')}
                              </span>
                            )}
                          </div>
                          {product.stock_quantity > 0 ? (
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <div className="w-2 h-2 rounded-full bg-green-600" />
                              Em estoque
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-sm text-red-600">
                              <div className="w-2 h-2 rounded-full bg-red-600" />
                              Esgotado
                            </div>
                          )}
                          <div className="mt-4 flex gap-3">
                            <ProductActionButtons product={product} />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#8B7355] to-[#6B5845] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Quer receber velas todo mês?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Faça parte do Clube Marc Aromas e receba velas exclusivas com desconto especial
            </p>
            <Link to="/clube">
              <Button size="lg" variant="secondary" className="bg-white text-[#8B7355] hover:bg-gray-100 px-8 py-6 text-lg">
                Conhecer o Clube
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

