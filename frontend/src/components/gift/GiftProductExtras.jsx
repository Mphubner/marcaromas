import React from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export default function GiftProductExtras({ products, selectedExtras, onToggleExtra, onQuantityChange, isLoading }) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
            </div>
        );
    }

    const featuredProducts = products?.filter(p => p.featured || p.category === 'gift-extra')?.slice(0, 6) || [];

    if (featuredProducts.length === 0) {
        return null;
    }

    return (
        <div className="py-16 bg-gradient-to-br from-[#FAFAF9] to-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-[#2C2419] mb-4">
                    Adicione produtos especiais
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Torne o presente ainda mais completo com produtos exclusivos da Marc Store
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {featuredProducts.map((product, index) => {
                    const isSelected = selectedExtras?.some(extra => extra.productId === product.id);
                    const selectedExtra = selectedExtras?.find(extra => extra.productId === product.id);
                    const quantity = selectedExtra?.quantity || 1;

                    return (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden ${isSelected
                                    ? 'border-[#8B7355] shadow-xl'
                                    : 'border-gray-200 hover:border-[#8B7355]/50'
                                }`}
                        >
                            {/* Product Image */}
                            <div className="relative h-48 bg-gray-100 overflow-hidden group">
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-16 h-16 text-gray-300" />
                                    </div>
                                )}

                                {/* Select Checkbox Overlay */}
                                <div className="absolute top-3 right-3">
                                    <div
                                        onClick={() => onToggleExtra(product)}
                                        className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-all ${isSelected
                                                ? 'bg-[#8B7355] shadow-lg scale-110'
                                                : 'bg-white/90 hover:bg-white'
                                            }`}
                                    >
                                        {isSelected ? (
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <Plus className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Badge */}
                                {product.stock < 10 && product.stock > 0 && (
                                    <div className="absolute top-3 left-3">
                                        <Badge className="bg-orange-500 text-white">
                                            Últimas unidades!
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                <h3 className="font-bold text-[#2C2419] text-lg mb-2 line-clamp-2">
                                    {product.name}
                                </h3>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {product.description}
                                </p>

                                {/* Price */}
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-2xl font-bold text-[#8B7355]">
                                        R$ {product.price.toFixed(2)}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-sm text-gray-400 line-through">
                                            R$ {product.originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {/* Quantity Selector (only when selected) */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="flex items-center justify-between p-3 bg-[#8B7355]/5 rounded-xl"
                                    >
                                        <span className="text-sm font-semibold text-[#2C2419]">Quantidade:</span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => onQuantityChange(product.id, Math.max(1, quantity - 1))}
                                                className="w-8 h-8 rounded-lg bg-white border-2 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-all flex items-center justify-center"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-bold text-[#2C2419]">{quantity}</span>
                                            <button
                                                onClick={() => onQuantityChange(product.id, Math.min(product.stock || 99, quantity + 1))}
                                                className="w-8 h-8 rounded-lg bg-white border-2 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-all flex items-center justify-center"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Add/Remove Button */}
                                <button
                                    onClick={() => onToggleExtra(product)}
                                    className={`w-full py-3 mt-4 rounded-xl font-semibold transition-all duration-300 ${isSelected
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200'
                                            : 'bg-[#8B7355] text-white hover:bg-[#6B5845] shadow-md'
                                        }`}
                                >
                                    {isSelected ? 'Remover do Presente' : 'Adicionar ao Presente'}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Summary of added extras */}
            {selectedExtras && selectedExtras.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <ShoppingBag className="w-5 h-5 text-[#8B7355]" />
                        <h3 className="font-bold text-[#2C2419]">
                            Produtos Adicionais ({selectedExtras.length})
                        </h3>
                    </div>
                    <div className="space-y-2">
                        {selectedExtras.map(extra => {
                            const product = featuredProducts.find(p => p.id === extra.productId);
                            return (
                                <div key={extra.productId} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700">
                                        {product?.name} <span className="text-gray-500">x{extra.quantity}</span>
                                    </span>
                                    <span className="font-semibold text-[#8B7355]">
                                        R$ {(product?.price * extra.quantity).toFixed(2)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
