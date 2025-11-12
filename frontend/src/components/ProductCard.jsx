import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Badge } from './ui/badge.jsx';
import StarRating from './ui/starRating.jsx';

/**
 * ProductCard - Componente para exibição de produtos em grid
 * Mostra imagem, preço, rating, badge de popularidade e botões de ação
 * @component
 * @example
 * <ProductCard 
 *   product={{ id: 1, name: "Vela Lavanda", price: 49.90, rating: 4.5, image: "url" }} 
 *   index={0} 
 *   onAddToCart={handleAdd}
 * />
 */
const ProductCard = ({ product, index = 0, onAddToCart }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = (e) => {
    e.preventDefault();
    setIsFavorited(!isFavorited);
    // TODO: Salvar em localStorage ou na API
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const rating = product.rating || 0;
  const reviewCount = product.review_count || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      <Card className="border-none shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col group">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          )}

          {/* Badge */}
          {product.is_featured && (
            <Badge className="absolute top-2 left-2 bg-brand-primary">
              Destaque
            </Badge>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorited
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-400'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          {/* Name */}
          <div>
            <h3 className="font-semibold text-lg mb-1 line-clamp-2 text-brand-dark">
              {product.name}
            </h3>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 my-2">
              <StarRating value={Math.round(rating)} size="sm" />
              <span className="text-xs text-gray-500">
                {rating > 0 ? `${rating.toFixed(1)}` : 'Sem avaliações'}
              </span>
              {reviewCount > 0 && (
                <span className="text-xs text-gray-400">({reviewCount})</span>
              )}
            </div>
          </div>

          {/* Price and Button */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-brand-primary">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(product.original_price)}
                </span>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full bg-brand-primary hover:bg-brand-dark gap-2"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
