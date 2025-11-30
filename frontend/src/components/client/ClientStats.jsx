import React from 'react';
import { ClientCard } from './ClientCard';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Premium Stats Card for Dashboards
 * Shows: Icon, Label, Value, Trend
 */
export function ClientStats({
    icon: Icon,
    label,
    value,
    trend,
    trendValue,
    format = 'number',
    delay = 0
}) {
    const formatValue = (val) => {
        if (format === 'currency') return `R$ ${val.toFixed(2)}`;
        if (format === 'percentage') return `${val}%`;
        return val;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay }}
        >
            <ClientCard hoverable className="overflow-hidden relative">
                {/* Background Icon (Watermark) */}
                <div className="absolute top-0 right-0 opacity-5 transform translate-x-6 -translate-y-6">
                    <Icon className="w-40 h-40" />
                </div>

                <div className="relative z-10 flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B7355] to-[#7A6548] flex items-center justify-center shadow-lg">
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                {label}
                            </p>
                        </div>

                        <motion.p
                            className="text-3xl font-bold text-[#2C2419] font-['Playfair_Display']"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: delay + 0.2 }}
                        >
                            {formatValue(value)}
                        </motion.p>

                        {trend && (
                            <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {trend === 'up' ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}
                                <span>{trendValue}</span>
                            </div>
                        )}
                    </div>
                </div>
            </ClientCard>
        </motion.div>
    );
}
