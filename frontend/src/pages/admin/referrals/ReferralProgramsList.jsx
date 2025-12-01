import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Settings,
    Users,
    DollarSign,
    TrendingUp,
    Edit2,
    BarChart
} from 'lucide-react';
import { toast } from 'sonner';

export default function ReferralProgramsList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: programs = [], isLoading } = useQuery({
        queryKey: ['referral-programs'],
        queryFn: adminService.getReferralPrograms,
    });

    const getTypeLabel = (type) => {
        const labels = {
            'FIXED': 'Valor Fixo',
            'PERCENTAGE': 'Porcentagem',
            'RECURRING_PERCENTAGE': 'Porcentagem Recorrente',
            'TIERED': 'Por Níveis',
            'HYBRID': 'Híbrido'
        };
        return labels[type] || type;
    };

    const getTriggerLabel = (trigger) => {
        const labels = {
            'SIGNUP': 'Cadastro',
            'FIRST_PURCHASE': 'Primeira Compra',
            'PURCHASE': 'Compra',
            'SUBSCRIPTION': 'Assinatura',
            'SUBSCRIPTION_PAYMENT': 'Pagamento Assinatura'
        };
        return labels[trigger] || trigger;
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
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Programas de Indicações</h2>
                    <p className="text-gray-500 mt-1">Configure programas de recompensas</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/admin/referrals/analytics')}
                        className="rounded-lg"
                    >
                        <BarChart className="w-4 h-4 mr-2" />
                        Analytics
                    </Button>
                    <Button
                        onClick={() => navigate('/admin/referrals/programs/new')}
                        className="bg-[#8B7355] hover:bg-[#6d5a42] rounded-lg"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Programa
                    </Button>
                </div>
            </div>

            {/* Programs Grid */}
            {programs.length === 0 ? (
                <Card className="p-12 rounded-xl">
                    <div className="text-center text-gray-500">
                        <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">Nenhum programa configurado</p>
                        <p className="text-sm mt-1">Crie seu primeiro programa de indicações</p>
                        <Button
                            onClick={() => navigate('/admin/referrals/programs/new')}
                            className="mt-4 bg-[#8B7355] hover:bg-[#6d5a42] rounded-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Criar Programa
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map((program) => (
                        <Card key={program.id} className="hover:shadow-lg transition-shadow rounded-xl">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-lg">{program.name}</CardTitle>
                                        {program.isActive ? (
                                            <Badge className="bg-green-100 text-green-800 rounded-lg">Ativo</Badge>
                                        ) : (
                                            <Badge className="bg-gray-100 text-gray-800 rounded-lg">Inativo</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">{getTypeLabel(program.type)}</p>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
                                    <div className="text-center">
                                        <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                                        <div className="text-lg font-bold">{program.stats?.activeReferrers || 0}</div>
                                        <div className="text-xs text-gray-500">Indicadores</div>
                                    </div>
                                    <div className="text-center">
                                        <TrendingUp className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                                        <div className="text-lg font-bold">{program.stats?.conversions || 0}</div>
                                        <div className="text-xs text-gray-500">Conversões</div>
                                    </div>
                                    <div className="text-center">
                                        <DollarSign className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                                        <div className="text-lg font-bold">
                                            R$ {(program.stats?.totalCost || 0).toFixed(0)}
                                        </div>
                                        <div className="text-xs text-gray-500">Gasto</div>
                                    </div>
                                </div>

                                {/* Trigger */}
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Gatilho</div>
                                    <div className="text-sm font-medium">{getTriggerLabel(program.type)}</div>
                                </div>

                                {/* Actions */}
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/admin/referrals/programs/${program.id}/edit`)}
                                    className="w-full rounded-lg"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Editar Programa
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
