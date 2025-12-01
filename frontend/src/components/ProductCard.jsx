import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/ui/LazyImage';
import { useQueryClient } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import api from '../lib/api';

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const queryClient = useQueryClient();
  const cartCtx = useCart();
  const navigate = useNavigate();

  // Get product images array (primary + additional)
  const images = product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || product.thumbnail, product.image2].filter(Boolean);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      await api.post('/api/cart/items', { productId: product.id, quantity: 1 });
      queryClient.invalidateQueries(['cart']);
      if (cartCtx?.refresh) cartCtx.refresh();
      toast.success('Produto adicionado ao carrinho!');
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error('Faça login para adicionar ao carrinho');
        navigate('/login');
      } else {
        console.error(err);
        toast.error('Erro ao adicionar produto');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await handleAddToCart(e);
      navigate('/carrinho');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="product-card group">
      {/* Image Section with Hover Effect */}
      <div className="relative h-80 overflow-hidden rounded-t-2xl bg-gray-100">
        {/* First Image */}
        <LazyImage
          src={images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full"
          imageClassName="group-hover:scale-110 transition-transform duration-700"
          aspectRatio="aspect-none"
        />

        {/* Second Image on Hover (if available) */}
        {images[1] && (
          <LazyImage
            src={images[1]}
            alt={`${product.name} - visualização 2`}
            className="absolute inset-0 w-full h-full"
            imageClassName="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            aspectRatio="aspect-none"
          />
        )}

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
          <Button
            onClick={handleAddToCart}
            disabled={loading}
            className="bg-[#8B7355] text-white rounded-full px-6 py-3 font-semibold hover:bg-[#7A6548] shadow-lg flex items-center gap-2 no-hover"
          >
            <ShoppingCart className="w-4 h-4" />
            {loading ? 'Adicionando...' : 'Adicionar'}
          </Button>

          <Button
            onClick={handleBuyNow}
            variant="outline"
            className="bg-white/95 text-[#8B7355] rounded-full px-6 py-3 font-semibold border-2 border-[#8B7355] hover:bg-[#8B7355] hover:text-white shadow-lg flex items-center gap-2 no-hover"
          >
            <Zap className="w-4 h-4" />
            Comprar
          </Button>
        </div>

        {/* Badges */}
        {product.discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{product.discount}%
          </div>
        )}

        {product.isNew && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            Novo
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6 bg-white rounded-b-2xl">
        <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#8B7355] transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.short_description || product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-sm mr-2">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[#8B7355] font-bold text-2xl">
              R$ {(product.price || 0).toFixed(2)}
            </span>
          </div>

          <Link to={`/produto/${product.slug || product.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Ver Mais
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
