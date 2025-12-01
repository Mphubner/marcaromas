import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    ArrowLeft,
    Check,
    X,
    Download,
    DollarSign,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

export default function PayoutManagement() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedPayouts, setSelectedPayouts] = useState([]);
    const [statusFilter, setStatusFilter] = useState('PENDING');

    const { data: payouts = [], isLoading } = useQuery({
        queryKey: ['referral-payouts', statusFilter],
        queryFn: () => adminService.getReferralPayouts(statusFilter),
    });

    const processPayoutMutation = useMutation({
        mutationFn: (payoutId) => adminService.processReferralPayout(payoutId, 'Pagamento processado pelo admin'),
        onSuccess: () => {
            queryClient.invalidateQueries(['referral-payouts']);
            toast.success('Pagamento processado com sucesso!');
            setSelectedPayouts([]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Erro ao processar pagamento');
        },
    });

    const batchPayoutMutation = useMutation({
        mutationFn: (data) => adminService.batchProcessPayouts(data.conversionIds, data.method),
        onSuccess: () => {
            queryClient.invalidateQueries(['referral-payouts']);
            toast.success('Pagamentos em lote processados!');
            setSelectedPayouts([]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Erro ao processar pagamentos em lote');
        },
    });

    const handleSelectPayout = (payoutId) => {
        setSelectedPayouts(prev =>
            prev.includes(payoutId)
                ? prev.filter(id => id !== payoutId)
                : [...prev, payoutId]
        );
    };

    const handleSelectAll = () => {
        if (selectedPayouts.length === payouts.length) {
            setSelectedPayouts([]);
        } else {
            setSelectedPayouts(payouts.map(p => p.id));
        }
    };

    const handleProcessSingle = (payoutId) => {
        processPayoutMutation.mutate(payoutId);
    };

    const handleBatchProcess = () => {
        if (selectedPayouts.length === 0) {
            toast.error('Selecione pelo menos um pagamento');
            return;
        }
        batchPayoutMutation.mutate({
            conversionIds: selectedPayouts,
            method: 'PIX' // Default method
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            PROCESSING: 'bg-blue-100 text-blue-800',
            COMPLETED: 'bg-green-100 text-green-800',
            FAILED: 'bg-red-100 text-red-800',
        };
        const labels = {
            PENDING: 'Pendente',
            PROCESSING: 'Processando',
            COMPLETED: 'Concluído',
            FAILED: 'Falhou',
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
                        <h2 className="text-3xl font-bold text-gray-900">Gerenciamento de Pagamentos</h2>
                        <p className="text-gray-500 mt-1">Processe pagamentos de indicações</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    {selectedPayouts.length > 0 && (
                        <Button
                            onClick={handleBatchProcess}
                            disabled={batchPayoutMutation.isPending}
                            className="bg-[#8B7355] hover:bg-[#6d5a42] rounded-lg"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Processar {selectedPayouts.length} Selecionados
                        </Button>
                    )}
                    <Button variant="outline" className="rounded-lg">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="rounded-xl">
                <CardContent className="p-4">
                    <div className="flex gap-2">
                        {['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'].map((status) => (
                            <Button
                                key={status}
                                variant={statusFilter === status ? 'default' : 'outline'}
                                onClick={() => setStatusFilter(status)}
                                className={`rounded-lg ${statusFilter === status ? 'bg-[#8B7355] hover:bg-[#6d5a42]' : ''}`}
                            >
                                {status === 'PENDING' && <Clock className="w-4 h-4 mr-2" />}
                                {status === 'COMPLETED' && <CheckCircle2 className="w-4 h-4 mr-2" />}
                                {status === 'PENDING' ? 'Pendentes' : status === 'PROCESSING' ? 'Processando' : status === 'COMPLETED' ? 'Concluídos' : 'Falhados'}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Payouts Table */}
            <Card className="rounded-xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Pagamentos</CardTitle>
                        {payouts.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedPayouts.length === payouts.length}
                                    onCheckedChange={handleSelectAll}
                                />
                                <span className="text-sm text-gray-600">Selecionar todos</span>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                        {statusFilter === 'PENDING' && <span className="w-4" />}
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuário</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Método</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Valor</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.map((payout) => (
                                    <tr key={payout.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            {statusFilter === 'PENDING' && (
                                                <Checkbox
                                                    checked={selectedPayouts.includes(payout.id)}
                                                    onCheckedChange={() => handleSelectPayout(payout.id)}
                                                />
                                            )}
                                        </td>
                                        <td className="py-3 px-4 font-medium">{payout.user?.name || 'N/A'}</td>
                                        <td className="py-3 px-4 text-gray-600">{payout.user?.email}</td>
                                        <td className="py-3 px-4">
                                            <Badge variant="outline" className="rounded-lg">
                                                {payout.method || 'PIX'}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                                            {formatCurrency(payout.amount)}
                                        </td>
                                        <td className="py-3 px-4">{getStatusBadge(payout.status)}</td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {new Date(payout.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2 justify-end">
                                                {payout.status === 'PENDING' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleProcessSingle(payout.id)}
                                                        disabled={processPayoutMutation.isPending}
                                                        className="bg-green-600 hover:bg-green-700 rounded-lg"
                                                    >
                                                        <Check className="w-4 h-4 mr-1" />
                                                        Processar
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {payouts.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Nenhum pagamento {statusFilter.toLowerCase()}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
