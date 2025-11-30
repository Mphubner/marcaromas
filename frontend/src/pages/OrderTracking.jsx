import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Package,
    Truck,
    Home,
    CheckCircle,
    MapPin,
    Calendar,
    Phone,
    ExternalLink,
    RefreshCw,
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
    ClientBadge
} from '@/components/client';

// Services
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

export default function OrderTracking() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [autoRefresh, setAutoRefresh] = useState(true);

    const { data: order, isLoading, refetch } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => orderService.getById(orderId),
        enabled: !!user && !!orderId,
        refetchInterval: autoRefresh ? 30000 : false // Auto-refresh every 30s
    });

    // Tracking timeline stages
    const getTrackingTimeline = () => {
        const stages = [
            {
                key: 'POSTED',
                label: 'Postado',
                icon: Package,
                description: 'Seu pedido foi postado'
            },
            {
                key: 'IN_TRANSIT',
                label: 'Em Trânsito',
                icon: Truck,
                description: 'Pedido está a caminho'
            },
            {
                key: 'OUT_FOR_DELIVERY',
                label: 'Saiu para Entrega',
                icon: Truck,
                description: 'Em rota de entrega'
            },
            {
                key: 'DELIVERED',
                label: 'Entregue',
                icon: CheckCircle,
                description: 'Pedido foi entregue'
            }
        ];

        // Simulate tracking progress based on order status
        let currentStage = 0;
        if (order?.status === 'SHIPPED') currentStage = 1;
        if (order?.status === 'IN_TRANSIT') currentStage = 2;
        if (order?.status === 'OUT_FOR_DELIVERY') currentStage = 3;
        if (order?.status === 'DELIVERED') currentStage = 4;

        return stages.map((stage, index) => ({
            ...stage,
            completed: index < currentStage,
            active: index === currentStage
        }));
    };

    const handleRefresh = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
            </div>
        );
    }

    if (!order || !order.trackingCode) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <ClientPageHeader
                        title="Rastreamento não disponível"
                        subtitle="Este pedido ainda não possui código de rastreamento"
                        backTo={`/pedido/${orderId}`}
                    />
                    <ClientCard>
                        <div className="text-center py-12">
                            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-6">
                                O código de rastreamento será disponibilizado assim que o pedido for enviado
                            </p>
                            <ClientButton onClick={() => navigate(`/pedido/${orderId}`)}>
                                Ver Detalhes do Pedido
                            </ClientButton>
                        </div>
                    </ClientCard>
                </div>
            </div>
        );
    }

    const timeline = getTrackingTimeline();
    const isDelivered = order.status === 'DELIVERED';

    // Calculate estimated delivery (mock - should come from API)
    const estimatedDelivery = order.estimatedDelivery
        ? new Date(order.estimatedDelivery)
        : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 days from now

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <ClientPageHeader
                    title={`Rastreamento - Pedido #${order.orderNumber || order.id}`}
                    subtitle={`Código: ${order.trackingCode}`}
                    backTo={`/pedido/${orderId}`}
                    action={
                        <div className="flex gap-3">
                            <ClientButton
                                variant="outline"
                                onClick={handleRefresh}
                                disabled={isLoading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Atualizar
                            </ClientButton>
                            {order.carrier && (
                                <ClientButton
                                    variant="outline"
                                    onClick={() => window.open(`https://www.google.com/search?q=rastreamento+${order.carrier}+${order.trackingCode}`, '_blank')}
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Rastrear no Site
                                </ClientButton>
                            )}
                        </div>
                    }
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Status Banner */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-3xl p-8 text-center ${isDelivered
                                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                                    : 'bg-gradient-to-br from-[#8B7355] to-[#7A6548]'
                                } text-white shadow-2xl`}
                        >
                            {isDelivered ? (
                                <>
                                    <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                                    <h2 className="text-3xl font-bold mb-2 font-['Playfair_Display']">
                                        Pedido Entregue!
                                    </h2>
                                    <p className="text-white/90">
                                        Seu pedido foi entregue com sucesso
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Truck className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                                    <h2 className="text-3xl font-bold mb-2 font-['Playfair_Display']">
                                        Seu pedido está a caminho
                                    </h2>
                                    <p className="text-white/90">
                                        Acompanhe abaixo o status da entrega
                                    </p>
                                </>
                            )}
                        </motion.div>

                        {/* Tracking Timeline */}
                        <ClientCard title="Linha do Tempo">
                            <div className="space-y-8">
                                {timeline.map((stage, index) => {
                                    const Icon = stage.icon;
                                    const isLast = index === timeline.length - 1;

                                    return (
                                        <div key={stage.key} className="relative flex gap-6">
                                            {/* Vertical Line */}
                                            {!isLast && (
                                                <div className="absolute left-6 top-16 bottom-0 w-1 bg-gray-200">
                                                    <motion.div
                                                        initial={{ scaleY: 0 }}
                                                        animate={{ scaleY: stage.completed ? 1 : 0 }}
                                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                                        className="w-full bg-[#8B7355] origin-top"
                                                        style={{ height: '100%' }}
                                                    />
                                                </div>
                                            )}

                                            {/* Icon Circle */}
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center z-10 flex-shrink-0 shadow-lg ${stage.completed || stage.active
                                                        ? 'bg-gradient-to-br from-[#8B7355] to-[#7A6548] text-white'
                                                        : 'bg-gray-200 text-gray-400'
                                                    }`}
                                            >
                                                <Icon className="w-6 h-6" />
                                            </motion.div>

                                            {/* Content */}
                                            <div className="flex-1 pb-4">
                                                <h3 className={`font-bold text-xl mb-1 ${stage.completed || stage.active ? 'text-[#2C2419]' : 'text-gray-400'
                                                    }`}>
                                                    {stage.label}
                                                </h3>
                                                <p className={`text-sm mb-2 ${stage.completed || stage.active ? 'text-gray-600' : 'text-gray-400'
                                                    }`}>
                                                    {stage.description}
                                                </p>

                                                {stage.active && (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B7355]/10">
                                                        <div className="w-2 h-2 rounded-full bg-[#8B7355] animate-pulse" />
                                                        <span className="text-xs font-semibold text-[#8B7355]">
                                                            Status Atual
                                                        </span>
                                                    </div>
                                                )}

                                                {stage.completed && order.trackingHistory?.[index] && (
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        {format(new Date(order.trackingHistory[index].date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ClientCard>

                        {/* Tracking History (if available) */}
                        {order.trackingHistory && order.trackingHistory.length > 0 && (
                            <ClientCard title="Histórico Detalhado">
                                <div className="space-y-3">
                                    {order.trackingHistory.map((event, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-[#8B7355] mt-2" />
                                            <div className="flex-1">
                                                <p className="font-semibold text-[#2C2419]">{event.status}</p>
                                                <p className="text-sm text-gray-600">{event.description}</p>
                                                {event.location && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        📍 {event.location}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {format(new Date(event.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ClientCard>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        {/* Delivery Info */}
                        <ClientCard>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-[#2C2419] mb-2 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-[#8B7355]" />
                                        Previsão de Entrega
                                    </h4>
                                    <p className="text-2xl font-bold text-[#8B7355] font-['Playfair_Display']">
                                        {format(estimatedDelivery, "dd 'de' MMMM", { locale: ptBR })}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {format(estimatedDelivery, "EEEE", { locale: ptBR })}
                                    </p>
                                </div>

                                {!isDelivered && (
                                    <div className="p-3 bg-blue-50 rounded-2xl">
                                        <p className="text-sm text-blue-900">
                                            <AlertCircle className="w-4 h-4 inline mr-2" />
                                            A data é uma estimativa e pode variar
                                        </p>
                                    </div>
                                )}
                            </div>
                        </ClientCard>

                        {/* Carrier Info */}
                        {order.carrier && (
                            <ClientCard title="Transportadora">
                                <div className="space-y-3">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="font-semibold text-[#2C2419] mb-1">
                                            {order.carrier}
                                        </p>
                                        <p className="text-sm text-gray-600 font-mono">
                                            {order.trackingCode}
                                        </p>
                                    </div>

                                    {order.carrier.toLowerCase().includes('correios') && (
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <a
                                                href={`tel:${order.carrierPhone || '08007257282'}`}
                                                className="flex items-center gap-2 hover:text-[#8B7355] transition-colors"
                                            >
                                                <Phone className="w-4 h-4" />
                                                0800 725 7282
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </ClientCard>
                        )}

                        {/* Delivery Address */}
                        <ClientCard title="Endereço de Entrega" icon={MapPin}>
                            {order.shippingAddress ? (
                                <div className="space-y-1 text-sm text-gray-700">
                                    <p className="font-semibold text-[#2C2419]">
                                        {order.shippingAddress.recipientName || user?.name}
                                    </p>
                                    <p>{order.shippingAddress.street}, {order.shippingAddress.number}</p>
                                    {order.shippingAddress.complement && <p>{order.shippingAddress.complement}</p>}
                                    <p>{order.shippingAddress.neighborhood}</p>
                                    <p>{order.shippingAddress.city} - {order.shippingAddress.state}</p>
                                    <p className="text-gray-600">CEP: {order.shippingAddress.zipCode}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">Endereço não disponível</p>
                            )}
                        </ClientCard>

                        {/* Auto-refresh Toggle */}
                        <ClientCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-[#2C2419] mb-1">
                                        Atualização Automática
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                        A cada 30 segundos
                                    </p>
                                </div>
                                <button
                                    onClick={() => setAutoRefresh(!autoRefresh)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoRefresh ? 'bg-[#8B7355]' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoRefresh ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </ClientCard>

                        {/* Help */}
                        <ClientCard>
                            <div className="space-y-3">
                                <h4 className="font-semibold text-[#2C2419]">Precisa de Ajuda?</h4>
                                <p className="text-sm text-gray-600">
                                    Entre em contato com nossa equipe
                                </p>
                                <ClientButton variant="outline" size="sm" className="w-full">
                                    Falar com Suporte
                                </ClientButton>
                            </div>
                        </ClientCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
