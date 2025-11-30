import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Heart,
  Star,
  Package,
  Clock,
  Flame,
  ArrowLeft,
  Plus,
  Minus,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductRecommendations from "../components/ProductRecommendations";
import { cartService } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
// import ProductReviews from "../components/ProductReviews"; // Assumindo que este componente será criado
import { Label } from "@/components/ui/label";

// Meu serviço de API
import { productService } from "../services/productService";

export default function Produto() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getBySlug(slug),
    enabled: !!slug,
  });

  const { user } = useAuth();
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.addItem({ productId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      alert("Produto adicionado ao carrinho!");
      navigate('/carrinho');
    },
    onError: (err) => {
      console.error('Erro ao adicionar ao carrinho', err);
      alert('Não foi possível adicionar ao carrinho.');
    }
  });

  // Lógica de adicionar ao carrinho (usa backend)
  const handleAddToCart = () => {
    if (!user) {
      const redirectTo = `/produto/${slug}`;
      navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }

    const productId = selectedVariant?.id || product.id;
    addToCartMutation.mutate({ productId, quantity });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h2>
          <Link to="/loja">
            <Button>Voltar à Loja</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [null];
  const inStock = (selectedVariant ? selectedVariant.inventory_qty : product.stock_quantity) > 0;
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;
  const displayPrice = selectedVariant?.price || product.price;
  const displayStock = selectedVariant?.inventory_qty || product.stock_quantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/loja")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Loja
        </Button>
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#8B7355] to-[#D4A574] relative group">
                {product.is_featured && (
                  <Badge className="absolute top-4 left-4 bg-[#8B7355] text-white z-10">
                    <Star className="w-3 h-3 mr-1" />
                    Destaque
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white z-10">
                    -{discountPercentage}%
                  </Badge>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    {images[selectedImage] ? (
                      <img
                        src={images[selectedImage]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-24 h-24 text-white opacity-50" />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-[#8B7355] scale-105 shadow-lg"
                          : "border-gray-200 hover:border-[#8B7355]/50"
                      }`}
                    >
                      {img ? (
                        <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Badge variant="outline" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold text-[#2C2419] mb-4">
                {product.name}
              </h1>
              {product.short_description && (
                <p className="text-lg text-gray-600">
                  {product.short_description}
                </p>
              )}
            </div>
            {product.variants.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <Label className="font-bold mb-3 block">Escolha o Tamanho:</Label>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setSelectedVariant(null)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      !selectedVariant
                        ? "border-[#8B7355] bg-[#8B7355] text-white"
                        : "border-gray-300 hover:border-[#8B7355]"
                    }`}
                  >
                    {product.size || "Padrão"} - R$ {product.price.toFixed(2).replace('.', ',')}
                  </button>
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedVariant?.id === variant.id
                          ? "border-[#8B7355] bg-[#8B7355] text-white"
                          : "border-gray-300 hover:border-[#8B7355]"
                      }`}
                      disabled={variant.inventory_qty === 0}
                    >
                      {variant.variant_name} - R$ {variant.price.toFixed(2).replace('.', ',')}
                      {variant.inventory_qty === 0 && <span className="text-xs block">Esgotado</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-[#8B7355]">
                R$ {displayPrice.toFixed(2).replace('.', ',')}
              </span>
              {hasDiscount && (
                <span className="text-2xl text-gray-400 line-through">
                  R$ {product.compare_at_price.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {inStock ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    Em estoque ({displayStock} unidades)
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-600 font-medium">Fora de estoque</span>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 py-6 border-y">
              {product.size && (
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#8B7355]" />
                  <div>
                    <p className="text-xs text-gray-500">Tamanho</p>
                    <p className="font-semibold text-[#2C2419]">{product.size}</p>
                  </div>
                </div>
              )}
              {product.burn_time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#8B7355]" />
                  <div>
                    <p className="text-xs text-gray-500">Duração</p>
                    <p className="font-semibold text-[#2C2419]">{product.burn_time}</p>
                  </div>
                </div>
              )}
              {product.aroma_family && (
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#8B7355]" />
                  <div>
                    <p className="text-xs text-gray-500">Família</p>
                    <p className="font-semibold text-[#2C2419] capitalize">{product.aroma_family}</p>
                  </div>
                </div>
              )}
            </div>
            {product.aroma_notes && product.aroma_notes.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Notas Aromáticas:</p>
                <div className="flex flex-wrap gap-2">
                  {product.aroma_notes.map((note, index) => (
                    <Badge key={index} variant="outline" className="bg-[#8B7355]/5">
                      {note}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {inStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">Quantidade:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(displayStock, quantity + 1))}
                    disabled={quantity >= displayStock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 h-14 text-lg bg-[#8B7355] hover:bg-[#6B5845]"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14"
              >
                <Heart className="w-6 h-6" />
              </Button>
            </div>
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        </div>
        {product.description && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className="border-none shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-[#2C2419] mb-4">Descrição</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {product.ingredients && product.ingredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className="border-none shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-[#2C2419] mb-4">Ingredientes</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <ProductReviews productId={product.id} productName={product?.name} />
        </motion.div> */}
        {user && (
          <div className="mt-16 border-t pt-16">
            <ProductRecommendations
              user={user}
              currentProductId={product.id}
              title="Você Também Pode Gostar"
            />
          </div>
        )}
      </div>
    </div>
  );
}
