import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Calendar, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const MESSAGE_TEMPLATES = [
    {
        title: 'Aniversário',
        message: 'Feliz aniversário! Que cada mês seja repleto de momentos especiais, assim como este presente que preparei com carinho para você. 🎂✨'
    },
    {
        title: 'Amor',
        message: 'Para você, com todo meu amor. Que estes momentos de autocuidado tragam paz e felicidade ao seu dia a dia. Você merece! ❤️'
    },
    {
        title: 'Amizade',
        message: 'Porque amizade verdadeira é sobre cuidar um do outro. Espero que você aproveite cada momento de relaxamento que este presente proporciona! 🌟'
    },
    {
        title: 'Gratidão',
        message: 'Um pequeno gesto de gratidão por tudo que você faz. Desejo que você desfrute destes momentos de bem-estar. Muito obrigado(a)! 🙏'
    }
];

export default function GiftMessageCard({ formData, onChange }) {
    const [showTemplates, setShowTemplates] = useState(true);
    const maxLength = 500;
    const currentLength = formData.giftMessage?.length || 0;

    const handleTemplateClick = (template) => {
        const event = {
            target: {
                name: 'giftMessage',
                value: template.message
            }
        };
        onChange(event);
        setShowTemplates(false);
    };

    return (
        <div className="py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-[#2C2419] mb-4">
                    Personalize sua mensagem
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Adicione uma mensagem especial que será enviada junto com o presente
                </p>
            </motion.div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                {/* Message Input */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                >
                    <Label htmlFor="giftMessage" className="text-lg font-bold text-[#2C2419] mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-[#8B7355]" />
                        Sua Mensagem
                    </Label>

                    <Textarea
                        id="giftMessage"
                        name="giftMessage"
                        value={formData.giftMessage || ''}
                        onChange={onChange}
                        placeholder="Escreva aqui sua mensagem carinhosa..."
                        rows={8}
                        maxLength={maxLength}
                        className="resize-none text-base"
                    />

                    <div className="flex justify-between items-center mt-2">
                        <span className={`text-sm ${currentLength > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-500'}`}>
                            {currentLength}/{maxLength} caracteres
                        </span>
                        {!formData.giftMessage && (
                            <button
                                onClick={() => setShowTemplates(!showTemplates)}
                                className="text-sm text-[#8B7355] hover:underline font-semibold"
                            >
                                {showTemplates ? 'Ocultar templates' : 'Ver templates'}
                            </button>
                        )}
                    </div>

                    {/* Send Date Option */}
                    <div className="mt-6 p-4 bg-[#8B7355]/5 rounded-xl">
                        <Label htmlFor="sendDate" className="text-sm font-semibold text-[#2C2419] mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#8B7355]" />
                            Quando enviar a notificação?
                        </Label>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <button
                                type="button"
                                onClick={() => onChange({ target: { name: 'sendImmediate', value: true } })}
                                className={`p-3 rounded-lg border-2 transition-all ${formData.sendImmediate
                                        ? 'border-[#8B7355] bg-[#8B7355]/10 text-[#8B7355] font-semibold'
                                        : 'border-gray-200 hover:border-[#8B7355]/50'
                                    }`}
                            >
                                Agora
                            </button>
                            <button
                                type="button"
                                onClick={() => onChange({ target: { name: 'sendImmediate', value: false } })}
                                className={`p-3 rounded-lg border-2 transition-all ${formData.sendImmediate === false
                                        ? 'border-[#8B7355] bg-[#8B7355]/10 text-[#8B7355] font-semibold'
                                        : 'border-gray-200 hover:border-[#8B7355]/50'
                                    }`}
                            >
                                Agendar
                            </button>
                        </div>

                        {formData.sendImmediate === false && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-3"
                            >
                                <input
                                    type="date"
                                    name="scheduledDate"
                                    value={formData.scheduledDate || ''}
                                    onChange={onChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-[#8B7355] transition-all"
                                />
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Preview Card & Templates */}
                <div className="space-y-6">
                    {/* Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-[#8B7355] to-[#D4A574] p-8 rounded-2xl shadow-2xl text-white"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Heart className="w-5 h-5" />
                            <span className="font-semibold">Preview do Cartão Digital</span>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl min-h-[200px]">
                            {formData.giftMessage ? (
                                <p className="text-white leading-relaxed whitespace-pre-wrap">
                                    {formData.giftMessage}
                                </p>
                            ) : (
                                <p className="text-white/60 italic">
                                    Sua mensagem aparecerá aqui...
                                </p>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/20">
                            <p className="text-sm text-white/80">
                                Enviado com carinho por:
                            </p>
                            <p className="font-semibold">
                                {formData.giverName || 'Seu nome'}
                            </p>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                            <Sparkles className="w-4 h-4" />
                            Este cartão será enviado por e-mail
                        </div>
                    </motion.div>

                    {/* Templates */}
                    {showTemplates && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                        >
                            <h3 className="font-bold text-[#2C2419] mb-4">Templates de Mensagem</h3>
                            <div className="space-y-3">
                                {MESSAGE_TEMPLATES.map((template, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleTemplateClick(template)}
                                        className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-[#8B7355]/50 hover:bg-[#8B7355]/5 transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge className="bg-[#8B7355]/10 text-[#8B7355] group-hover:bg-[#8B7355] group-hover:text-white transition-all">
                                                {template.title}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {template.message}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
