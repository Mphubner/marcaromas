import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Link2,
  Users,
  ShoppingBag,
  DollarSign,
  Copy,
  Check,
  TrendingUp,
  MessageCircle,
  Mail,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Premium Client Components
import {
  ClientPageHeader,
  ClientCard,
  ClientButton,
  ClientBadge,
  ClientStats,
  ClientEmptyState
} from '@/components/client';

// UI Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

// Services
import referralService from '../services/referralService';
import { useAuth } from '../context/AuthContext';

export default function Indicacoes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [copiedLink, setCopiedLink] = useState(null);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [payoutData, setPayoutData] = useState({
    amount: '',
    method: 'PIX',
    pixKey: ''
  });

  // Fetch dashboard data
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['referral-dashboard'],
    queryFn: referralService.getMyDashboard
  });

  // Fetch conversions
  const { data: conversions = [] } = useQuery({
    queryKey: ['referral-conversions'],
    queryFn: () => referralService.getMyConversions()
  });

  // Fetch payouts
  const { data: payouts = [] } = useQuery({
    queryKey: ['referral-payouts'],
    queryFn: referralService.getMyPayouts
  });

  // Share link mutation
  const shareMutation = useMutation({
    mutationFn: ({ platform }) => referralService.generateShareLink(platform)
  });

  // Payout request mutation
  const payoutMutation = useMutation({
    mutationFn: (data) => referralService.requestPayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['referral-dashboard']);
      queryClient.invalidateQueries(['referral-payouts']);
      toast.success('Solicitação de saque enviada!');
      setShowPayoutDialog(false);
      setPayoutData({ amount: '', method: 'PIX', pixKey: '' });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erro ao solicitar saque');
    }
  });

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    toast.success('Link copiado!');
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleShare = async (platform) => {
    try {
      const response = await shareMutation.mutateAsync({ platform });

      if (platform === 'WHATSAPP' || platform === 'FACEBOOK' || platform === 'EMAIL') {
        window.open(response.url, '_blank');
      } else {
        copyToClipboard(response.url, platform.toLowerCase());
      }
    } catch (error) {
      toast.error('Erro ao gerar link de compartilhamento');
    }
  };

  const handlePayoutRequest = () => {
    if (!payoutData.amount || parseFloat(payoutData.amount) < 50) {
      toast.error('Valor mínimo de saque é R$ 50,00');
      return;
    }

    if (payoutData.method === 'PIX' && !payoutData.pixKey) {
      toast.error('Informe sua chave PIX');
      return;
    }

    payoutMutation.mutate({
      amount: parseFloat(payoutData.amount),
      method: payoutData.method,
      pixKey: payoutData.pixKey
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const links = dashboard?.links || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientPageHeader
          title="Programa de Indicações"
          subtitle="Indique amigos e ganhe recompensas"
          backTo="/dashboard"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ClientStats
            icon={Link2}
            label="Total de Cliques"
            value={stats.totalClicks || 0}
            format="number"
          />
          <ClientStats
            icon={Users}
            label="Cadastros"
            value={stats.totalSignups || 0}
            format="number"
          />
          <ClientStats
            icon={ShoppingBag}
            label="Conversões"
            value={stats.totalConversions || 0}
            format="number"
            trend={{ value: stats.conversionRate, direction: 'up' }}
          />
          <ClientStats
            icon={DollarSign}
            label="Total Ganho"
            value={stats.totalEarned || 0}
            format="currency"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Referral Links */}
          <div className="md:col-span-2">
            <ClientCard title="Seu Link de Indicação" icon={Link2}>
              <div className="space-y-4">
                {/* Main Link */}
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Link Principal</Label>
                  <div className="flex gap-2">
                    <Input
                      value={links.general || ''}
                      readOnly
                      className="flex-1 font-mono text-sm"
                    />
                    <ClientButton
                      variant="outline"
                      onClick={() => copyToClipboard(links.general, 'general')}
                    >
                      {copiedLink === 'general' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </ClientButton>
                  </div>
                </div>

                {/* Share Buttons */}
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Compartilhar em:</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <ClientButton
                      variant="outline"
                      onClick={() => handleShare('WHATSAPP')}
                      className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 border-green-200"
                    >
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span className="hidden sm:inline text-green-700">WhatsApp</span>
                    </ClientButton>

                    <ClientButton
                      variant="outline"
                      onClick={() => handleShare('INSTAGRAM')}
                      className="flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 border-purple-200"
                    >
                      <Share2 className="w-4 h-4 text-purple-600" />
                      <span className="hidden sm:inline text-purple-700">Instagram</span>
                    </ClientButton>

                    <ClientButton
                      variant="outline"
                      onClick={() => handleShare('FACEBOOK')}
                      className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
                    >
                      <Share2 className="w-4 h-4 text-blue-600" />
                      <span className="hidden sm:inline text-blue-700">Facebook</span>
                    </ClientButton>

                    <ClientButton
                      variant="outline"
                      onClick={() => handleShare('EMAIL')}
                      className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border-gray-200"
                    >
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="hidden sm:inline text-gray-700">Email</span>
                    </ClientButton>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="p-4 bg-gradient-to-r from-[#8B7355] to-[#7A6548] rounded-2xl text-white">
                  <p className="text-sm opacity-90 mb-1">Seu Código de Indicação</p>
                  <p className="text-3xl font-bold font-['Playfair_Display'] tracking-wider">
                    {dashboard?.referralCode}
                  </p>
                </div>
              </div>
            </ClientCard>
          </div>

          {/* Earnings Card */}
          <div>
            <ClientCard gradient className="h-full">
              <div className="text-white">
                <DollarSign className="w-8 h-8 mb-4" />
                <p className="text-sm opacity-90 mb-1">Disponível para Saque</p>
                <p className="text-4xl font-bold font-['Playfair_Display'] mb-4">
                  R$ {stats.pendingEarnings?.toFixed(2) || '0.00'}
                </p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-90">Total Ganho:</span>
                    <span className="font-semibold">R$ {stats.totalEarned?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Já Sacado:</span>
                    <span className="font-semibold">R$ {stats.paidOut?.toFixed(2)}</span>
                  </div>
                </div>

                <ClientButton
                  variant="secondary"
                  onClick={() => setShowPayoutDialog(true)}
                  disabled={!stats.pendingEarnings || stats.pendingEarnings < 50}
                  className="w-full"
                >
                  Solicitar Saque
                </ClientButton>

                {stats.pendingEarnings < 50 && (
                  <p className="text-xs opacity-75 mt-2 text-center">
                    Mínimo R$ 50,00 para saque
                  </p>
                )}
              </div>
            </ClientCard>
          </div>
        </div>

        {/* Conversions Table */}
        <ClientCard title="Suas Indicações" icon={TrendingUp}>
          {conversions.length === 0 ? (
            <ClientEmptyState
              icon={Users}
              title="Nenhuma indicação ainda"
              message="Compartilhe seu link e comece a ganhar!"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amigo</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Valor</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Recompensa</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {conversions.map((conv, index) => (
                    <motion.tr
                      key={conv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {conv.referredUser?.name || 'Usuário'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {conv.referredUser?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(conv.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        <ClientBadge
                          variant={conv.type === 'SUBSCRIPTION' ? 'success' : 'default'}
                        >
                          {conv.type === 'SUBSCRIPTION' ? 'Assinatura' : 'Compra'}
                        </ClientBadge>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        R$ {conv.amount?.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-green-600">
                          R$ {conv.reward?.toFixed(2)}
                        </span>
                        {conv.isRecurring && (
                          <span className="text-xs text-gray-500 ml-1">(recorrente)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <ClientBadge
                          variant={
                            conv.status === 'PAID' ? 'success' :
                              conv.status === 'APPROVED' ? 'active' :
                                conv.status === 'PENDING' ? 'pending' : 'error'
                          }
                        >
                          {conv.status === 'PAID' ? 'Pago' :
                            conv.status === 'APPROVED' ? 'Aprovado' :
                              conv.status === 'PENDING' ? 'Pendente' : 'Cancelado'}
                        </ClientBadge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ClientCard>

        {/* Payout Dialog */}
        <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Saque</DialogTitle>
              <DialogDescription>
                Valor disponível: R$ {stats.pendingEarnings?.toFixed(2)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Valor do Saque *</Label>
                <Input
                  type="number"
                  min="50"
                  step="0.01"
                  placeholder="50.00"
                  value={payoutData.amount}
                  onChange={(e) => setPayoutData({ ...payoutData, amount: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo: R$ 50,00</p>
              </div>

              <div>
                <Label>Método de Pagamento *</Label>
                <Select
                  value={payoutData.method}
                  onValueChange={(value) => setPayoutData({ ...payoutData, method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Transferência Bancária</SelectItem>
                    <SelectItem value="STORE_CREDIT">Crédito na Loja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {payoutData.method === 'PIX' && (
                <div>
                  <Label>Chave PIX *</Label>
                  <Input
                    placeholder="email@example.com ou CPF"
                    value={payoutData.pixKey}
                    onChange={(e) => setPayoutData({ ...payoutData, pixKey: e.target.value })}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <ClientButton variant="outline" onClick={() => setShowPayoutDialog(false)}>
                Cancelar
              </ClientButton>
              <ClientButton
                onClick={handlePayoutRequest}
                disabled={payoutMutation.isPending}
              >
                {payoutMutation.isPending ? 'Processando...' : 'Solicitar Saque'}
              </ClientButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
