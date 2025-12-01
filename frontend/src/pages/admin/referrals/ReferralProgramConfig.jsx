import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    ArrowLeft,
    Save,
    Trash2,
    Settings,
    DollarSign,
    Percent,
    Trophy,
    Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const REWARD_TYPES = [
    {
        value: 'FIXED',
        label: 'Valor Fixo',
        icon: DollarSign,
        description: 'Recompensa de valor fixo por conversão'
    },
    {
        value: 'PERCENTAGE',
        label: 'Porcentagem',
        icon: Percent,
        description: 'Porcentagem do valor da compra'
    },
    {
        value: 'RECURRING_PERCENTAGE',
        label: 'Porcentagem Recorrente',
        icon: Calendar,
        description: 'Porcentagem em pagamentos recorrentes'
    },
    {
        value: 'TIERED',
        label: 'Por Níveis (Tiers)',
        icon: Trophy,
        description: 'Recompensas crescentes por níveis de conversão'
    },
];

const TRIGGER_EVENTS = [
    { value: 'SIGNUP', label: 'Cadastro do Indicado', requiresAmount: false },
    { value: 'FIRST_PURCHASE', label: 'Primeira Compra', requiresAmount: true },
    { value: 'PURCHASE', label: 'Qualquer Compra', requiresAmount: true },
    { value: 'SUBSCRIPTION', label: 'Assinatura', requiresAmount: true },
    { value: 'SUBSCRIPTION_PAYMENT', label: 'Pagamento de Assinatura', requiresAmount: true },
];

const RECURRING_DURATIONS = [
    { value: 'LIFETIME', label: 'Vitalício' },
    { value: 'FIRST_3_MONTHS', label: 'Primeiros 3 Meses' },
    { value: 'FIRST_YEAR', label: 'Primeiro Ano' },
    { value: 'CUSTOM', label: 'Personalizado' },
];

export default function ReferralProgramConfig() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        type: 'FIXED',
        isActive: true,
        fixedAmount: '',
        percentage: '',
        recurringPercentage: '',
        maxAmount: '',
        triggerEvent: 'FIRST_PURCHASE',
        minPurchaseAmount: '',
        isRecurring: false,
        recurringDuration: 'LIFETIME',
        recurringMonths: '',
        tierConfig: null,
    });

    // Load existing program if editing
    const { isLoading } = useQuery({
        queryKey: ['referral-program', id],
        queryFn: async () => {
            const programs = await adminService.getReferralPrograms();
            const program = programs.find(p => p.id === id);
            if (program) {
                setFormData({
                    name: program.name,
                    type: program.type,
                    isActive: program.isActive,
                    fixedAmount: program.fixed_amount || '',
                    percentage: program.percentage || '',
                    recurringPercentage: program.recurring_percentage || '',
                    maxAmount: program.max_amount || '',
                    triggerEvent: program.trigger_event,
                    minPurchaseAmount: program.min_purchase_amount || '',
                    isRecurring: program.is_recurring,
                    recurringDuration: program.recurring_duration || 'LIFETIME',
                    recurringMonths: program.recurring_months || '',
                    tierConfig: program.tier_config,
                });
            }
            return program;
        },
        enabled: isEdit,
    });

    // Create/Update mutation
    const saveMutation = useMutation({
        mutationFn: async (data) => {
            if (isEdit) {
                return await adminService.updateReferralProgram(id, data);
            } else {
                return await adminService.createReferralProgram(data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['referral-programs']);
            toast.success(isEdit ? 'Programa atualizado!' : 'Programa criado!');
            navigate('/admin/referrals/programs');
        },
        onError: (error) => {
            toast.error('Erro ao salvar programa');
            console.error(error);
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: () => adminService.deleteReferralProgram(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['referral-programs']);
            toast.success('Programa excluído!');
            navigate('/admin/referrals/programs');
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Erro ao excluir programa');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.type || !formData.triggerEvent) {
            toast.error('Preencha os campos obrigatórios');
            return;
        }

        saveMutation.mutate(formData);
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const selectedTrigger = TRIGGER_EVENTS.find(t => t.value === formData.triggerEvent);
    const selectedType = REWARD_TYPES.find(t => t.value === formData.type);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
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
                            <h1 className="text-3xl font-bold text-gray-900">
                                {isEdit ? 'Editar Programa' : 'Novo Programa de Indicações'}
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Configure recompensas e regras de ativação
                            </p>
                        </div>
                    </div>

                    {isEdit && (
                        <Button
                            variant="outline"
                            onClick={() => deleteMutation.mutate()}
                            disabled={deleteMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                        </Button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <Card className="rounded-xl">
                        <CardHeader>
                            <CardTitle>Informações Básicas</CardTitle>
                            <CardDescription>Nome e status do programa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome do Programa *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleFieldChange('name', e.target.value)}
                                    placeholder="Ex: Programa Indicação Black Friday"
                                    className="rounded-lg"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="active" className="text-base">Programa Ativo</Label>
                                    <p className="text-sm text-gray-500">
                                        Desative para pausar sem excluir
                                    </p>
                                </div>
                                <Switch
                                    id="active"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => handleFieldChange('isActive', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reward Type */}
                    <Card className="rounded-xl">
                        <CardHeader>
                            <CardTitle>Tipo de Recompensa</CardTitle>
                            <CardDescription>Escolha como calcular a recompensa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {REWARD_TYPES.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => handleFieldChange('type', type.value)}
                                            className={`p-4 rounded-lg border-2 text-left transition-all ${formData.type === type.value
                                                    ? 'border-[#8B7355] bg-[#8B7355]/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${formData.type === type.value ? 'bg-[#8B7355] text-white' : 'bg-gray-100'
                                                    }`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold">{type.label}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {type.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Type-specific fields */}
                            {formData.type === 'FIXED' && (
                                <div className="space-y-2 pt-4">
                                    <Label htmlFor="fixedAmount">Valor Fixo (R$) *</Label>
                                    <Input
                                        id="fixedAmount"
                                        type="number"
                                        step="0.01"
                                        value={formData.fixedAmount}
                                        onChange={(e) => handleFieldChange('fixedAmount', e.target.value)}
                                        placeholder="0.00"
                                        className="rounded-lg"
                                        required
                                    />
                                </div>
                            )}

                            {formData.type === 'PERCENTAGE' && (
                                <div className="space-y-2 pt-4">
                                    <Label htmlFor="percentage">Porcentagem (%) *</Label>
                                    <Input
                                        id="percentage"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        value={formData.percentage}
                                        onChange={(e) => handleFieldChange('percentage', e.target.value)}
                                        placeholder="10"
                                        className="rounded-lg"
                                        required
                                    />
                                </div>
                            )}

                            {formData.type === 'RECURRING_PERCENTAGE' && (
                                <div className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="recurringPercentage">Porcentagem Recorrente (%) *</Label>
                                        <Input
                                            id="recurringPercentage"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            value={formData.recurringPercentage}
                                            onChange={(e) => handleFieldChange('recurringPercentage', e.target.value)}
                                            placeholder="5"
                                            className="rounded-lg"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="recurringDuration">Duração</Label>
                                        <select
                                            id="recurringDuration"
                                            value={formData.recurringDuration}
                                            onChange={(e) => handleFieldChange('recurringDuration', e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2"
                                        >
                                            {RECURRING_DURATIONS.map(d => (
                                                <option key={d.value} value={d.value}>{d.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {formData.recurringDuration === 'CUSTOM' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="recurringMonths">Número de Meses</Label>
                                            <Input
                                                id="recurringMonths"
                                                type="number"
                                                min="1"
                                                value={formData.recurringMonths}
                                                onChange={(e) => handleFieldChange('recurringMonths', e.target.value)}
                                                placeholder="6"
                                                className="rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Max Amount Cap */}
                            <div className="space-y-2 pt-4 border-t">
                                <Label htmlFor="maxAmount">Valor Máximo (opcional)</Label>
                                <Input
                                    id="maxAmount"
                                    type="number"
                                    step="0.01"
                                    value={formData.maxAmount}
                                    onChange={(e) => handleFieldChange('maxAmount', e.target.value)}
                                    placeholder="Ex: 1000.00"
                                    className="rounded-lg"
                                />
                                <p className="text-xs text-gray-500">
                                    Limite máximo de recompensa por conversão
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trigger Rules */}
                    <Card className="rounded-xl">
                        <CardHeader>
                            <CardTitle>Regras de Ativação</CardTitle>
                            <CardDescription>Quando a recompensa deve ser concedida</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="triggerEvent">Evento Gatilho *</Label>
                                <select
                                    id="triggerEvent"
                                    value={formData.triggerEvent}
                                    onChange={(e) => handleFieldChange('triggerEvent', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                >
                                    {TRIGGER_EVENTS.map(event => (
                                        <option key={event.value} value={event.value}>
                                            {event.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedTrigger?.requiresAmount && (
                                <div className="space-y-2">
                                    <Label htmlFor="minPurchaseAmount">Valor Mínimo de Compra (opcional)</Label>
                                    <Input
                                        id="minPurchaseAmount"
                                        type="number"
                                        step="0.01"
                                        value={formData.minPurchaseAmount}
                                        onChange={(e) => handleFieldChange('minPurchaseAmount', e.target.value)}
                                        placeholder="Ex: 100.00"
                                        className="rounded-lg"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Compra deve ser igual ou superior a este valor
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/admin/referrals/programs')}
                            className="rounded-lg"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="bg-[#8B7355] hover:bg-[#6d5a42] rounded-lg"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {saveMutation.isPending ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar Programa'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
