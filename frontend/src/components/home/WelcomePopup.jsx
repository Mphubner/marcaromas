import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Gift, Truck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export function WelcomePopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [neverShow, setNeverShow] = useState(false);

    // Fetch public config
    const { data: config } = useQuery({
        queryKey: ['public-config'],
        queryFn: async () => {
            const response = await api.get('/config/public');
            return response.data;
        },
    });

    useEffect(() => {
        // Check if user has seen popup before
        const hasSeenPopup = localStorage.getItem('welcomePopupSeen');

        if (!hasSeenPopup && config) {
            // Show popup after 2 seconds
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [config]);

    const handleClose = () => {
        setIsOpen(false);

        if (neverShow) {
            localStorage.setItem('welcomePopupSeen', 'true');
        }
    };

    if (!config) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={handleClose}
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                            {/* Header with gradient */}
                            <div className="bg-gradient-to-br from-[#8B7355] to-[#7A6548] p-8 text-white text-center relative">
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-10 h-10" />
                                </div>

                                <h2 className="font-playfair text-3xl font-bold mb-2">
                                    Bem-vindo à Marc Aromas!
                                </h2>
                                <p className="text-white/90">
                                    Aproveite benefícios exclusivos na sua primeira compra
                                </p>
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-6">
                                {/* Coupon Benefit */}
                                {config.welcomeCoupon && (
                                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <Gift className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {config.welcomeCoupon.discount}{config.welcomeCoupon.type === 'percent' ? '%' : 'R$'} de Desconto
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Use o cupom na sua primeira compra
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <code className="bg-white px-4 py-2 rounded-lg border-2 border-dashed border-green-300 font-mono font-bold text-green-700">
                                                    {config.welcomeCoupon.code}
                                                </code>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(config.welcomeCoupon.code);
                                                        alert('Cupom copiado!');
                                                    }}
                                                    className="text-green-600 hover:text-green-700"
                                                >
                                                    Copiar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Free Shipping Benefit */}
                                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <Truck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            Frete Grátis
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Em compras acima de <span className="font-bold text-blue-600">R$ {config.freeShippingMinimum.toFixed(2)}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Button
                                    onClick={handleClose}
                                    className="w-full bg-[#8B7355] hover:bg-[#7A6548] text-white py-6 text-lg font-semibold"
                                >
                                    Começar a Comprar
                                </Button>

                                {/* Never show again checkbox */}
                                <label className="flex items-center gap-2 cursor-pointer justify-center">
                                    <input
                                        type="checkbox"
                                        checked={neverShow}
                                        onChange={(e) => setNeverShow(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#8B7355] focus:ring-[#8B7355]"
                                    />
                                    <span className="text-sm text-gray-600">Não mostrar novamente</span>
                                </label>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
