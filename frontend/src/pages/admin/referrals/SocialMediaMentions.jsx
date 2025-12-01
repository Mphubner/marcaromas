import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Check,
    X,
    Instagram,
    Facebook,
    Twitter,
    MessageCircle,
    ExternalLink,
    Heart,
    MessageSquare,
    Eye
} from 'lucide-react';
import { toast } from 'sonner';

const PLATFORM_ICONS = {
    INSTAGRAM: Instagram,
    FACEBOOK: Facebook,
    TWITTER: Twitter,
    TIKTOK: MessageCircle,
};

const PLATFORM_COLORS = {
    INSTAGRAM: 'bg-gradient-to-br from-purple-600 to-pink-500',
    FACEBOOK: 'bg-blue-600',
    TWITTER: 'bg-sky-500',
    TIKTOK: 'bg-black',
};

export default function SocialMediaMentions() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState('PENDING');
    const [platformFilter, setPlatformFilter] = useState('');
    const [rewardAmounts, setRewardAmounts] = useState({});

    const { data: mentions = [], isLoading } = useQuery({
        queryKey: ['social-mentions', statusFilter, platformFilter],
        queryFn: () => adminService.getSocialMediaMentions({
            status: statusFilter,
            platform: platformFilter || undefined
        }),
    });

    const approveMutation = useMutation({
        mutationFn: ({ mentionId, rewardAmount }) =>
            adminService.approveSocialMention(mentionId, rewardAmount),
        onSuccess: () => {
            queryClient.invalidateQueries(['social-mentions']);
            toast.success('Menção aprovada!');
            setRewardAmounts({});
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Erro ao aprovar menção');
        },
    });

    const rejectMutation = useMutation({
        mutationFn: (mentionId) => adminService.rejectSocialMention(mentionId),
        onSuccess: () => {
            queryClient.invalidateQueries(['social-mentions']);
            toast.success('Menção rejeitada');
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Erro ao rejeitar menção');
        },
    });

    const handleApprove = (mentionId) => {
        const amount = rewardAmounts[mentionId];
        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Insira um valor de recompensa válido');
            return;
        }
        approveMutation.mutate({ mentionId, rewardAmount: parseFloat(amount) });
    };

    const handleReject = (mentionId) => {
        if (confirm('Tem certeza que deseja rejeitar esta menção?')) {
            rejectMutation.mutate(mentionId);
        }
    };

    const setRewardAmount = (mentionId, value) => {
        setRewardAmounts(prev => ({ ...prev, [mentionId]: value }));
    };

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            APPROVED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800',
        };
        const labels = {
            PENDING: 'Pendente',
            APPROVED: 'Aprovado',
            REJECTED: 'Rejeitado',
        };
        return (
            <Badge className={`${styles[status]} rounded-lg`}>
                {labels[status]}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/admin/referrals/programs')}
                        className="rounded-lg"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Menções em Redes Sociais</h2>
                        <p className="text-gray-500 mt-1">Aprove ou rejeite menções de indicações</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <Card className="rounded-xl">
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex gap-2">
                            <span className="text-sm font-medium text-gray-700 self-center">Status:</span>
                            {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                                <Button
                                    key={status}
                                    variant={statusFilter === status ? 'default' : 'outline'}
                                    onClick={() => setStatusFilter(status)}
                                    size="sm"
                                    className={`rounded-lg ${statusFilter === status ? 'bg-[#8B7355] hover:bg-[#6d5a42]' : ''}`}
                                >
                                    {status === 'PENDING' ? 'Pendentes' : status === 'APPROVED' ? 'Aprovados' : 'Rejeitados'}
                                </Button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <span className="text-sm font-medium text-gray-700 self-center">Plataforma:</span>
                            <Button
                                variant={!platformFilter ? 'default' : 'outline'}
                                onClick={() => setPlatformFilter('')}
                                size="sm"
                                className={`rounded-lg ${!platformFilter ? 'bg-[#8B7355] hover:bg-[#6d5a42]' : ''}`}
                            >
                                Todas
                            </Button>
                            {['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'TIKTOK'].map((platform) => {
                                const Icon = PLATFORM_ICONS[platform];
                                return (
                                    <Button
                                        key={platform}
                                        variant={platformFilter === platform ? 'default' : 'outline'}
                                        onClick={() => setPlatformFilter(platform)}
                                        size="sm"
                                        className={`rounded-lg ${platformFilter === platform ? 'bg-[#8B7355] hover:bg-[#6d5a42]' : ''}`}
                                    >
                                        <Icon className="w-4 h-4 mr-1" />
                                        {platform}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mentions Grid */}
            {mentions.length === 0 ? (
                <Card className="rounded-xl p-12">
                    <div className="text-center text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">Nenhuma menção encontrada</p>
                        <p className="text-sm mt-1">Configure filtros diferentes para ver mais resultados</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mentions.map((mention) => {
                        const Icon = PLATFORM_ICONS[mention.platform] || MessageCircle;
                        const platformColor = PLATFORM_COLORS[mention.platform] || 'bg-gray-600';

                        return (
                            <Card key={mention.id} className="rounded-xl hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className={`p-2 rounded-lg text-white ${platformColor}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        {getStatusBadge(mention.status)}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Content Preview */}
                                    {mention.contentUrl && (
                                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={mention.contentUrl}
                                                alt="Mention content"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* User Info */}
                                    <div>
                                        <div className="font-medium">{mention.user?.name || 'Usuário'}</div>
                                        <div className="text-sm text-gray-500">@{mention.platformUsername}</div>
                                    </div>

                                    {/* Engagement Stats */}
                                    <div className="flex gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Heart className="w-4 h-4" />
                                            {mention.likes || 0}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="w-4 h-4" />
                                            {mention.comments || 0}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {mention.reach || 0}
                                        </div>
                                    </div>

                                    {/* Post URL */}
                                    {mention.postUrl && (
                                        <a
                                            href={mention.postUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-[#8B7355] hover:underline"
                                        >
                                            Ver post original
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}

                                    {/* Actions for Pending */}
                                    {mention.status === 'PENDING' && (
                                        <div className="space-y-2 pt-2 border-t">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="Valor da recompensa (R$)"
                                                value={rewardAmounts[mention.id] || ''}
                                                onChange={(e) => setRewardAmount(mention.id, e.target.value)}
                                                className="rounded-lg"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handleApprove(mention.id)}
                                                    disabled={approveMutation.isPending}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg"
                                                >
                                                    <Check className="w-4 h-4 mr-1" />
                                                    Aprovar
                                                </Button>
                                                <Button
                                                    onClick={() => handleReject(mention.id)}
                                                    disabled={rejectMutation.isPending}
                                                    variant="outline"
                                                    className="flex-1 rounded-lg text-red-600 hover:bg-red-50"
                                                >
                                                    <X className="w-4 h-4 mr-1" />
                                                    Rejeitar
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Reward Info for Approved */}
                                    {mention.status === 'APPROVED' && mention.rewardAmount && (
                                        <div className="pt-2 border-t">
                                            <div className="text-sm text-gray-500">Recompensa</div>
                                            <div className="text-lg font-bold text-green-600">
                                                R$ {mention.rewardAmount.toFixed(2)}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
