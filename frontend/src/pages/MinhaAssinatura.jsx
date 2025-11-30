import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  CreditCard,
  Package,
  Pause,
  Play,
  X,
  AlertCircle,
  TrendingUp,
  Download,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Premium Client Components
import {
  ClientPageHeader,
  ClientCard,
  ClientButton,
  ClientBadge,
  getStatusBadge
} from '@/components/client';

// UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Services
import { subscriptionService } from '../services/subscriptionService';
import { planService } from '../services/planService';
import { useAuth } from '../context/AuthContext';

export default function MinhaAssinatura() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [pauseModalOpen, setPauseModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Fetch subscription data
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: subscriptionService.getMy,
    enabled: !!user
  });

  // Fetch available plans for upgrade
  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: planService.getAll
  });

  // Pause subscription mutation
  const pauseMutation = useMutation({
    mutationFn: () => subscriptionService.pause(subscription.id, { reason: pauseReason }),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-subscription']);
      toast.success('Assinatura pausada com sucesso!');
      setPauseModalOpen(false);
      setPauseReason('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao pausar assinatura');
    }
  });

  // Resume subscription mutation
  const resumeMutation = useMutation({
    mutationFn: () => subscriptionService.resume(subscription.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-subscription']);
      toast.success('Assinatura reativada com sucesso!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao reativar assinatura');
    }
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: () => subscriptionService.cancel(subscription.id, { reason: cancelReason }),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-subscription']);
      toast.success('Assinatura cancelada. Sentiremos sua falta!');
      setCancelModalOpen(false);
      setCancelReason('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao cancelar assinatura');
    }
  });

  // Upgrade subscription mutation
  const upgradeMutation = useMutation({
    mutationFn: (newPlanId) => subscriptionService.changePlan(subscription.id, newPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-subscription']);
      toast.success('Plano alterado com sucesso!');
      setUpgradeModalOpen(false);
      setSelectedPlan(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao alterar plano');
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <ClientPageHeader
            title="Minha Assinatura"
            subtitle="Você ainda não tem uma assinatura ativa"
            backTo="/dashboard"
          />
          <ClientCard>
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#2C2419] mb-2">Nenhuma assinatura encontrada</h3>
              <p className="text-gray-600 mb-6">
                Assine um de nossos planos e receba velas artesanais mensalmente
              </p>
              <ClientButton onClick={() => navigate('/clube')}>
                Conhecer Planos
              </ClientButton>
            </div>
          </ClientCard>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusBadge(subscription.status);
  const isActive = subscription.status === 'ACTIVE';
  const isPaused = subscription.status === 'PAUSED';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientPageHeader
          title="Minha Assinatura"
          subtitle="Gerencie seu plano, pagamentos e preferências"
          backTo="/dashboard"
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Current Plan Card */}
            <ClientCard gradient hoverable={false}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <ClientBadge variant={statusInfo.variant} className="mb-3">
                    {statusInfo.label}
                  </ClientBadge>
                  <h2 className="text-3xl font-bold text-white mb-2 font-['Playfair_Display']">
                    {subscription.plan?.name || 'Plano Básico'}
                  </h2>
                  <p className="text-white/80">
                    {subscription.plan?.description || 'Velas artesanais mensais'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-white font-['Playfair_Display']">
                    R$ {subscription.plan?.price?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-white/80 text-sm">por mês</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <Calendar className="w-5 h-5 text-white/80 mb-2" />
                  <p className="text-xs text-white/70">Próxima Cobrança</p>
                  <p className="font-semibold text-white">
                    {subscription.nextBilling
                      ? format(new Date(subscription.nextBilling), "dd/MM/yyyy", { locale: ptBR })
                      : 'N/A'}
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <Package className="w-5 h-5 text-white/80 mb-2" />
                  <p className="text-xs text-white/70">Próxima Entrega</p>
                  <p className="font-semibold text-white">
                    {subscription.nextDelivery
                      ? format(new Date(subscription.nextDelivery), "dd/MM/yyyy", { locale: ptBR })
                      : 'Em breve'}
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 text-white/80 mb-2" />
                  <p className="text-xs text-white/70">Membro desde</p>
                  <p className="font-semibold text-white">
                    {subscription.startedAt
                      ? format(new Date(subscription.startedAt), "MMM/yyyy", { locale: ptBR })
                      : 'Agora'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {isActive && (
                  <ClientButton
                    variant="secondary"
                    onClick={() => setPauseModalOpen(true)}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar Assinatura
                  </ClientButton>
                )}

                {isPaused && (
                  <ClientButton
                    variant="secondary"
                    onClick={() => resumeMutation.mutate()}
                    disabled={resumeMutation.isPending}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {resumeMutation.isPending ? 'Reativando...' : 'Reativar Assinatura'}
                  </ClientButton>
                )}

                <ClientButton
                  variant="secondary"
                  onClick={() => setUpgradeModalOpen(true)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Alterar Plano
                </ClientButton>

                <ClientButton
                  variant="secondary"
                  onClick={() => setCancelModalOpen(true)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar Assinatura
                </ClientButton>
              </div>
            </ClientCard>

            {/* Delivery Address */}
            <ClientCard title="Endereço de Entrega" icon={MapPin}>
              {subscription.deliveryAddress ? (
                <div className="space-y-2">
                  <p className="font-semibold text-[#2C2419]">
                    {subscription.deliveryAddress.street}, {subscription.deliveryAddress.number}
                  </p>
                  {subscription.deliveryAddress.complement && (
                    <p className="text-gray-600">{subscription.deliveryAddress.complement}</p>
                  )}
                  <p className="text-gray-600">
                    {subscription.deliveryAddress.city} - {subscription.deliveryAddress.state}
                  </p>
                  <p className="text-gray-600">CEP: {subscription.deliveryAddress.zipCode}</p>
                  <ClientButton variant="outline" size="sm" className="mt-4">
                    Alterar Endereço
                  </ClientButton>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">Nenhum endereço cadastrado</p>
                  <ClientButton size="sm">
                    Adicionar Endereço
                  </ClientButton>
                </div>
              )}
            </ClientCard>

            {/* Billing History */}
            <ClientCard title="Histórico de Cobranças">
              {subscription.billingHistory && subscription.billingHistory.length > 0 ? (
                <div className="space-y-3">
                  {subscription.billingHistory.slice(0, 5).map((billing, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#8B7355]/10 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-[#8B7355]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#2C2419]">
                            {format(new Date(billing.date), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                          <p className="text-sm text-gray-600">{billing.description || 'Mensalidade'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#8B7355]">
                          R$ {billing.amount?.toFixed(2) || '0.00'}
                        </p>
                        <ClientBadge variant={billing.status === 'paid' ? 'success' : 'warning'} className="text-xs">
                          {billing.status === 'paid' ? 'Pago' : 'Pendente'}
                        </ClientBadge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 py-6">Nenhuma cobrança registrada</p>
              )}
            </ClientCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Payment Method */}
            <ClientCard title="Forma de Pagamento" icon={CreditCard}>
              {subscription.paymentMethod ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                    <p className="text-xs opacity-70 mb-1">Cartão de Crédito</p>
                    <p className="font-mono text-lg mb-2">•••• •••• •••• {subscription.paymentMethod.last4 || '****'}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs opacity-70">
                        Val: {subscription.paymentMethod.expiry || '**/**'}
                      </span>
                      <span className="font-bold text-sm">
                        {subscription.paymentMethod.brand || 'VISA'}
                      </span>
                    </div>
                  </div>
                  <ClientButton variant="outline" size="sm" className="w-full">
                    Alterar Cartão
                  </ClientButton>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">Nenhum método cadastrado</p>
                  <ClientButton size="sm">
                    Adicionar Cartão
                  </ClientButton>
                </div>
              )}
            </ClientCard>

            {/* Quick Info */}
            <ClientCard>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#2C2419] mb-2">Precisa de Ajuda?</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Nossa equipe está pronta para ajudar você
                  </p>
                  <ClientButton variant="outline" size="sm" className="w-full">
                    Falar com Suporte
                  </ClientButton>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-[#2C2419] mb-2">Benefícios do Seu Plano</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Velas artesanais mensais
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Frete grátis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Acesso a conteúdo exclusivo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Desconto em produtos avulsos
                    </li>
                  </ul>
                </div>
              </div>
            </ClientCard>
          </div>
        </div>

        {/* Pause Modal */}
        <Dialog open={pauseModalOpen} onOpenChange={setPauseModalOpen}>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle>Pausar Assinatura</DialogTitle>
              <DialogDescription>
                Sua assinatura ficará pausada até você reativá-la. Não haverá cobranças durante este período.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="pause-reason">Por que você quer pausar? (opcional)</Label>
                <Textarea
                  id="pause-reason"
                  value={pauseReason}
                  onChange={(e) => setPauseReason(e.target.value)}
                  placeholder="Nos ajude a melhorar..."
                  className="rounded-2xl mt-2"
                  rows={3}
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl">
                <p className="text-sm text-blue-900">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Você pode reativar sua assinatura a qualquer momento
                </p>
              </div>
            </div>
            <DialogFooter>
              <ClientButton variant="ghost" onClick={() => setPauseModalOpen(false)}>
                Cancelar
              </ClientButton>
              <ClientButton
                onClick={() => pauseMutation.mutate()}
                disabled={pauseMutation.isPending}
              >
                {pauseMutation.isPending ? 'Pausando...' : 'Confirmar Pausa'}
              </ClientButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Modal */}
        <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle>Cancelar Assinatura</DialogTitle>
              <DialogDescription>
                Sentiremos sua falta! Tem certeza que deseja cancelar?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="cancel-reason">O que podemos melhorar?</Label>
                <Textarea
                  id="cancel-reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Seu feedback é muito importante para nós..."
                  className="rounded-2xl mt-2"
                  rows={4}
                />
              </div>
              <div className="bg-red-50 p-4 rounded-2xl">
                <p className="text-sm text-red-900 font-semibold mb-2">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Antes de cancelar, considere:
                </p>
                <ul className="text-sm text-red-800 space-y-1 ml-6">
                  <li>• Você perderá acesso ao conteúdo exclusivo</li>
                  <li>• Descontos em produtos avulsos não estarão mais disponíveis</li>
                  <li>• Talvez queira apenas pausar sua assinatura?</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <ClientButton variant="ghost" onClick={() => setCancelModalOpen(false)}>
                Voltar
              </ClientButton>
              <ClientButton
                variant="danger"
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? 'Cancelando...' : 'Confirmar Cancelamento'}
              </ClientButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upgrade/Change Plan Modal */}
        <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
          <DialogContent className="max-w-4xl rounded-3xl">
            <DialogHeader>
              <DialogTitle>Alterar Plano</DialogTitle>
              <DialogDescription>
                Escolha o plano que melhor se adequa às suas necessidades
              </DialogDescription>
            </DialogHeader>
            <div className="grid md:grid-cols-3 gap-4 py-4">
              {plans.map((plan) => {
                const isCurrent = plan.id === subscription.plan?.id;
                const isSelected = selectedPlan === plan.id;

                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all ${isCurrent
                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                        : isSelected
                          ? 'border-[#8B7355] bg-[#8B7355]/5 shadow-lg'
                          : 'border-gray-200 hover:border-[#8B7355]/50'
                      }`}
                    disabled={isCurrent}
                  >
                    {isCurrent && (
                      <ClientBadge variant="success" className="mb-3">
                        Plano Atual
                      </ClientBadge>
                    )}
                    <h3 className="font-bold text-lg text-[#2C2419] mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-3xl font-bold text-[#8B7355] mb-3 font-['Playfair_Display']">
                      R$ {plan.price.toFixed(2)}
                      <span className="text-sm text-gray-600 font-normal">/mês</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      {plan.description}
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {plan.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
            <DialogFooter>
              <ClientButton variant="ghost" onClick={() => setUpgradeModalOpen(false)}>
                Cancelar
              </ClientButton>
              <ClientButton
                onClick={() => selectedPlan && upgradeMutation.mutate(selectedPlan)}
                disabled={!selectedPlan || upgradeMutation.isPending}
              >
                {upgradeMutation.isPending ? 'Alterando...' : 'Confirmar Alteração'}
              </ClientButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
