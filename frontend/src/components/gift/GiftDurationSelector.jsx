import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Gift, Heart, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DURATION_SUGGESTIONS = [
    { months: 1, label: '1 Mês', subtitle: 'Uma surpresa única', icon: Gift },
    { months: 3, label: '3 Meses', subtitle: 'Um trimestre de autocuidado', icon: Heart, popular: true },
    { months: 6, label: '6 Meses', subtitle: 'Meio ano de bem-estar', icon: Sparkles },
    { months: 12, label: '12 Meses', subtitle: 'Um ano completo', icon: Calendar, best: true },
];

export default function GiftDurationSelector({ selectedDuration, onSelectDuration, planPrice }) {
    const calculateTotal = (months) => {
        return (planPrice * months).toFixed(2);
    };

    const calculateDiscount = (months) => {
        if (months >= 12) return 15;
        if (months >= 6) return 10;
        if (months >= 3) return 5;
        return 0;
    };

    return (
        <div className="py-16 bg-gradient-to-br from-[#FAFAF9] to-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-[#2C2419] mb-4">
                    Por quanto tempo?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Escolha a duração do presente. Quanto mais meses, maior o desconto!
                </p>
            </motion.div>

            {/* Quick Selection Buttons */}
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-8">
                {DURATION_SUGGESTIONS.map((option, index) => {
                    const Icon = option.icon;
                    const isSelected = selectedDuration === option.months;
                    const discount = calculateDiscount(option.months);

                    return (
                        <motion.button
                            key={option.months}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelectDuration(option.months)}
                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${isSelected
                                    ? 'border-[#8B7355] bg-gradient-to-br from-[#8B7355]/10 to-[#D4A574]/10 shadow-xl'
                                    : 'border-gray-200 bg-white hover:border-[#8B7355]/50 hover:shadow-lg'
                                }`}
                        >
                            {/* Popular/Best Badge */}
                            {option.popular && (
                                <div className="absolute -top-3 -right-3">
                                    <Badge className="bg-purple-600 text-white">Mais Escolhido</Badge>
                                </div>
                            )}
                            {option.best && (
                                <div className="absolute -top-3 -right-3">
                                    <Badge className="bg-green-600 text-white">Melhor Valor</Badge>
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`w-14 h-14 mx-auto mb-3 rounded-xl ${isSelected
                                    ? 'bg-gradient-to-br from-[#8B7355] to-[#D4A574]'
                                    : 'bg-gray-100'
                                } flex items-center justify-center transition-all duration-300`}>
                                <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                            </div>

                            {/* Label */}
                            <p className={`text-2xl font-bold mb-1 ${isSelected ? 'text-[#8B7355]' : 'text-[#2C2419]'
                                }`}>
                                {option.label}
                            </p>

                            {/* Subtitle */}
                            <p className="text-sm text-gray-600 mb-3">{option.subtitle}</p>

                            {/* Price */}
                            <p className="text-lg font-bold text-[#8B7355]">
                                R$ {calculateTotal(option.months)}
                            </p>

                            {/* Discount Badge */}
                            {discount > 0 && (
                                <Badge className="mt-2 bg-green-100 text-green-800">
                                    -{discount}% desconto
                                </Badge>
                            )}

                            {/* Selected Indicator */}
                            {isSelected && (
                                <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-[#8B7355] flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Custom Duration Slider */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            >
                <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold text-[#2C2419]">
                        Ou escolha uma duração personalizada:
                    </label>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-[#8B7355]">
                            {selectedDuration} {selectedDuration === 1 ? 'mês' : 'meses'}
                        </p>
                        {calculateDiscount(selectedDuration) > 0 && (
                            <Badge className="mt-1 bg-green-100 text-green-800">
                                -{calculateDiscount(selectedDuration)}% de desconto
                            </Badge>
                        )}
                    </div>
                </div>

                <input
                    type="range"
                    min="1"
                    max="12"
                    value={selectedDuration}
                    onChange={(e) => onSelectDuration(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8B7355]"
                    style={{
                        background: `linear-gradient(to right, #8B7355 0%, #8B7355 ${(selectedDuration / 12) * 100}%, #e5e7eb ${(selectedDuration / 12) * 100}%, #e5e7eb 100%)`
                    }}
                />

                <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>1 mês</span>
                    <span>12 meses</span>
                </div>

                {/* Total Calculation */}
                <div className="mt-6 p-4 bg-[#8B7355]/5 rounded-xl">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Valor total do presente:</p>
                            <p className="text-xs text-gray-500">
                                {selectedDuration} x R$ {planPrice.toFixed(2)}
                                {calculateDiscount(selectedDuration) > 0 &&
                                    ` (com ${calculateDiscount(selectedDuration)}% desconto)`
                                }
                            </p>
                        </div>
                        <p className="text-3xl font-bold text-[#8B7355]">
                            R$ {calculateTotal(selectedDuration)}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
