import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Eye,
  User,
  Pause,
  Play,
  CreditCard,
  Package,
  Calendar,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

const statusConfig = {
  active: {
    label: 'Ativa',
    color: 'bg-green-100 text-green-800',
    icon: Play
  },
  paused: {
    label: 'Pausada',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Pause
  },
  canceled: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800',
    icon: AlertCircle
  }
};

const paymentMethodIcons = {
  credit_card: '💳',
  debit_card: '💳',
  pix: '📱',
  boleto: '📄'
};

export default function SubscriptionsListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['admin-subscriptions', { search, status: statusFilter, plan: planFilter, payment: paymentFilter }],
    queryFn: async () => {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (planFilter) params.plan = planFilter;
      if (paymentFilter) params.payment = paymentFilter;

      const { data } = await api.get('/subscriptions/admin', { params });
      return Array.isArray(data) ? data : [];
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C2419]">Assinaturas</h2>
          <p className="text-gray-600 mt-1">Gerencie todas as assinaturas do sistema</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 rounded-xl border-2">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              type="text"
              placeholder="Buscar por cliente, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-lg"
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 rounded-lg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="paused">Pausada</SelectItem>
                <SelectItem value="canceled">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Plano..."
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-40 rounded-lg"
            />

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-48 rounded-lg">
                <SelectValue placeholder="Método Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="credit_card">Cartão Crédito</SelectItem>
                <SelectItem value="debit_card">Cartão Débito</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>

            {(search || statusFilter || planFilter || paymentFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setPlanFilter('');
                  setPaymentFilter('');
                }}
                className="rounded-lg"
              >
                Limpar Filtros
              </Button>
            )}

            <div className="ml-auto text-sm text-gray-600">
              {subscriptions.length} assinatura{subscriptions.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando assinaturas...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && subscriptions.length === 0 && (
        <Card className="rounded-xl border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma assinatura encontrada
            </h3>
            <p className="text-gray-600">Tente ajustar os filtros de busca</p>
          </CardContent>
        </Card>
      )}

      {/* Subscriptions List */}
      {!isLoading && subscriptions.length > 0 && (
        <div className="space-y-4">
          {subscriptions.map((sub, index) => {
            const config = statusConfig[sub.status] || statusConfig.active;
            const StatusIcon = config.icon;
            const hasFailures = sub.failedPaymentsCount > 0;

            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="rounded-xl border-2 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      {/* Cliente Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-[#8B7355] text-white flex items-center justify-center text-lg font-bold">
                            {sub.user?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-[#2C2419]">
                              {sub.user?.name || 'N/A'}
                            </h3>
                            <p className="text-sm text-gray-600">{sub.user?.email || 'Sem email'}</p>
                          </div>
                          <Badge className={`${config.color} rounded-md`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                          {hasFailures && (
                            <Badge variant="outline" className="rounded-md border-red-500 text-red-700">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {sub.failedPaymentsCount} falha{sub.failedPaymentsCount > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>

                        {/* Details Row */}
                        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                          <div>
                            <span className="font-medium text-gray-700">Plano:</span>{' '}
                            {sub.plan?.name || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Valor:</span>{' '}
                            <span className="text-[#8B7355] font-semibold">
                              R$ {typeof sub.plan?.price === 'number' ? sub.plan.price.toFixed(2) : '0,00'}
                            </span>
                            /mês
                          </div>
                          <div>
                            {paymentMethodIcons[sub.paymentMethod] || '💳'}{' '}
                            {sub.paymentMethod?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Próxima: {sub.nextBilling ? new Date(sub.nextBilling).toLocaleDateString('pt-BR') : 'N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            Última: {sub.lastDeliveryDate ? new Date(sub.lastDeliveryDate).toLocaleDateString('pt-BR') : 'Nenhuma'}
                          </div>
                          <div>
                            Há {Math.floor((new Date() - new Date(sub.startedAt)) / (1000 * 60 * 60 * 24 * 30))} meses
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 ml-4">
                        <Link to={`/admin/subscriptions/${sub.id}`}>
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <Eye className="w-4 h-4 mr-2" />
                            Detalhes
                          </Button>
                        </Link>
                        <Link to={`/admin/customers/${sub.userId}`}>
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <User className="w-4 h-4 mr-2" />
                            Cliente
                          </Button>
                        </Link>
                        {sub.status === 'active' && (
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        {sub.status === 'paused' && (
                          <Button variant="outline" size="sm" className="rounded-lg text-green-600">
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}