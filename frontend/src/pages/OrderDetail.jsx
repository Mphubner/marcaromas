import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Package,
    Truck,
    CheckCircle,
    CreditCard,
    MapPin,
    Download,
    Clock,
    Phone,
    Mail,
    AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

// Premium Client Components
import {
    ClientPageHeader,
    ClientCard,
    ClientButton,
    ClientBadge,
    getStatusBadge
} from '@/components/client';

// Services
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

export default function OrderDetail() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => orderService.getById(orderId),
        enabled: !!user && !!orderId
    });

    const handleDownloadInvoice = () => {
        // TODO: Implement invoice download
        window.open(`/orders/${orderId}/invoice`, '_blank');
    };

    const handleTrackOrder = () => {
        navigate(`/pedido/${orderId}/rastrear`);
    };

    // Order status timeline
    const getOrderTimeline = (status) => {
        const stages = [
            {
                key: 'PENDING_PAYMENT',
                label: 'Pedido Criado',
                icon: Clock,
                description: 'Aguardando pagamento'
            },
            {
                key: 'CONFIRMED',
                label: 'Pagamento Confirmado',
                icon: CheckCircle,
                description: 'Pedido confirmado'
            },
            {
                key: 'PREPARING',
                label: 'Em Preparação',
                icon: Package,
                description: 'Separando produtos'
            },
            {
                key: 'SHIPPED',
                label: 'Enviado',
                icon: Truck,
                description: 'A caminho'
            },
            {
                key: 'DELIVERED',
                label: 'Entregue',
                icon: CheckCircle,
                description: 'Pedido finalizado'
            }
        ];

        const statusOrder = ['PENDING_PAYMENT', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'];
        const currentIndex = statusOrder.indexOf(status);

        return stages.map((stage, index) => ({
            ...stage,
            completed: index <= currentIndex,
            active: index === currentIndex
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <ClientPageHeader
                        title="Pedido não encontrado"
                        subtitle="O pedido que você está procurando não existe"
                        backTo="/minhas-compras"
                    />
                    <ClientCard>
                        <div className="text-center py-12">
                            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-6">Não foi possível encontrar este pedido</p>
                            <ClientButton onClick={() => navigate('/minhas-compras')}>
                                Ver Meus Pedidos
                            </ClientButton>
                        </div>
                    </ClientCard>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusBadge(order.status);
    const timeline = getOrderTimeline(order.status);
    const canTrack = ['SHIPPED', 'DELIVERED'].includes(order.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <ClientPageHeader
                    title={`Pedido #${order.orderNumber || order.id}`}
                    subtitle={`Realizado em ${format(new Date(order.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}`}
                    backTo="/minhas-compras"
                    action={
                        <div className="flex gap-3">
                            {canTrack && order.trackingCode && (
                                <ClientButton variant="outline" onClick={handleTrackOrder}>
                                    <Truck className="w-4 h-4 mr-2" />
                                    Rastrear Pedido
                                </ClientButton>
                            )}
                            <ClientButton variant="outline" onClick={handleDownloadInvoice}>
                                <Download className="w-4 h-4 mr-2" />
                                Baixar Nota
                            </ClientButton>
                        </div>
                    }
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Order Status Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center"
                        >
                            <ClientBadge variant={statusInfo.variant} className="text-lg px-6 py-3">
                                {statusInfo.label}
                            </ClientBadge>
                        </motion.div>

                        {/* Timeline */}
                        <ClientCard title="Acompanhamento do Pedido">
                            <div className="relative">
                                {timeline.map((stage, index) => {
                                    const Icon = stage.icon;
                                    const isLast = index === timeline.length - 1;

                                    return (
                                        <div key={stage.key} className="flex gap-4 relative">
                                            {/* Vertical Line */}
                                            {!isLast && (
                                                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200">
                                                    <motion.div
                                                        initial={{ scaleY: 0 }}
                                                        animate={{ scaleY: stage.completed ? 1 : 0 }}
                                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                                        className="w-full bg-[#8B7355] origin-top"
                                                        style={{ height: '100%' }}
                                                    />
                                                </div>
                                            )}

                                            {/* Icon */}
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${stage.completed
                                                    ? 'bg-gradient-to-br from-[#8B7355] to-[#7A6548] text-white shadow-lg'
                                                    : 'bg-gray-200 text-gray-400'
                                                    }`}
                                            >
                                                <Icon className="w-6 h-6" />
                                            </motion.div>

                                            {/* Content */}
                                            <div className={`flex-1 pb-8 ${!isLast ? 'border-b border-gray-100' : ''}`}>
                                                <h3 className={`font-bold text-lg mb-1 ${stage.completed ? 'text-[#2C2419]' : 'text-gray-400'
                                                    }`}>
                                                    {stage.label}
                                                </h3>
                                                <p className={`text-sm ${stage.completed ? 'text-gray-600' : 'text-gray-400'
                                                    }`}>
                                                    {stage.description}
                                                </p>
                                                {stage.active && order.statusUpdatedAt && (
                                                    <p className="text-xs text-[#8B7355] mt-2 font-semibold">
                                                        {format(new Date(order.statusUpdatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ClientCard>

                        {/* Ordered Items */}
                        <ClientCard title="Itens do Pedido" icon={Package}>
                            <div className="space-y-4">
                                {order.items?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        {/* Product Image */}
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white flex-shrink-0">
                                            <img
                                                src={item.product?.images?.[0] || item.product?.image || '/placeholder.jpg'}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-[#2C2419] mb-1 truncate">
                                                {item.product?.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Quantidade: {item.quantity}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                R$ {item.price.toFixed(2)} cada
                                            </p>
                                        </div>

                                        {/* Item Total */}
                                        <div className="text-right">
                                            <p className="font-bold text-xl text-[#8B7355] font-['Playfair_Display']">
                                                R$ {(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-6 pt-6 border-t space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>R$ {order.subtotal?.toFixed(2) || order.total?.toFixed(2)}</span>
                                </div>

                                {order.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Desconto</span>
                                        <span>- R$ {order.discount.toFixed(2)}</span>
                                    </div>
                                )}

                                {order.shipping > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Frete</span>
                                        <span>R$ {order.shipping.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-2xl font-bold text-[#2C2419] pt-3 border-t font-['Playfair_Display']">
                                    <span>Total</span>
                                    <span>R$ {order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </ClientCard>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        {/* Delivery Address */}
                        <ClientCard title="Endereço de Entrega" icon={MapPin}>
                            {order.shippingAddress ? (
                                <div className="space-y-2 text-gray-700">
                                    <p className="font-semibold text-[#2C2419]">{order.shippingAddress.recipientName || user?.name}</p>
                                    <p>
                                        {order.shippingAddress.street}, {order.shippingAddress.number}
                                    </p>
                                    {order.shippingAddress.complement && (
                                        <p>{order.shippingAddress.complement}</p>
                                    )}
                                    <p>{order.shippingAddress.neighborhood}</p>
                                    <p>
                                        {order.shippingAddress.city} - {order.shippingAddress.state}
                                    </p>
                                    <p>CEP: {order.shippingAddress.zipCode}</p>
                                </div>
                            ) : (
                                <p className="text-gray-600 text-sm">Endereço não disponível</p>
                            )}
                        </ClientCard>

                        {/* Payment Information */}
                        <ClientCard title="Forma de Pagamento" icon={CreditCard}>
                            {order.paymentMethod ? (
                                <div className="space-y-3">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                                        <p className="text-xs opacity-70 mb-1">
                                            {order.paymentMethod.type === 'credit_card' ? 'Cartão de Crédito' : 'PIX'}
                                        </p>
                                        {order.paymentMethod.type === 'credit_card' && (
                                            <>
                                                <p className="font-mono text-lg mb-2">
                                                    •••• •••• •••• {order.paymentMethod.last4 || '****'}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs opacity-70">
                                                        {order.paymentMethod.brand || 'VISA'}
                                                    </span>
                                                    <span className="text-xs">
                                                        {order.paymentMethod.installments || 1}x
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {order.paidAt && (
                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>
                                                Pago em {format(new Date(order.paidAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-600">
                                    <p>Método de pagamento não informado</p>
                                </div>
                            )}
                        </ClientCard>

                        {/* Tracking Info */}
                        {order.trackingCode && (
                            <ClientCard>
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-[#2C2419]">Rastreamento</h4>
                                    <div className="p-3 bg-gray-50 rounded-2xl">
                                        <p className="text-xs text-gray-600 mb-1">Código de Rastreio</p>
                                        <p className="font-mono font-semibold text-[#2C2419]">
                                            {order.trackingCode}
                                        </p>
                                    </div>
                                    {order.carrier && (
                                        <p className="text-sm text-gray-600">
                                            Transportadora: {order.carrier}
                                        </p>
                                    )}
                                    <ClientButton variant="outline" onClick={handleTrackOrder} className="w-full">
                                        <Truck className="w-4 h-4 mr-2" />
                                        Rastrear Entrega
                                    </ClientButton>
                                </div>
                            </ClientCard>
                        )}

                        {/* Customer Support */}
                        <ClientCard>
                            <div className="space-y-4">
                                <h4 className="font-semibold text-[#2C2419]">Precisa de Ajuda?</h4>
                                <p className="text-sm text-gray-600">
                                    Entre em contato com nossa equipe
                                </p>
                                <div className="space-y-3">
                                    <a
                                        href="tel:+5511999999999"
                                        className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#8B7355] transition-colors"
                                    >
                                        <Phone className="w-4 h-4" />
                                        (11) 99999-9999
                                    </a>
                                    <a
                                        href="mailto:suporte@marcaromas.com"
                                        className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#8B7355] transition-colors"
                                    >
                                        <Mail className="w-4 h-4" />
                                        suporte@marcaromas.com
                                    </a>
                                </div>
                            </div>
                        </ClientCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
