import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    CreditCard,
    Plus,
    Trash2,
    Star,
    Shield,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Premium Client Components
import {
    ClientPageHeader,
    ClientCard,
    ClientButton,
    ClientEmptyState,
    ClientBadge
} from '@/components/client';

// UI Components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

// Services
import { paymentMethodService } from '../services/paymentMethodService';
import { useAuth } from '../context/AuthContext';

export default function PaymentMethods() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false
    });

    // Fetch payment methods
    const { data: paymentMethods = [], isLoading } = useQuery({
        queryKey: ['my-payment-methods'],
        queryFn: paymentMethodService.getMyMethods,
        enabled: !!user
    });

    // Add payment method mutation
    const addMutation = useMutation({
        mutationFn: (data) => paymentMethodService.add(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-payment-methods']);
            toast.success('Cartão adicionado com sucesso!');
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erro ao adicionar cartão');
        }
    });

    // Delete payment method mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => paymentMethodService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-payment-methods']);
            toast.success('Cartão removido!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erro ao remover cartão');
        }
    });

    // Set default payment method mutation
    const setDefaultMutation = useMutation({
        mutationFn: (id) => paymentMethodService.setDefault(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-payment-methods']);
            toast.success('Cartão padrão atualizado!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erro ao definir cartão padrão');
        }
    });

    const handleOpenModal = () => {
        setFormData({
            cardNumber: '',
            cardName: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '',
            isDefault: false
        });
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFormData({
            cardNumber: '',
            cardName: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '',
            isDefault: false
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addMutation.mutate(formData);
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja remover este cartão?')) {
            deleteMutation.mutate(id);
        }
    };

    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\s/g, '');
        const chunks = cleaned.match(/.{1,4}/g) || [];
        return chunks.join(' ').substr(0, 19); // Max 16 digits + 3 spaces
    };

    const getCardBrand = (number) => {
        const cleaned = number.replace(/\s/g, '');
        if (/^4/.test(cleaned)) return 'Visa';
        if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
        if (/^3[47]/.test(cleaned)) return 'Amex';
        if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
        if (/^35/.test(cleaned)) return 'JCB';
        return 'Card';
    };

    const getCardColor = (brand) => {
        const colors = {
            'Visa': 'from-blue-600 to-blue-700',
            'Mastercard': 'from-red-600 to-orange-600',
            'Amex': 'from-green-600 to-teal-600',
            'Discover': 'from-orange-600 to-yellow-600',
            'JCB': 'from-purple-600 to-pink-600',
            'Card': 'from-gray-700 to-gray-900'
        };
        return colors[brand] || colors['Card'];
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <ClientPageHeader
                    title="Meios de Pagamento"
                    subtitle="Gerencie seus cartões de crédito salvos"
                    backTo="/dashboard"
                    action={
                        <ClientButton onClick={handleOpenModal}>
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Cartão
                        </ClientButton>
                    }
                />

                {/* Security Notice */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-blue-900 mb-1">
                                    Seus dados estão seguros
                                </p>
                                <p className="text-sm text-blue-800">
                                    Utilizamos criptografia de ponta e não armazenamos dados completos do cartão.
                                    Suas informações são protegidas segundo as normas PCI-DSS.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {paymentMethods.length === 0 ? (
                    <ClientEmptyState
                        icon={CreditCard}
                        title="Nenhum cartão cadastrado"
                        message="Adicione um cartão para facilitar suas compras futuras"
                        actionLabel="Adicionar Cartão"
                        onAction={() => handleOpenModal()}
                    />
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {paymentMethods.map((method, index) => {
                            const brand = getCardBrand(method.last4 || '');
                            const colors = getCardColor(brand);

                            return (
                                <motion.div
                                    key={method.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ClientCard hoverable className="relative overflow-hidden">
                                        {/* Default Badge */}
                                        {method.isDefault && (
                                            <div className="absolute top-4 right-4 z-10">
                                                <ClientBadge variant="active">
                                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                                    Padrão
                                                </ClientBadge>
                                            </div>
                                        )}

                                        {/* Card Visual */}
                                        <div className={`rounded-2xl bg-gradient-to-br ${colors} p-6 text-white mb-4 shadow-lg`}>
                                            <div className="flex items-start justify-between mb-8">
                                                <CreditCard className="w-10 h-10 opacity-80" />
                                                <div className="text-right">
                                                    <p className="text-xs opacity-70">Bandeira</p>
                                                    <p className="font-bold text-lg">{brand}</p>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <p className="font-mono text-2xl tracking-wider mb-2">
                                                    •••• •••• •••• {method.last4 || '****'}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-xs opacity-70 mb-1">Nome no Cartão</p>
                                                    <p className="font-semibold text-sm truncate max-w-[200px]">
                                                        {method.holderName || 'TITULAR DO CARTÃO'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs opacity-70 mb-1">Validade</p>
                                                    <p className="font-mono font-semibold">
                                                        {method.expiryMonth}/{method.expiryYear}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Info */}
                                        <div className="space-y-3 mb-4">
                                            {method.isDefault && (
                                                <div className="flex items-center gap-2 text-sm text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>Usado por padrão nas compras</span>
                                                </div>
                                            )}

                                            <div className="text-sm text-gray-600">
                                                <p>Adicionado em {method.createdAt ? new Date(method.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-4 border-t">
                                            {!method.isDefault && (
                                                <ClientButton
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDefaultMutation.mutate(method.id)}
                                                    disabled={setDefaultMutation.isPending}
                                                >
                                                    <Star className="w-4 h-4 mr-2" />
                                                    Tornar Padrão
                                                </ClientButton>
                                            )}

                                            <ClientButton
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(method.id)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remover
                                            </ClientButton>
                                        </div>
                                    </ClientCard>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Add Card Modal */}
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="max-w-md rounded-3xl">
                        <DialogHeader>
                            <DialogTitle>Adicionar Cartão de Crédito</DialogTitle>
                            <DialogDescription>
                                Digite os dados do seu cartão com segurança
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            {/* Card Number */}
                            <div>
                                <Label htmlFor="cardNumber">Número do Cartão *</Label>
                                <Input
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={(e) => {
                                        const formatted = formatCardNumber(e.target.value);
                                        setFormData(prev => ({ ...prev, cardNumber: formatted }));
                                    }}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    className="rounded-2xl mt-2"
                                    required
                                />
                            </div>

                            {/* Card Name */}
                            <div>
                                <Label htmlFor="cardName">Nome no Cartão *</Label>
                                <Input
                                    id="cardName"
                                    name="cardName"
                                    value={formData.cardName}
                                    onChange={handleChange}
                                    placeholder="NOME COMO NO CARTÃO"
                                    className="rounded-2xl mt-2 uppercase"
                                    required
                                />
                            </div>

                            {/* Expiry and CVV */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="expiryMonth">Mês *</Label>
                                    <Select
                                        value={formData.expiryMonth}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, expiryMonth: value }))}
                                    >
                                        <SelectTrigger className="rounded-2xl mt-2">
                                            <SelectValue placeholder="MM" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                                <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                                                    {month.toString().padStart(2, '0')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="expiryYear">Ano *</Label>
                                    <Select
                                        value={formData.expiryYear}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, expiryYear: value }))}
                                    >
                                        <SelectTrigger className="rounded-2xl mt-2">
                                            <SelectValue placeholder="AA" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                                <SelectItem key={year} value={year.toString().slice(-2)}>
                                                    {year.toString().slice(-2)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="cvv">CVV *</Label>
                                    <Input
                                        id="cvv"
                                        name="cvv"
                                        type="password"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        placeholder="123"
                                        maxLength={4}
                                        className="rounded-2xl mt-2"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Set as Default */}
                            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-2xl">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                                    className="w-4 h-4 text-[#8B7355] rounded"
                                />
                                <Label htmlFor="isDefault" className="cursor-pointer">
                                    Usar como cartão padrão
                                </Label>
                            </div>

                            {/* Security Info */}
                            <div className="p-3 bg-blue-50 rounded-2xl">
                                <p className="text-xs text-blue-900">
                                    <Shield className="w-3 h-3 inline mr-1" />
                                    Seus dados são criptografados e protegidos
                                </p>
                            </div>
                        </form>

                        <DialogFooter>
                            <ClientButton variant="ghost" onClick={handleCloseModal} type="button">
                                Cancelar
                            </ClientButton>
                            <ClientButton
                                onClick={handleSubmit}
                                disabled={addMutation.isPending}
                            >
                                {addMutation.isPending ? 'Adicionando...' : 'Adicionar Cartão'}
                            </ClientButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
