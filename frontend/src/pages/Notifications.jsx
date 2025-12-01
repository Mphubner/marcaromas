import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Bell,
    Check,
    Trash2,
    Settings,
    ShoppingBag,
    Star,
    Users,
    Gift,
    FileText,
    Info,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import api from '@/lib/api';
import { toast } from 'sonner';

export default function Notifications() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);

    // Fetch Notifications
    const { data, isLoading } = useQuery({
        queryKey: ['notifications', page, activeTab],
        queryFn: async () => {
            const type = activeTab === 'all' ? undefined : activeTab.toUpperCase();
            const response = await api.get('/notifications', {
                params: { page, limit: 20, type }
            });
            return response.data;
        }
    });

    // Fetch Preferences
    const { data: preferences } = useQuery({
        queryKey: ['notification-preferences'],
        queryFn: async () => {
            const response = await api.get('/notifications/preferences');
            return response.data;
        }
    });

    // Mutations
    const markAsReadMutation = useMutation({
        mutationFn: async (id) => {
            await api.patch(`/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            queryClient.invalidateQueries(['unread-count']); // Assuming global unread count
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/notifications/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            toast.success('Notificação excluída');
        }
    });

    const updatePreferencesMutation = useMutation({
        mutationFn: async (newPreferences) => {
            await api.put('/notifications/preferences', newPreferences);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notification-preferences']);
            toast.success('Preferências atualizadas');
        }
    });

    const handleMarkAllRead = () => {
        markAsReadMutation.mutate('all');
    };

    const getIcon = (type) => {
        switch (type) {
            case 'ORDER': return <ShoppingBag className="w-5 h-5 text-blue-500" />;
            case 'ACHIEVEMENT': return <Star className="w-5 h-5 text-yellow-500" />;
            case 'REFERRAL': return <Users className="w-5 h-5 text-green-500" />;
            case 'PROMOTION': return <Gift className="w-5 h-5 text-purple-500" />;
            case 'CONTENT': return <FileText className="w-5 h-5 text-indigo-500" />;
            default: return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Bell className="w-6 h-6" />
                        Notificações
                    </h1>
                    <p className="text-muted-foreground">
                        Acompanhe suas atualizações e novidades
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleMarkAllRead}>
                        <Check className="w-4 h-4 mr-2" />
                        Marcar todas como lidas
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Settings className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Preferências de Notificação</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                {preferences && (
                                    <>
                                        <div className="space-y-4">
                                            <h3 className="font-medium">Canais</h3>
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="email">Email</Label>
                                                <Switch
                                                    id="email"
                                                    checked={preferences.email}
                                                    onCheckedChange={(checked) => updatePreferencesMutation.mutate({ email: checked })}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="in_app">Na Plataforma</Label>
                                                <Switch
                                                    id="in_app"
                                                    checked={preferences.in_app}
                                                    onCheckedChange={(checked) => updatePreferencesMutation.mutate({ in_app: checked })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="font-medium">Categorias</h3>
                                            {[
                                                { key: 'orders', label: 'Pedidos' },
                                                { key: 'subscriptions', label: 'Assinaturas' },
                                                { key: 'referrals', label: 'Indicações' },
                                                { key: 'achievements', label: 'Conquistas' },
                                                { key: 'promotions', label: 'Promoções' },
                                                { key: 'content', label: 'Conteúdo Novo' },
                                            ].map((cat) => (
                                                <div key={cat.key} className="flex items-center justify-between">
                                                    <Label htmlFor={cat.key}>{cat.label}</Label>
                                                    <Switch
                                                        id={cat.key}
                                                        checked={preferences[cat.key]}
                                                        onCheckedChange={(checked) => updatePreferencesMutation.mutate({ [cat.key]: checked })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6 flex flex-wrap h-auto">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="order">Pedidos</TabsTrigger>
                    <TabsTrigger value="subscription">Assinaturas</TabsTrigger>
                    <TabsTrigger value="referral">Indicações</TabsTrigger>
                    <TabsTrigger value="achievement">Conquistas</TabsTrigger>
                    <TabsTrigger value="promotion">Promoções</TabsTrigger>
                </TabsList>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-8">Carregando...</div>
                    ) : data?.notifications.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-lg">
                            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>Nenhuma notificação encontrada</p>
                        </div>
                    ) : (
                        data?.notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`flex gap-4 p-4 rounded-lg border transition-colors ${notification.is_read ? 'bg-white' : 'bg-blue-50 border-blue-100'
                                    }`}
                            >
                                <div className="mt-1">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-medium ${!notification.is_read && 'text-blue-900'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {format(new Date(notification.createdAt), "d 'de' MMM, HH:mm", { locale: ptBR })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {notification.message}
                                    </p>
                                    {notification.link && (
                                        <a
                                            href={notification.link}
                                            className="text-xs text-[#8B7355] hover:underline mt-2 inline-block"
                                        >
                                            Ver detalhes
                                        </a>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    {!notification.is_read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                                            onClick={() => markAsReadMutation.mutate(notification.id)}
                                            title="Marcar como lida"
                                        >
                                            <Check className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                        onClick={() => deleteMutation.mutate(notification.id)}
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Tabs>
        </div>
    );
}
