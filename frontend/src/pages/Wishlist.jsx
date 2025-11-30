import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Heart,
    ShoppingCart,
    Trash2,
    Star,
    Package
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Premium Client Components
import {
    ClientPageHeader,
    ClientCard,
    ClientButton,
    ClientBadge,
    ClientEmptyState
} from '@/components/client';

// Services
import { cartService } from '../services/cartService';
import { useAuth } from '../context/AuthContext';

// Mock wishlist service
const wishlistService = {
    getWishlist: async () => {
        // Mock data
        return [
            {
                id: 1,
                product: {
                    id: 101,
                    name: 'Vela Lavanda Premium',
                    price: 49.90,
                    images: ['https://images.unsplash.com/photo-1602874801006-2bc2972f9c90?w=400'],
                    inStock: true,
                    rating: 4.8
                },
                addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                id: 2,
                product: {
                    id: 102,
                    name: 'Vela Baunilha',
                    price: 39.90,
                    images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400'],
                    inStock: true,
                    rating: 4.9
                },
                addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                id: 3,
                product: {
                    id: 103,
                    name: 'Vela Oceano',
                    price: 54.90,
                    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'],
                    inStock: false,
                    rating: 4.7
                },
                addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
        ];
    },

    removeFromWishlist: async (id) => {
        return { success: true };
    }
};

export default function Wishlist() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // Fetch wishlist
    const { data: wishlistItems = [], isLoading } = useQuery({
        queryKey: ['wishlist'],
        queryFn: wishlistService.getWishlist,
        enabled: !!user
    });

    // Remove from wishlist mutation
    const removeMutation = useMutation({
        mutationFn: (id) => wishlistService.removeFromWishlist(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['wishlist']);
            toast.success('Item removido da lista de desejos');
        }
    });

    // Add to cart mutation
    const addToCartMutation = useMutation({
        mutationFn: (productId) => cartService.addToCart({ productId, quantity: 1 }),
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']);
            toast.success('Produto adicionado ao carrinho!');
        },
        onError: () => {
            toast.error('Erro ao adicionar ao carrinho');
        }
    });

    const handleAddToCart = (item) => {
        if (!item.product.inStock) {
            toast.error('Produto indisponível no momento');
            return;
        }
        addToCartMutation.mutate(item.product.id);
    };

    if (!user) {
        navigate('/login?redirect=/wishlist');
        return null;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <ClientPageHeader
                    title="Lista de Desejos"
                    subtitle={`${wishlistItems.length} ${wishlistItems.length === 1 ? 'item salvo' : 'itens salvos'}`}
                    backTo="/dashboard"
                />

                {wishlistItems.length === 0 ? (
                    <ClientEmptyState
                        icon={Heart}
                        title="Sua lista de desejos está vazia"
                        message="Adicione produtos que você gosta para comprar depois"
                    >
                        <ClientButton onClick={() => navigate('/loja')}>
                            Explorar Produtos
                        </ClientButton>
                    </ClientEmptyState>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ClientCard hoverable className="h-full">
                                    <div className="relative">
                                        {/* Product Image */}
                                        <div className="relative mb-4 rounded-2xl overflow-hidden bg-gray-100 aspect-square">
                                            {item.product.images?.[0] ? (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-16 h-16 text-gray-300" />
                                                </div>
                                            )}

                                            {/* Stock Badge */}
                                            <div className="absolute top-4 right-4">
                                                {item.product.inStock ? (
                                                    <ClientBadge variant="success">Em Estoque</ClientBadge>
                                                ) : (
                                                    <ClientBadge variant="error">Indisponível</ClientBadge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="mb-4">
                                            <h3 className="font-bold text-lg text-[#2C2419] mb-2">
                                                {item.product.name}
                                            </h3>

                                            {/* Rating */}
                                            {item.product.rating && (
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-sm font-semibold">
                                                            {item.product.rating}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Price */}
                                            <p className="text-3xl font-bold text-[#8B7355] font-['Playfair_Display']">
                                                R$ {item.product.price?.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-2">
                                            <ClientButton
                                                onClick={() => handleAddToCart(item)}
                                                disabled={!item.product.inStock || addToCartMutation.isPending}
                                                className="w-full"
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                {addToCartMutation.isPending
                                                    ? 'Adicionando...'
                                                    : item.product.inStock
                                                        ? 'Adicionar ao Carrinho'
                                                        : 'Indisponível'}
                                            </ClientButton>

                                            <div className="flex gap-2">
                                                <ClientButton
                                                    variant="outline"
                                                    onClick={() => navigate(`/produto/${item.product.id}`)}
                                                    className="flex-1"
                                                >
                                                    Ver Detalhes
                                                </ClientButton>

                                                <ClientButton
                                                    variant="ghost"
                                                    onClick={() => removeMutation.mutate(item.id)}
                                                    disabled={removeMutation.isPending}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </ClientButton>
                                            </div>
                                        </div>

                                        {/* Added Date */}
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-xs text-gray-500">
                                                Adicionado em {new Date(item.addedAt).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                </ClientCard>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Info Card */}
                {wishlistItems.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                    >
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                            <div className="flex items-start gap-3">
                                <Heart className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-900">
                                    <p className="font-semibold mb-1">Dica</p>
                                    <p>
                                        Você receberá notificações quando produtos da sua lista de desejos
                                        entrarem em promoção ou voltarem ao estoque.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* CTA Section */}
                {wishlistItems.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                    >
                        <ClientCard gradient>
                            <div className="text-center text-white py-6">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2 font-['Playfair_Display']">
                                    Pronto para Comprar?
                                </h3>
                                <p className="mb-6 opacity-90">
                                    Adicione todos os produtos ao carrinho de uma vez
                                </p>
                                <ClientButton
                                    variant="secondary"
                                    onClick={() => {
                                        // Add all to cart logic
                                        const inStockItems = wishlistItems.filter(item => item.product.inStock);
                                        inStockItems.forEach(item => {
                                            addToCartMutation.mutate(item.product.id);
                                        });
                                    }}
                                    disabled={addToCartMutation.isPending}
                                >
                                    Adicionar Tudo ao Carrinho
                                </ClientButton>
                            </div>
                        </ClientCard>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
