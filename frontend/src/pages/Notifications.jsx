import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Bell,
    BellOff,
    Check,
    CheckCheck,
    Trash2,
    Package,
    CreditCard,
    Gift,
    AlertCircle,
    Info,
    Star
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Premium Client Components
import {
    ClientPageHeader,
    ClientCard,
    ClientButton,
    ClientBadge,
    ClientEmptyState,
    ClientTabs
} from '@/components/client';

// Mock service (replace with real API)
const notificationService = {
    getNotifications: async () => {
        // Mock data
        return [
            {
                id: 1,
                type: 'order',
                title: 'Pedido #1234 entregue',
                message: 'Seu pedido foi entregue com sucesso!',
                read: false,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                icon: Package,
                color: 'green'
            },
            {
                id: 2,
                type: 'payment',
                title: 'Pagamento aprovado',
                message: 'O pagamento do pedido #1233 foi aprovado.',
                read: false,
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                icon: CreditCard,
                color: 'blue'
            },
            {
                id: 3,
                type: 'promotion',
                title: '20% OFF em velas florais',
                message: 'Aproveite nosso desconto especial por tempo limitado!',
                read: true,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                icon: Gift,
                color: 'purple'
            },
            {
                id: 4,
                type: 'system',
                title: 'Nova conquista desbloqueada!',
                message: 'Você conquistou "Primeira Compra" e ganhou 50 pontos.',
                read: true,
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                icon: Star,
                color: 'yellow'
            },
            {
                id: 5,
                type: 'alert',
                title: 'Assinatura próxima da renovação',
                message: 'Sua assinatura será renovada em 3 dias.',
                read: false,
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                icon: AlertCircle,
                color: 'orange'
            }
        ];
    },

    markAsRead: async (id) => {
        // Mock
        return { success: true };
    },

    markAllAsRead: async () => {
        // Mock
        return { success: true };
    },

    deleteNotification: async (id) => {
        // Mock
        return { success: true };
    }
};

export default function Notifications() {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState('all');

    // Fetch notifications
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: notificationService.getNotifications
    });

    // Mark as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: (id) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            toast.success('Notificação marcada como lida');
        }
    });

    // Mark all as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: () => notificationService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            toast.success('Todas as notificações marcadas como lida');
        }
    });

    // Delete notification mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => notificationService.deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            toast.success('Notificação excluída');
        }
    });

    // Filter notifications
    const filteredNotifications = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => !n.read)
            : notifications.filter(n => n.type === filter);

    const unreadCount = notifications.filter(n => !n.read).length;

    const filterTabs = [
        { id: 'all', label: 'Todas', count: notifications.length },
        { id: 'unread', label: 'Não Lidas', count: unreadCount },
        { id: 'order', label: 'Pedidos' },
        { id: 'payment', label: 'Pagamentos' },
        { id: 'promotion', label: 'Promoções' }
    ];

    const getIconComponent = (notification) => {
        const IconComponent = notification.icon || Bell;
        return IconComponent;
    };

    const getColorClass = (color) => {
        const colors = {
            green: 'from-green-400 to-emerald-600',
            blue: 'from-blue-400 to-cyan-600',
            purple: 'from-purple-400 to-pink-600',
            yellow: 'from-yellow-400 to-orange-500',
            orange: 'from-orange-400 to-red-500',
            brown: 'from-[#8B7355] to-[#7A6548]'
        };
        return colors[color] || colors.brown;
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <ClientPageHeader
                    title="Notificações"
                    subtitle={`${unreadCount} ${unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'}`}
                    backTo="/dashboard"
                    action={
                        unreadCount > 0 && (
                            <ClientButton
                                variant="outline"
                                onClick={() => markAllAsReadMutation.mutate()}
                                disabled={markAllAsReadMutation.isPending}
                            >
                                <CheckCheck className="w-4 h-4 mr-2" />
                                Marcar Todas Como Lidas
                            </ClientButton>
                        )
                    }
                />

                {/* Filter Tabs */}
                <div className="mb-6">
                    <div className="flex gap-2 flex-wrap">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id)}
                                className={`px-4 py-2 rounded-2xl font-semibold transition-all ${filter === tab.id
                                        ? 'bg-[#8B7355] text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === tab.id
                                            ? 'bg-white/20'
                                            : 'bg-gray-200'
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notifications List */}
                {filteredNotifications.length === 0 ? (
                    <ClientEmptyState
                        icon={filter === 'unread' ? BellOff : Bell}
                        title={
                            filter === 'unread'
                                ? 'Nenhuma notificação não lida'
                                : 'Nenhuma notificação'
                        }
                        message={
                            filter === 'all'
                                ? 'Você não tem notificações ainda'
                                : 'Nenhuma notificação nesta categoria'
                        }
                    />
                ) : (
                    <div className="space-y-4">
                        {filteredNotifications.map((notification, index) => {
                            const IconComponent = getIconComponent(notification);

                            return (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ClientCard
                                        hoverable
                                        className={`relative ${!notification.read ? 'ring-2 ring-[#8B7355]/20' : ''}`}
                                    >
                                        <div className="flex gap-4">
                                            {/* Icon */}
                                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getColorClass(notification.color)} flex items-center justify-center flex-shrink-0`}>
                                                <IconComponent className="w-6 h-6 text-white" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-[#2C2419] mb-1">
                                                            {notification.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {notification.message}
                                                        </p>
                                                    </div>

                                                    {!notification.read && (
                                                        <div className="w-3 h-3 rounded-full bg-[#8B7355] flex-shrink-0 mt-1" />
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500">
                                                        {formatDistanceToNow(notification.createdAt, {
                                                            addSuffix: true,
                                                            locale: ptBR
                                                        })}
                                                    </span>

                                                    <div className="flex gap-2">
                                                        {!notification.read && (
                                                            <ClientButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => markAsReadMutation.mutate(notification.id)}
                                                                disabled={markAsReadMutation.isPending}
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </ClientButton>
                                                        )}

                                                        <ClientButton
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteMutation.mutate(notification.id)}
                                                            disabled={deleteMutation.isPending}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </ClientButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ClientCard>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Info Card */}
                {notifications.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                    >
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-900">
                                    <p className="font-semibold mb-1">Sobre as Notificações</p>
                                    <p>
                                        Mantenha-se atualizado sobre pedidos, pagamentos, promoções e novidades.
                                        As notificações são automaticamente removidas após 30 dias.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
