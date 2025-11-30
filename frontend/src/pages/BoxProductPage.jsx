import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    ShoppingCart,
    Calendar,
    DollarSign,
    Package,
    Check,
    Sparkles,
    Music,
    Heart,
    Flame
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import api from '../lib/api';

export default function BoxProductPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const cart = useCart();

    // Buscar box pelo slug
    const { data: box, isLoading } = useQuery({
        queryKey: ['box-product', slug],
        queryFn: async () => {
            try {
                // Extrair o mês do slug (formato: box-dezembro-2025)
                const monthString = slug.replace('box-', '').replace(/-/g, ' ');

                // Buscar todas as boxes e encontrar pela correspondência do slug/mês
                const { data: allProducts } = await api.get('/store/products');
                const boxProduct = allProducts.find(p =>
                    p.type === 'box' && p.slug === slug
                );

                if (!boxProduct) throw new Error('Box não encontrada');
                return boxProduct;
            } catch (error) {
                console.error('Erro ao buscar box:', error);
                throw error;
            }
        }
    });

    const handleAddToCart = async () => {
        try {
            await cart.add(box);
            toast.success('Box adicionada ao carrinho!');
        } catch (error) {
            console.error('Erro ao adicionar box:', error);
            toast.error('Erro ao adicionar ao carrinho');
        }
    };

    const handleBuyNow = async () => {
        try {
            await cart.add(box);
            navigate('/carrinho');
        } catch (error) {
            console.error('Erro ao comprar:', error);
            toast.error('Erro ao processar compra');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
                    </div>
                </div>
            </div>
        );
    }

    if (!box) {
        return (
            <div className="min-h-screen py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="rounded-xl border-2">
                        <CardContent className="p-12 text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Box não encontrada</h3>
                            <p className="text-gray-600 mb-6">Esta box não existe ou não está disponível.</p>
                            <Button onClick={() => navigate('/loja')} className="rounded-lg">
                                Voltar para Loja
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const boxData = box.box_data || {};

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link to="/" className="hover:text-[#8B7355]">Início</Link>
                        <span>/</span>
                        <Link to="/loja" className="hover:text-[#8B7355]">Loja</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{box.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Botão Voltar */}
                <Button
                    variant="outline"
                    onClick={() => navigate('/loja')}
                    className="mb-8 rounded-lg"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para Loja
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Coluna Esquerda - Imagens */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        {/* Imagem Principal */}
                        <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#8B7355] to-[#D4A574]">
                            {box.images[0] ? (
                                <img
                                    src={box.images[0]}
                                    alt={box.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-24 h-24 text-white opacity-50" />
                                </div>
                            )}
                        </div>

                        {/* Galeria */}
                        {box.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {box.images.slice(1, 5).map((img, i) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden">
                                        <img src={img} alt={`${box.name} ${i + 2}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Coluna Direita - Informações */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5 text-[#8B7355]" />
                                <span className="text-gray-600">{boxData.month}</span>
                            </div>
                            <h1 className="text-4xl font-bold text-[#2C2419] mb-4">{boxData.theme}</h1>
                            <p className="text-lg text-gray-600 leading-relaxed">{box.description}</p>
                        </div>

                        {/* Preço */}
                        <Card className="rounded-xl border-2 bg-gradient-to-br from-amber-50 to-orange-50">
                            <CardContent className="p-6">
                                <div className="flex items-baseline justify-between mb-2">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Preço da Box</p>
                                        <p className="text-4xl font-bold text-[#8B7355]">
                                            R$ {box.price.toFixed(2).replace('.', ',')}
                                        </p>
                                    </div>
                                    {box.compare_at_price && box.compare_at_price > box.price && (
                                        <Badge className="bg-green-100 text-green-800">
                                            -{Math.round(((box.compare_at_price - box.price) / box.compare_at_price) * 100)}% OFF
                                        </Badge>
                                    )}
                                </div>
                                {boxData.total_items_value && boxData.total_items_value > box.price && (
                                    <p className="text-sm text-gray-600">
                                        💎 Valor total dos itens: <span className="font-semibold">R$ {boxData.total_items_value.toFixed(2)}</span>
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Vela */}
                        {boxData.candle_name && (
                            <Card className="rounded-xl border-2">
                                <CardHeader className="bg-gray-50 border-b">
                                    <CardTitle className="text-lg font-semibold flex items-center">
                                        <Flame className="w-5 h-5 mr-2 text-orange-500" />
                                        Vela Incluída
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-lg font-semibold text-gray-900 mb-2">{boxData.candle_name}</p>
                                    {boxData.aroma_notes && boxData.aroma_notes.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Notas aromáticas:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {boxData.aroma_notes.map((note, i) => (
                                                    <Badge key={i} variant="outline" className="rounded-full">
                                                        {note}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Itens Incluídos */}
                        {boxData.items_included && boxData.items_included.length > 0 && (
                            <Card className="rounded-xl border-2">
                                <CardHeader className="bg-gray-50 border-b">
                                    <CardTitle className="text-lg font-semibold flex items-center">
                                        <Package className="w-5 h-5 mr-2 text-[#8B7355]" />
                                        O que você recebe ({boxData.items_included.length} itens)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <ul className="space-y-3">
                                        {boxData.items_included.map((item, i) => (
                                            <li key={i} className="flex items-start">
                                                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Benefícios */}
                        {boxData.benefits && boxData.benefits.length > 0 && (
                            <Card className="rounded-xl border-2">
                                <CardHeader className="bg-gray-50 border-b">
                                    <CardTitle className="text-lg font-semibold flex items-center">
                                        <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                                        Benefícios Exclusivos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <ul className="space-y-3">
                                        {boxData.benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-start">
                                                <Heart className="w-5 h-5 text-pink-500 mr-3 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Ritual Tips */}
                        {boxData.ritual_tips && (
                            <Card className="rounded-xl border-2 bg-gradient-to-br from-purple-50 to-pink-50">
                                <CardHeader className="border-b bg-white/50">
                                    <CardTitle className="text-lg font-semibold">
                                        ✨ Dicas de Ritual
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-gray-700 leading-relaxed italic">
                                        {boxData.ritual_tips}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Spotify */}
                        {boxData.spotify_playlist && (
                            <Card className="rounded-xl border-2">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Music className="w-8 h-8 text-green-600" />
                                            <div>
                                                <p className="font-semibold">Playlist Spotify</p>
                                                <p className="text-sm text-gray-600">Experiência completa</p>
                                            </div>
                                        </div>
                                        <a
                                            href={boxData.spotify_playlist}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#8B7355] hover:underline"
                                        >
                                            Ouvir →
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Botões de Ação */}
                        <div className="sticky bottom-4 bg-white p-6 rounded-xl border-2 shadow-lg">
                            <div className="flex gap-4">
                                <Button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-[#8B7355] hover:bg-[#6d5940] text-white py-6 text-lg rounded-lg"
                                    disabled={box.stock_quantity <= 0}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Adicionar ao Carrinho
                                </Button>
                                <Button
                                    onClick={handleBuyNow}
                                    variant="outline"
                                    className="flex-1 py-6 text-lg rounded-lg"
                                    disabled={box.stock_quantity <= 0}
                                >
                                    Comprar Agora
                                </Button>
                            </div>
                            {box.stock_quantity <= 0 && (
                                <p className="text-center text-red-600 text-sm mt-2">Esgotado</p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
