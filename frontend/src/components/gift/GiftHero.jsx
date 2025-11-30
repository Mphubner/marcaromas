import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, Sparkles, Star } from 'lucide-react';

export default function GiftHero({ onStartClick }) {
    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#8B7355]/5 via-white to-[#D4A574]/10">
            {/* Decorative Elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-[#D4A574]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#8B7355]/5 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#8B7355]/10 to-[#D4A574]/10 border border-[#8B7355]/20 mb-8"
                    >
                        <Sparkles className="w-5 h-5 text-[#8B7355]" />
                        <span className="text-sm font-semibold text-[#8B7355]">
                            Presenteie Autocuidado e Bem-Estar
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-7xl font-bold text-[#2C2419] mb-6 leading-tight"
                    >
                        O presente perfeito para
                        <br />
                        <span className="bg-gradient-to-r from-[#8B7355] to-[#D4A574] bg-clip-text text-transparent">
                            quem você ama
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
                    >
                        Presenteie uma experiência mensal de aromaterapia artesanal.
                        <br className="hidden md:block" />
                        Velas exclusivas, bem-estar e momentos de autocuidado.
                    </motion.p>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid md:grid-cols-3 gap-6 mb-12"
                    >
                        {[
                            {
                                icon: Gift,
                                title: 'Experiência Completa',
                                description: 'Velas artesanais + conteúdo exclusivo mensal'
                            },
                            {
                                icon: Heart,
                                title: 'Totalmente Personalizável',
                                description: 'Escolha duração, plano e mensagem especial'
                            },
                            {
                                icon: Star,
                                title: 'Entrega Especial',
                                description: 'Embalagem premium direto para o presenteado'
                            }
                        ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#8B7355] to-[#D4A574] flex items-center justify-center">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-bold text-[#2C2419] mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* CTA Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStartClick}
                        className="px-12 py-5 bg-gradient-to-r from-[#8B7355] to-[#D4A574] text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-[#8B7355]/50 transition-all duration-300 flex items-center gap-3 mx-auto"
                    >
                        <Gift className="w-6 h-6" />
                        Começar a Presentear
                    </motion.button>

                    {/* Trust Badge */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-8 text-sm text-gray-500 flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Mais de 500 presentes enviados com amor
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
