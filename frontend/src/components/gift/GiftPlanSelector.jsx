import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function GiftPlanSelector({ plans, selectedPlan, onSelectPlan, isLoading }) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
            </div>
        );
    }

    return (
        <div className="py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-[#2C2419] mb-4">
                    Escolha o plano perfeito
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Selecione a assinatura que melhor combina com quem você quer presentear
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, index) => {
                    const isSelected = selectedPlan?.id === plan.id;
                    const isPopular = plan.name.toLowerCase().includes('plus');

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                        >
                            <Card
                                onClick={() => onSelectPlan(plan)}
                                className={`relative cursor-pointer transition-all duration-300 h-full ${isSelected
                                        ? 'border-[#8B7355] border-3 shadow-2xl scale-105 bg-gradient-to-br from-white to-[#8B7355]/5'
                                        : 'border-gray-200 border-2 hover:border-[#8B7355]/50 hover:shadow-lg'
                                    } ${isPopular ? 'scale-105' : ''}`}
                            >
                                {/* Popular Badge */}
                                {isPopular && !isSelected && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 text-sm font-bold shadow-lg">
                                            <Crown className="w-4 h-4 inline mr-1" />
                                            MAIS POPULAR
                                        </Badge>
                                    </div>
                                )}

                                {/* Selected Badge */}
                                {isSelected && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                        <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 text-sm font-bold shadow-lg animate-pulse">
                                            <Check className="w-4 h-4 inline mr-1" />
                                            SELECIONADO
                                        </Badge>
                                    </div>
                                )}

                                <CardContent className="p-8 text-center">
                                    {/* Plan Icon */}
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isSelected
                                            ? 'bg-gradient-to-br from-[#8B7355] to-[#D4A574]'
                                            : 'bg-gray-100'
                                        } flex items-center justify-center transition-all duration-300`}>
                                        <Sparkles className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                                    </div>

                                    {/* Plan Name */}
                                    <h3 className="text-3xl font-bold text-[#2C2419] mb-2">
                                        {plan.name}
                                    </h3>

                                    {/* Price */}
                                    <div className="text-5xl font-bold text-[#8B7355] mb-4">
                                        R$ {plan.price.toFixed(2).replace('.', ',')}
                                        <span className="text-lg text-gray-500 font-normal">/mês</span>
                                    </div>

                                    {/* Discount Badge */}
                                    {plan.discount_percentage && (
                                        <Badge className="bg-green-100 text-green-800 mb-4">
                                            💰 Economize {plan.discount_percentage}%
                                        </Badge>
                                    )}

                                    {/* Description */}
                                    <p className="text-gray-600 mb-6">{plan.description}</p>

                                    {/* Items Included */}
                                    <div className="space-y-3 mb-6 text-left">
                                        <p className="font-semibold text-[#2C2419] text-sm uppercase tracking-wide text-center mb-4">
                                            📦 O que está incluído:
                                        </p>
                                        {plan.items_included?.map((item, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className={`w-6 h-6 rounded-full ${isSelected ? 'bg-[#8B7355]' : 'bg-gray-200'
                                                    } flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300`}>
                                                    <Check className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                                                </div>
                                                <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Benefits */}
                                    {plan.benefits && plan.benefits.length > 0 && (
                                        <div className="space-y-3 pt-6 border-t text-left">
                                            <p className="font-semibold text-[#2C2419] text-sm uppercase tracking-wide text-center mb-4">
                                                🎁 Benefícios extras:
                                            </p>
                                            {plan.benefits.slice(0, 3).map((benefit, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <span className="text-xl flex-shrink-0">✨</span>
                                                    <span className="text-gray-700 text-sm leading-relaxed">{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Select Button */}
                                    <button
                                        className={`w-full py-4 mt-6 rounded-xl font-bold text-lg transition-all duration-300 ${isSelected
                                                ? 'bg-gradient-to-r from-[#8B7355] to-[#D4A574] text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {isSelected ? 'Plano Selecionado ✓' : 'Selecionar Este Plano'}
                                    </button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
