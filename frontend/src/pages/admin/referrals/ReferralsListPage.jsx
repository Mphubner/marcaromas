import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Users, TrendingUp, DollarSign, Copy, CheckCircle, Edit2, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function ReferralsListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const queryClient = useQueryClient();

  const { data: referrals = [], isLoading } = useQuery({
    queryKey: ['admin-referrals', { search, status: statusFilter }],
    queryFn: () => adminService.getAllReferrals({ search, status: statusFilter }),
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-referral-stats'],
    queryFn: () => adminService.getReferralStats(),
  });

  const markAsPaidMutation = useMutation({
    mutationFn: (referralId) => adminService.markReferralAsPaid(referralId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-referrals']);
      toast.success('Recompensa marcada como paga!');
    },
  });

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado!');
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Completado' },
      rewarded: { color: 'bg-green-100 text-green-800', label: 'Recompensado' },
                < div className = "text-sm text-gray-500" > Total Indicações</div>
      <div className="text-2xl font-bold">{stats?.totalReferrals || 0}</div>
              </div >
            </div >
          </CardContent >
        </Card >

        <Card className="hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Completadas</div>
                <div className="text-2xl font-bold">{stats?.completedReferrals || 0}</div>
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
                <div className="text-sm text-gray-500">Recompensas Pendentes</div>
                <div className="text-2xl font-bold">{stats?.pendingRewards || 0}</div>
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
                <div className="text-sm text-gray-500">Taxa de Conversão</div>
                <div className="text-2xl font-bold">{stats?.conversionRate || 0}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div >

    {/* Filters */ }
    < Card className = "rounded-xl" >
      <div className="p-4 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar indicações..."
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
          <div className="grid grid-cols-1 gap-4 pt-4 border-t">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
              >
                <option value="">Todas</option>
                <option value="pending">Pendente</option>
                <option value="completed">Completado</option>
                <option value="rewarded">Recompensado</option>
              </select>
            </div>
          </div>
        )}
      </div>
      </Card >

    {/* Referrals Grid */ }
  {
    isLoading ? (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent" />
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {referrals.map(referral => (
          <Card key={referral.id} className="group hover:shadow-lg transition-all rounded-xl">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{referral.referrerName || referral.referrer_email}</div>
                  <div className="text-xs text-gray-500 mt-1">{referral.referrer_email}</div>
                </div>
                {getStatusBadge(referral.status)}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {/* Referral Code */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Código de Indicação</label>
                <div
                  onClick={() => copyCode(referral.referral_code)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="text-lg font-bold text-[#8B7355]">{referral.referral_code}</div>
                  <Copy className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Referred */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Indicado</label>
                <div className="text-sm">
                  {referral.referred_email ? (
                    <>
                      <div className="font-medium">{referral.referredName || 'Sem nome'}</div>
                      <div className="text-gray-500 text-xs">{referral.referred_email}</div>
                    </>
                  ) : (
                    <span className="text-gray-400 italic">Ainda não usado</span>
                  )}
                </div>
              </div>

              {/* Reward */}
              {referral.reward_amount > 0 && (
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Recompensa</label>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {referral.reward_amount?.toFixed(2) || '0.00'}
                  </div>
                  {referral.rewardPaid && (
                    <div className="text-xs text-green-600 mt-1">
                      ✓ Pago em {new Date(referral.paidAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}

              {/* Dates */}
              <div className="text-xs text-gray-500 space-y-1 pt-3 border-t">
                <div>Criado: {new Date(referral.createdAt).toLocaleDateString()}</div>
                {referral.completedAt && (
                  <div>Completado: {new Date(referral.completedAt).toLocaleDateString()}</div>
                )}
              </div>

              {/* Notes */}
              {referral.notes && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                  {referral.notes}
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t flex gap-2">
                {referral.status === 'completed' && !referral.rewardPaid && (
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    onClick={() => markAsPaidMutation.mutate(referral.id)}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Marcar como Pago
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-lg"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  {
    referrals.length === 0 && !isLoading && (
      <Card className="p-12 rounded-xl">
        <div className="text-center text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">Nenhuma indicação encontrada</p>
        </div>
      </Card>
    )
  }
    </div >
  );
}
