import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Heart,
    ShoppingCart,
    Trash2,
    Star,
    Package,
    Share2,
    Bell,
    BellOff
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
import { wishlistService } from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const {
        wishlistItems,
        removeFromWishlist,
        toggleNotification,
        isRemoving,
    } = useWishlist();
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    // Add to cart mutation
    const addToCartMutation = useMutation({
        mutationFn: (productId) => cartService.addToCart({ productId, quantity: 1 }),
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']);
            toast.success('Produto adicionado ao carrinho!');
        },
        onError: () => {
            toast.error('Erro ao adicionar ao carrinho');
        },
    });

    const handleAddToCart = (item) => {
        if (!item.product.inStock) {
            toast.error('Produto indisponível no momento');
            return;
        }
        addToCartMutation.mutate(item.product.id);
    };

    const handleShare = async () => {
        try {
            const { shareUrl } = await wishlistService.getShareLink();
            setShareUrl(shareUrl);
            setShowShareModal(true);
        } catch (error) {
            toast.error('Erro ao gerar link de compartilhamento');
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copiado!');
    };

    const handleToggleNotification = (item, type) => {
        const currentValue = type === 'sale' ? item.notifyOnSale : item.notifyOnStock;
        toggleNotification({
            wishlistId: item.id,
            type,
            enabled: !currentValue,
        });
    };

    if (!user) {
        navigate('/login?redirect=/wishlist');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <ClientPageHeader
                        title="Lista de Desejos"
                        subtitle={`${wishlistItems.length} ${wishlistItems.length === 1 ? 'item salvo' : 'itens salvos'}`}
                        backTo="/dashboard"
                    />
                    {wishlistItems.length > 0 && (
                        <ClientButton
                            variant="outline"
                            onClick={handleShare}
                            className="flex items-center gap-2"
                        >
                            <Share2 className="w-4 h-4" />
                            Compartilhar
                        </ClientButton>
                    )}
                </div>

                {/* Share Modal */}
                {showShareModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
                        <ClientCard className="max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-4">Compartilhar Lista de Desejos</h3>
                                <p className="text-gray-600 mb-4">
                                    Compartilhe sua lista de desejos com amigos e familiares!
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className="flex-1 px-4 py-2 border rounded-xl bg-gray-50"
                                    />
                                    <ClientButton onClick={handleCopyLink}>
                                        Copiar
                                    </ClientButton>
                                </div>
                            </div>
                        </ClientCard>
                    </div>
                )}

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

                                            {/* Notification Toggles */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleToggleNotification(item, 'sale')}
                                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${item.notifyOnSale
                                                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                                                            : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
                                                        }`}
                                                    title="Notificar quando em promoção"
                                                >
                                                    {item.notifyOnSale ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                                                    <span className="hidden sm:inline">Promoção</span>
                                                </button>

                                                <button
                                                    onClick={() => handleToggleNotification(item, 'stock')}
                                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${item.notifyOnStock
                                                            ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                                            : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
                                                        }`}
                                                    title="Notificar quando disponível"
                                                >
                                                    {item.notifyOnStock ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                                                    <span className="hidden sm:inline">Estoque</span>
                                                </button>
                                            </div>

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
                                                    onClick={() => removeFromWishlist(item.id)}
                                                    disabled={isRemoving}
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
