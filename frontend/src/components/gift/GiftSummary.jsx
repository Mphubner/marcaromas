import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Calendar, User, Mail, MapPin, MessageCircle, Package, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function GiftSummary({ giftData, onCheckout, isLoading }) {
    const {
        selectedPlan,
        selectedDuration,
        formData,
        selectedExtras,
    } = giftData;

    if (!selectedPlan || !selectedDuration) {
        return null;
    }

    // Calculate totals
    const subscriptionTotal = selectedPlan.price * selectedDuration;
    const extrasTotal = selectedExtras?.reduce((sum, extra) => {
        const product = extra.product;
        return sum + (product?.price || 0) * extra.quantity;
    }, 0) || 0;

    const subtotal = subscriptionTotal + extrasTotal;
    const discount = selectedDuration >= 12 ? 0.15 : selectedDuration >= 6 ? 0.10 : selectedDuration >= 3 ? 0.05 : 0;
    const discountAmount = subscriptionTotal * discount;
    const total = subtotal - discountAmount;

    // Check if form is complete
    const isFormComplete = formData.giverName && formData.giverEmail && formData.giverCPF &&
        formData.recipientName && formData.recipientEmail && formData.recipientZipCode &&
        formData.recipientStreet && formData.recipientNumber && formData.recipientCity && formData.giftMessage;

    return (
        <div className="py-16 bg-gradient-to-br from-white via-[#FAFAF9] to-[#8B7355]/5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-[#2C2419] mb-4">
                    Resumo do Presente
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Revise todas as informações antes de finalizar
                </p>
            </motion.div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
                {/* Left Column - Gift Details */}
                <div className="md:col-span-2 space-y-6">
                    {/* Plan & Duration */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Gift className="w-5 h-5 text-[#8B7355]" />
                            <h3 className="font-bold text-[#2C2419]">Assinatura</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Plano:</span>
                                <span className="font-semibold text-[#2C2419]">{selectedPlan.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Duração:</span>
                                <span className="font-semibold text-[#2C2419]">
                                    {selectedDuration} {selectedDuration === 1 ? 'mês' : 'meses'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Valor mensal:</span>
                                <span className="font-semibold text-[#8B7355]">R$ {selectedPlan.price.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recipient Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-[#8B7355]" />
                            <h3 className="font-bold text-[#2C2419]">Presenteado</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p className="font-semibold text-[#2C2419]">{formData.recipientName || '-'}</p>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4" />
                                {formData.recipientEmail || '-'}
                            </div>
                            <div className="flex items-start gap-2 text-gray-600">
                                <MapPin className="w-4 h-4 mt-0.5" />
                                <span>
                                    {formData.recipientStreet}, {formData.recipientNumber}
                                    {formData.recipientComplement && ` - ${formData.recipientComplement}`}
                                    <br />
                                    {formData.recipientNeighborhood}, {formData.recipientCity} - {formData.recipientState}
                                    <br />
                                    CEP: {formData.recipientZipCode}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Message Preview */}
                    {formData.giftMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-[#8B7355] to-[#D4A574] p-6 rounded-2xl shadow-lg text-white"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <MessageCircle className="w-5 h-5" />
                                <h3 className="font-bold">Sua Mensagem</h3>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap bg-white/10 p-4 rounded-xl">
                                "{formData.giftMessage}"
                            </p>
                            <p className="text-xs mt-3 text-white/80">
                                - {formData.giverName}
                            </p>
                            {formData.scheduledDate && (
                                <div className="flex items-center gap-2 mt-3 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    Envio agendado para: {new Date(formData.scheduledDate).toLocaleDateString('pt-BR')}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Extras */}
                    {selectedExtras && selectedExtras.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="w-5 h-5 text-[#8B7355]" />
                                <h3 className="font-bold text-[#2C2419]">Produtos Adicionais</h3>
                            </div>
                            <div className="space-y-2">
                                {selectedExtras.map(extra => (
                                    <div key={extra.productId} className="flex justify-between text-sm">
                                        <span className="text-gray-700">
                                            {extra.product?.name} <span className="text-gray-500">x{extra.quantity}</span>
                                        </span>
                                        <span className="font-semibold text-[#8B7355]">
                                            R$ {((extra.product?.price || 0) * extra.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right Column - Pricing */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <CreditCard className="w-5 h-5 text-[#8B7355]" />
                            <h3 className="font-bold text-[#2C2419]">Valor Total</h3>
                        </div>

                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Assinatura ({selectedDuration}x)</span>
                                <span className="font-semibold">R$ {subscriptionTotal.toFixed(2)}</span>
                            </div>

                            {extrasTotal > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Produtos extras</span>
                                    <span className="font-semibold">R$ {extrasTotal.toFixed(2)}</span>
                                </div>
                            )}

                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Desconto ({(discount * 100).toFixed(0)}%)</span>
                                    <span className="font-semibold">- R$ {discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <Separator className="my-4" />

                        <div className="flex justify-between items-baseline mb-6">
                            <span className="text-lg font-semibold text-[#2C2419]">Total</span>
                            <p className="text-4xl font-bold text-[#8B7355]">
                                R$ {total.toFixed(2)}
                            </p>
                        </div>

                        {/* Installment info */}
                        <div className="p-4 bg-[#8B7355]/5 rounded-xl mb-6">
                            <p className="text-xs text-gray-600 text-center">
                                Em até 12x de R$ {(total / 12).toFixed(2)} sem juros
                            </p>
                            <p className="text-xs text-gray-500 text-center mt-1">
                                Opções de parcelamento disponíveis no checkout
                            </p>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={onCheckout}
                            disabled={!isFormComplete || isLoading}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${isFormComplete && !isLoading
                                    ? 'bg-gradient-to-r from-[#8B7355] to-[#D4A574] text-white shadow-lg hover:shadow-xl hover:scale-105'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processando...
                                </>
                            ) : isFormComplete ? (
                                <>
                                    Ir para o Pagamento
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            ) : (
                                'Preencha todos os campos'
                            )}
                        </button>

                        {/* Trust Badges */}
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Pagamento 100% seguro
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Frete grátis incluído
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Embalagem premium para presentes
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
