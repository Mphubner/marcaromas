import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Ticket, Search, Filter, Plus, Copy, Check, X, Calendar,
  TrendingUp, Percent, DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

export default function CouponsListPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const queryClient = useQueryClient();

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons', { search, type: typeFilter, status: statusFilter }],
    queryFn: () => adminService.getAllCoupons({ search, type: typeFilter, status: statusFilter }),
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-coupon-stats'],
    queryFn: () => adminService.getCouponStats(),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ couponId, is_active }) =>
      adminService.updateCoupon(couponId, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      toast.success('Status atualizado!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (couponId) => adminService.deleteCoupon(couponId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      toast.success('Cupom deletado!');
    },
  });

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado!');
  };

  const getTypeBadge = (type) => {
    const config = {
      percent: { color: 'bg-purple-100 text-purple-800', label: 'Percentual', icon: Percent },
      fixed: { color: 'bg-green-100 text-green-800', label: 'Fixo', icon: DollarSign },
      free_shipping: { color: 'bg-blue-100 text-blue-800', label: 'Frete Grátis', icon: Ticket },
    };
    const { color, label, icon: Icon } = config[type] || config.percent;
    return (
      <Badge className={`${color} rounded-lg`}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getStatusBadge = (coupon) => {
    if (!coupon.is_active) {
      return <Badge className="bg-gray-100 text-gray-800 rounded-lg">Inativo</Badge>;
    }
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return <Badge className="bg-red-100 text-red-800 rounded-lg">Expirado</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800 rounded-lg">Ativo</Badge>;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Cupons</h2>
          <p className="text-gray-500 mt-1">Gerencie cupons de desconto</p>
        </div>
        <Link to="/admin/coupons/create">
          <Button className="bg-[#8B7355] hover:bg-[#6d5940] text-white rounded-lg">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cupom
          </Button>
        </Link>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Ticket className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Cupons</div>
                <div className="text-2xl font-bold">{stats?.totalCoupons || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Cupons Ativos</div>
                <div className="text-2xl font-bold">{stats?.activeCoupons || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total de Usos</div>
                <div className="text-2xl font-bold">{stats?.totalUsage || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Desconto Total</div>
                <div className="text-2xl font-bold">R$ {(stats?.totalDiscountGiven || 0).toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-xl">
        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar cupons..."
                className="pl-8 rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-lg ${showFilters ? 'bg-[#8B7355] text-white' : ''}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Tipo</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                >
                  <option value="">Todos</option>
                  <option value="percent">Percentual</option>
                  <option value="fixed">Fixo</option>
                  <option value="free_shipping">Frete Grátis</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                >
                  <option value="">Todos</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Coupons Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map(coupon => (
              <Card
                key={coupon.id}
                className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] rounded-xl overflow-hidden"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Code */}
                  <div className="flex items-center justify-between">
                    <div
                      onClick={() => copyCode(coupon.code)}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="text-2xl font-bold text-[#8B7355]">{coupon.code}</div>
                      <Copy className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Type & Status */}
                  <div className="flex gap-2">
                    {getTypeBadge(coupon.type)}
                    {getStatusBadge(coupon)}
                  </div>

                  {/* Discount Value */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {coupon.type === 'percent' ? `${coupon.amount}%` :
                        coupon.type === 'fixed' ? `R$ ${coupon.amount.toFixed(2)}` : 'Frete Grátis'}
                    </span>
                    <span className="text-sm text-gray-500">de desconto</span>
                  </div>

                  {/* Usage */}
                  <div className="text-sm text-gray-600">
                    <strong>Usos:</strong> {coupon.times_used}
                    {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                  </div>

                  {/* Expiry */}
                  {coupon.expiry_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Expira: {new Date(coupon.expiry_date).toLocaleDateString()}
                    </div>
                  )}

                  {/* Description */}
                  {coupon.description && (
                    <p className="text-xs text-gray-500 border-t pt-3">{coupon.description}</p>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex gap-2 border-t">
                    <Link to={`/admin/coupons/${coupon.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full rounded-lg text-xs">
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant={coupon.is_active ? 'outline' : 'default'}
                      size="sm"
                      className="rounded-lg text-xs"
                      onClick={() => toggleStatusMutation.mutate({
                        couponId: coupon.id,
                        is_active: !coupon.is_active
                      })}
                    >
                      {coupon.is_active ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-lg text-xs"
                      onClick={() => {
                        if (confirm('Deletar este cupom?')) {
                          deleteMutation.mutate(coupon.id);
                        }
                      }}
                    >
                      Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {coupons.length === 0 && (
            <Card className="p-12 rounded-xl">
              <div className="text-center text-gray-500">
                <Ticket className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">Nenhum cupom encontrado</p>
                <p className="text-sm mt-1">Crie um novo cupom para começar</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
