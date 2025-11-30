import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  User,
  Calendar,
  CreditCard,
  Package,
  MapPin,
  Play,
  Pause,
  XCircle,
  Edit,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

const statusConfig = {
  active: {
    label: 'Ativa',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Play
  },
  paused: {
    label: 'Pausada',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Pause
  },
  canceled: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  }
};

const eventTypeConfig = {
  subscription_created: { icon: '🎉', label: 'Criação', color: 'text-blue-600' },
  payment: { icon: '💳', label: 'Pagamento', color: 'text-green-600' },
  delivery: { icon: '📦', label: 'Entrega', color: 'text-purple-600' },
  pause: { icon: '⏸️', label: 'Pausa', color: 'text-yellow-600' },
  resume: { icon: '▶️', label: 'Retomada', color: 'text-green-600' },
  plan_change: { icon: '🔄', label: 'Mudança de Plano', color: 'text-blue-600' },
  cancellation: { icon: '❌', label: 'Cancelamento', color: 'text-red-600' }
};

export default function SubscriptionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ['admin-subscription-detail', id],
    queryFn: async () => {
      console.log('Fetching subscription with ID:', id);
      const { data } = await api.get(`/subscriptions/admin/${id}`);
      console.log('Subscription data received:', data);
      return data;
    }
  });

  console.log('Current state:', { subscription, isLoading, error });

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <p className="text-center text-gray-500">Carregando detalhes...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Card className="rounded-xl border-2">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Assinatura não encontrada</h3>
            <Button onClick={() => navigate('/admin/subscriptions')} className="rounded-lg mt-4">
              Voltar para Assinaturas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const config = statusConfig[subscription.status] || statusConfig.active;
  const StatusIcon = config.icon;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/subscriptions')}
          className="rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-[#2C2419]">Assinatura #{subscription.id}</h2>
          <p className="text-gray-600 mt-1">Gerenciar detalhes da assinatura</p>
        </div>
        <Badge className={`${config.color} rounded-md text-lg px-4 py-2 border-2`}>
          <StatusIcon className="w-5 h-5 mr-2" />
          {config.label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Cliente */}
          <Card className="rounded-xl border-2">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg font-semibold text-[#2C2419] flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-[#8B7355] text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {subscription.user?.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{subscription.user?.name || 'N/A'}</h3>
                  <p className="text-gray-600">{subscription.user?.email || 'Sem email'}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <Link to={`/admin/customers/${subscription.userId}`}>
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <User className="w-4 h-4 mr-2" />
                        Ver Perfil Completo
                      </Button>
                    </Link>
                    <span className="text-sm text-gray-600">
                      Membro desde {new Date(subscription.startedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Assinatura */}
          <Card className="rounded-xl border-2">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg font-semibold text-[#2C2419] flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Detalhes da Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Plano Atual</p>
                  <p className="text-lg font-semibold text-gray-900">{subscription.plan?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Valor Mensal</p>
                  <p className="text-lg font-semibold text-[#8B7355]">
                    R$ {typeof subscription.plan?.price === 'number' ? subscription.plan.price.toFixed(2) : '0,00'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Próxima Cobrança</p>
                  <p className="text-gray-900">
                    {subscription.nextBilling ? new Date(subscription.nextBilling).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Método de Pagamento</p>
                  <p className="text-gray-900">
                    {subscription.paymentMethod?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                  </p>
                </div>
              </div>

              {subscription.status === 'paused' && subscription.pausedAt && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-800">
                    ⏸️ Pausada desde {new Date(subscription.pausedAt).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Pausas anteriores: {subscription.pauseCount || 0}
                  </p>
                </div>
              )}

              {subscription.status === 'canceled' && subscription.canceledAt && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-800">
                    ❌ Cancelada em {new Date(subscription.canceledAt).toLocaleDateString('pt-BR')}
                  </p>
                  {subscription.cancellationReason && (
                    <p className="text-xs text-red-700 mt-1">
                      Motivo: {subscription.cancellationReason}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Endereços */}
          {(subscription.deliveryAddress || subscription.billingAddress) && (
            <Card className="rounded-xl border-2">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg font-semibold text-[#2C2419] flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereços
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscription.deliveryAddress && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">📦 Endereço de Entrega</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{subscription.deliveryAddress.street}, {subscription.deliveryAddress.number}</p>
                        {subscription.deliveryAddress.complement && <p>{subscription.deliveryAddress.complement}</p>}
                        <p>{subscription.deliveryAddress.neighborhood}</p>
                        <p>{subscription.deliveryAddress.city} - {subscription.deliveryAddress.state}</p>
                        <p>CEP: {subscription.deliveryAddress.zipCode}</p>
                      </div>
                    </div>
                  )}
                  {subscription.billingAddress && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">💳 Endereço de Cobrança</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{subscription.billingAddress.street}, {subscription.billingAddress.number}</p>
                        {subscription.billingAddress.complement && <p>{subscription.billingAddress.complement}</p>}
                        <p>{subscription.billingAddress.neighborhood}</p>
                        <p>{subscription.billingAddress.city} - {subscription.billingAddress.state}</p>
                        <p>CEP: {subscription.billingAddress.zipCode}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico */}
          <Card className="rounded-xl border-2">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg font-semibold text-[#2C2419] flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Histórico Completo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {subscription.history && subscription.history.length > 0 ? (
                <div className="space-y-4">
                  {subscription.history.map((event, index) => {
                    const eventConfig = eventTypeConfig[event.eventType] || { icon: '•', label: event.eventType, color: 'text-gray-600' };
                    const isSuccess = event.eventStatus === 'success';
                    const isFailed = event.eventStatus === 'failed';

                    return (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isSuccess ? 'bg-green-100' : isFailed ? 'bg-red-100' : 'bg-gray-100'
                            }`}>
                            {eventConfig.icon}
                          </div>
                          {index < subscription.history.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className={`font-semibold ${eventConfig.color}`}>
                                {eventConfig.label}
                                {isFailed && <span className="ml-2 text-red-600">• Falhou</span>}
                                {isSuccess && event.eventType === 'payment' && <span className="ml-2 text-green-600">• Aprovado</span>}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                              {event.metadata && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {JSON.stringify(event.metadata)}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(event.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhum evento no histórico</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Resumo Financeiro */}
          <Card className="rounded-xl border-2 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="text-sm font-semibold text-[#2C2419]">
                💰 Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div>
                <p className="text-xs text-gray-600">Total Pago</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {((subscription.deliveryCount || 0) * (subscription.plan?.price || 0)).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Próxima Cobrança</p>
                <p className="text-lg font-semibold text-gray-900">
                  R$ {subscription.plan?.price?.toFixed(2) || '0,00'}
                </p>
                <p className="text-xs text-gray-500">
                  {subscription.nextBilling ? new Date(subscription.nextBilling).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card className="rounded-xl border-2">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-sm font-semibold text-[#2C2419]">
                📊 Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Entregas:</span>
                <span className="font-semibold">{subscription.deliveryCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tempo Ativo:</span>
                <span className="font-semibold">
                  {Math.floor((new Date() - new Date(subscription.startedAt)) / (1000 * 60 * 60 * 24 * 30))} meses
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pausas:</span>
                <span className="font-semibold">{subscription.pauseCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Falhas Pagamento:</span>
                <span className={`font-semibold ${subscription.failedPaymentsCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {subscription.failedPaymentsCount || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card className="rounded-xl border-2">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-sm font-semibold text-[#2C2419]">
                ⚡ Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2">
              {subscription.status === 'active' && (
                <Button variant="outline" size="sm" className="w-full rounded-lg justify-start">
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar Assinatura
                </Button>
              )}
              {subscription.status === 'paused' && (
                <Button variant="outline" size="sm" className="w-full rounded-lg justify-start text-green-600">
                  <Play className="w-4 h-4 mr-2" />
                  Retomar Assinatura
                </Button>
              )}
              {subscription.status !== 'canceled' && (
                <Button variant="outline" size="sm" className="w-full rounded-lg justify-start text-red-600">
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancelar Assinatura
                </Button>
              )}
              <Button variant="outline" size="sm" className="w-full rounded-lg justify-start">
                <Edit className="w-4 h-4 mr-2" />
                Alterar Plano
              </Button>
              <Button variant="outline" size="sm" className="w-full rounded-lg justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                Atualizar Pagamento
              </Button>
            </CardContent>
          </Card>

          {/* Alertas */}
          {subscription.failedPaymentsCount > 0 && (
            <Card className="rounded-xl border-2 bg-red-50 border-red-200">
              <CardHeader className="bg-white/50 border-b border-red-200">
                <CardTitle className="text-sm font-semibold text-red-800 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Alertas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-red-700">
                  ⚠️ {subscription.failedPaymentsCount} tentativa{subscription.failedPaymentsCount > 1 ? 's' : ''} de pagamento falhada{subscription.failedPaymentsCount > 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
