import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Ticket, Calendar, DollarSign, Users, Tag } from 'lucide-react';
import { toast } from 'sonner';

export default function CouponCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

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

  const createMutation = useMutation({
    mutationFn: (data) => {
      // Convert types
      const payload = {
        ...data,
        amount: parseFloat(data.amount),
        min_purchase: data.min_purchase ? parseFloat(data.min_purchase) : null,
        maxDiscountAmount: data.maxDiscountAmount ? parseFloat(data.maxDiscountAmount) : null,
        usage_limit: data.usage_limit ? parseInt(data.usage_limit) : null,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
        expiry_date: data.expiry_date ? new Date(data.expiry_date).toISOString() : null,
      };
      return adminService.createCoupon(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      toast.success('Cupom criado com sucesso!');
      navigate('/admin/coupons');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao criar cupom');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.amount) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/coupons')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Novo Cupom</h2>
          <p className="text-gray-500">Crie um novo cupom de desconto</p>
        </div>
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
            disabled={createMutation.isLoading}
          >
            {createMutation.isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Criar Cupom
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
