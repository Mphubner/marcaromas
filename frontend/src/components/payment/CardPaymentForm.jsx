import { useState } from 'react';
import { createCardToken, formatCardNumber, formatExpiration, formatDocument, validateCardNumber } from '@/lib/mercadopago';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CardPaymentForm({ orderId, total, onSuccess, onError }) {
    const [card, setCard] = useState({
        number: '',
        holderName: '',
        expiration: '',
        cvv: '',
        docType: 'CPF',
        docNumber: '',
    });

    const [installments, setInstallments] = useState('1');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!validateCardNumber(card.number)) {
            newErrors.number = 'Número de cartão inválido';
        }

        if (card.holderName.length < 3) {
            newErrors.holderName = 'Nome completo obrigatório';
        }

        if (!/^\d{2}\/\d{2}$/.test(card.expiration)) {
            newErrors.expiration = 'Data inválida (MM/AA)';
        }

        if (card.cvv.length < 3) {
            newErrors.cvv = 'CVV inválido';
        }

        const cleanDoc = card.docNumber.replace(/\D/g, '');
        if (card.docType === 'CPF' && cleanDoc.length !== 11) {
            newErrors.docNumber = 'CPF inválido';
        } else if (card.docType === 'CNPJ' && cleanDoc.length !== 14) {
            newErrors.docNumber = 'CNPJ inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const paymentMutation = useMutation({
        mutationFn: async () => {
            if (!validateForm()) {
                throw new Error('Por favor, corrija os erros no formulário');
            }

            // 1. Tokenize card (SECURE - happens in Mercado Pago servers)
            const [expMonth, expYear] = card.expiration.split('/');

            toast.info('Processando dados do cartão...');

            const token = await createCardToken({
                number: card.number.replace(/\s/g, ''),
                holderName: card.holderName,
                expMonth,
                expYear: '20' + expYear,
                cvv: card.cvv,
                docType: card.docType,
                docNumber: card.docNumber.replace(/\D/g, ''),
            });

            toast.info('Processando pagamento...');

            // 2. Send TOKEN to backend (NOT card data!)
            return api.post('/payment/create-transparent', {
                orderId,
                token: token.id, // Only the token!
                installments: parseInt(installments),
                paymentMethodId: token.paymentMethodId,
                issuerId: token.issuerId,
                payer: {
                    identificationType: card.docType,
                    identificationNumber: card.docNumber.replace(/\D/g, ''),
                }
            });
        },
        onSuccess: (response) => {
            if (response.data.approved) {
                toast.success('Pagamento aprovado!');
                onSuccess?.(response.data);
            } else {
                const errorMsg = response.data.statusDetail || 'Pagamento não aprovado';
                toast.error(errorMsg);
                onError?.(errorMsg);
            }
        },
        onError: (error) => {
            const errorMsg = error.response?.data?.message || error.message || 'Erro ao processar pagamento';
            toast.error(errorMsg);
            onError?.(errorMsg);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        paymentMutation.mutate();
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setCard({ ...card, number: formatted });
        if (errors.number) setErrors({ ...errors, number: null });
    };

    const handleExpirationChange = (e) => {
        const formatted = formatExpiration(e.target.value);
        setCard({ ...card, expiration: formatted });
        if (errors.expiration) setErrors({ ...errors, expiration: null });
    };

    const handleDocumentChange = (e) => {
        const formatted = formatDocument(e.target.value, card.docType);
        setCard({ ...card, docNumber: formatted });
        if (errors.docNumber) setErrors({ ...errors, docNumber: null });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>Seus dados estão seguros e criptografados</span>
            </div>

            {/* Card Number */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do cartão
                </label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={card.number}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent ${errors.number ? 'border-red-500' : 'border-gray-300'
                            }`}
                        required
                    />
                    <CreditCard className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
            </div>

            {/* Holder Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome no cartão
                </label>
                <input
                    type="text"
                    placeholder="NOME COMPLETO"
                    value={card.holderName}
                    onChange={(e) => {
                        setCard({ ...card, holderName: e.target.value.toUpperCase() });
                        if (errors.holderName) setErrors({ ...errors, holderName: null });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent ${errors.holderName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    required
                />
                {errors.holderName && <p className="text-red-500 text-xs mt-1">{errors.holderName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Expiration */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Validade
                    </label>
                    <input
                        type="text"
                        placeholder="MM/AA"
                        value={card.expiration}
                        onChange={handleExpirationChange}
                        maxLength={5}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent ${errors.expiration ? 'border-red-500' : 'border-gray-300'
                            }`}
                        required
                    />
                    {errors.expiration && <p className="text-red-500 text-xs mt-1">{errors.expiration}</p>}
                </div>

                {/* CVV */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                    </label>
                    <input
                        type="password"
                        placeholder="123"
                        value={card.cvv}
                        onChange={(e) => {
                            setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') });
                            if (errors.cvv) setErrors({ ...errors, cvv: null });
                        }}
                        maxLength={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent ${errors.cvv ? 'border-red-500' : 'border-gray-300'
                            }`}
                        required
                    />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
            </div>

            {/* Document */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                    </label>
                    <select
                        value={card.docType}
                        onChange={(e) => setCard({ ...card, docType: e.target.value, docNumber: '' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
                    >
                        <option value="CPF">CPF</option>
                        <option value="CNPJ">CNPJ</option>
                    </select>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {card.docType}
                    </label>
                    <input
                        type="text"
                        placeholder={card.docType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                        value={card.docNumber}
                        onChange={handleDocumentChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent ${errors.docNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                        required
                    />
                    {errors.docNumber && <p className="text-red-500 text-xs mt-1">{errors.docNumber}</p>}
                </div>
            </div>

            {/* Installments */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parcelamento
                </label>
                <select
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
                >
                    <option value="1">1x de R$ {total.toFixed(2)} sem juros</option>
                    <option value="2">2x de R$ {(total / 2).toFixed(2)} sem juros</option>
                    <option value="3">3x de R$ {(total / 3).toFixed(2)} sem juros</option>
                    <option value="4">4x de R$ {(total / 4).toFixed(2)} sem juros</option>
                    <option value="5">5x de R$ {(total / 5).toFixed(2)} sem juros</option>
                    <option value="6">6x de R$ {(total / 6).toFixed(2)} sem juros</option>
                </select>
            </div>

            {/* Submit */}
            <Button
                type="submit"
                disabled={paymentMutation.isLoading}
                className="w-full bg-[#8B7355] hover:bg-[#7A6548] text-white py-6 text-lg font-semibold"
            >
                {paymentMutation.isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processando...
                    </span>
                ) : (
                    `Pagar R$ ${total.toFixed(2)}`
                )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
                Ao finalizar a compra, você concorda com nossos termos e condições
            </p>
        </form>
    );
}
