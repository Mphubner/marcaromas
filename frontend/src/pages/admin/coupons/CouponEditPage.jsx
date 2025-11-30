import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Ticket, Calendar, DollarSign, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CouponEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    code: '',
    type: 'percent',
    amount: '',
    description: '',
    min_purchase: '',
    maxDiscountAmount: '',
    usage_limit: '',
    startDate: '',
    expiry_date: '',
    is_active: true,
    applies_to: 'all',
  });

  const { data: coupon, isLoading } = useQuery({
    queryKey: ['admin-coupon', id],
    queryFn: () => adminService.getCouponById(id),
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        type: coupon.type,
        amount: coupon.amount,
        description: coupon.description || '',
        min_purchase: coupon.min_purchase || '',
        maxDiscountAmount: coupon.maxDiscountAmount || '',
        usage_limit: coupon.usage_limit || '',
        startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().slice(0, 16) : '',
        expiry_date: coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().slice(0, 16) : '',
        is_active: coupon.is_active,
        applies_to: coupon.applies_to || 'all',
      });
    }
  }, [coupon]);

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        amount: parseFloat(data.amount),
        min_purchase: data.min_purchase ? parseFloat(data.min_purchase) : null,
        maxDiscountAmount: data.maxDiscountAmount ? parseFloat(data.maxDiscountAmount) : null,
        usage_limit: data.usage_limit ? parseInt(data.usage_limit) : null,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
        expiry_date: data.expiry_date ? new Date(data.expiry_date).toISOString() : null,
      };
      return adminService.updateCoupon(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      queryClient.invalidateQueries(['admin-coupon', id]);
      toast.success('Cupom atualizado com sucesso!');
      navigate('/admin/coupons');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar cupom');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      toast.success('Cupom deletado!');
      navigate('/admin/coupons');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.amount) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/coupons')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Editar Cupom</h2>
            <p className="text-gray-500">Gerencie os detalhes do cupom {formData.code}</p>
          </div>
        </div>
        <Button
          variant="destructive"
          className="rounded-lg"
          onClick={() => {
            if (confirm('Tem certeza que deseja deletar este cupom?')) {
              deleteMutation.mutate();
            }
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Deletar Cupom
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Info */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ticket className="w-5 h-5 text-[#8B7355]" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Código do Cupom *</Label>
              <Input
                placeholder="EX: PROMO10"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="uppercase font-mono rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Desconto *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Porcentagem (%)</SelectItem>
                  <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                  <SelectItem value="free_shipping">Frete Grátis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Valor do Desconto *</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="pl-8 rounded-lg"
                  required
                />
                <span className="absolute left-3 top-2.5 text-gray-500 text-sm">
                  {formData.type === 'percent' ? '%' : 'R$'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição (Interna)</Label>
              <Input
                placeholder="Ex: Promoção de Natal"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Rules & Limits */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5 text-[#8B7355]" />
              Regras e Limites
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Compra Mínima (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Opcional"
                value={formData.min_purchase}
                onChange={(e) => setFormData({ ...formData, min_purchase: e.target.value })}
                className="rounded-lg"
              />
            </div>

            {formData.type === 'percent' && (
              <div className="space-y-2">
                <Label>Desconto Máximo (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Opcional"
                  value={formData.maxDiscountAmount}
                  onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                  className="rounded-lg"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Limite de Uso (Total)</Label>
              <Input
                type="number"
                placeholder="Ilimitado se vazio"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Usos Atuais</Label>
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                {coupon?.times_used || 0} vezes utilizado
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-[#8B7355]" />
              Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Data de Expiração</Label>
              <Input
                type="datetime-local"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg col-span-full">
              <div className="space-y-0.5">
                <Label className="text-base">Status do Cupom</Label>
                <p className="text-sm text-gray-500">Ativar ou desativar este cupom imediatamente</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-lg"
            onClick={() => navigate('/admin/coupons')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-[#8B7355] hover:bg-[#6d5940] text-white rounded-lg min-w-[150px]"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
