import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import api from "@/lib/api";
import ArrayInput from "@/components/admin/ArrayInput";
import ImageUploadMultiple from "@/components/admin/ImageUploadMultiple";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function PlanCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    long_description: "",
    total_value: "",
    price: "",
    discount_percentage: "",
    items_included: [],
    benefits: [],
    images: [],
    seo_title: "",
    seo_description: "",
    is_active: true,
  });

  // Mutation para criar plano
  const createPlanMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        price: parseFloat(data.price) || 0,
        total_value: data.total_value ? parseFloat(data.total_value) : null,
        discount_percentage: data.discount_percentage ? parseFloat(data.discount_percentage) : null,
      };
      const response = await api.post('/plans', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-plans"]);
      queryClient.invalidateQueries(["plans"]);
      toast.success("Plano criado com sucesso!");
      navigate("/admin/plans");
    },
    onError: (error) => {
      console.error('Erro ao criar plano:', error);
      toast.error(error.response?.data?.message || "Erro ao criar plano");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validações
    if (!formData.name.trim()) {
      toast.error("Nome do plano é obrigatório");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Preço do plano deve ser maior que zero");
      return;
    }

    createPlanMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/plans")}
          className="rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#2C2419]">Criar Plano</h1>
          <p className="text-sm text-gray-600 mt-1">
            Preencha os campos abaixo para criar um novo plano de assinatura
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção 1: Informações Básicas */}
        <Card className="border-2 border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              📋 Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nome do Plano */}
              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Nome do Plano *
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ex: Plano Premium"
                  required
                  className="text-sm"
                />
              </div>

              {/* Valor Total */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Valor Total (Produtos + Brindes)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    R$
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.total_value}
                    onChange={(e) => handleChange('total_value', e.target.value)}
                    placeholder="150.00"
                    className="pl-10 text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Valor de mercado dos produtos incluídos
                </p>
              </div>

              {/* Preço do Plano */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Valor do Plano/Mês *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    R$
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="99.90"
                    required
                    className="pl-10 text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Valor cobrado mensalmente do cliente
                </p>
              </div>

              {/* Desconto % */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Desconto (%)
                </Label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => handleChange('discount_percentage', e.target.value)}
                  placeholder="34"
                  className="text-sm"
                />
                <p className="text-xs text-gray-500">
                  Percentual de economia exibido para o cliente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 2: Descrições */}
        <Card className="border-2 border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              📝 Descrições
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Descrição Curta */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Descrição Curta
              </Label>
              <Textarea
                value={formData.short_description}
                onChange={(e) => handleChange('short_description', e.target.value)}
                placeholder="Uma experiência completa com vela exclusiva + brindes"
                maxLength={200}
                rows={2}
                className="text-sm resize-none"
              />
              <p className="text-xs text-gray-500">
                {formData.short_description.length} / 200 caracteres - Aparece no card do plano
              </p>
            </div>

            {/* Descrição Geral */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Descrição Geral
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Perfeito para quem busca economia e qualidade..."
                rows={3}
                className="text-sm"
              />
              <p className="text-xs text-gray-500">
                Descrição resumida exibida abaixo do preço
              </p>
            </div>

            {/* Descrição Longa */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Descrição Detalhada (Opcional)
              </Label>
              <Textarea
                value={formData.long_description}
                onChange={(e) => handleChange('long_description', e.target.value)}
                placeholder="Descrição completa do plano com todos os detalhes..."
                rows={5}
                className="text-sm"
              />
              <p className="text-xs text-gray-500">
                Descrição completa para página de detalhes (futuro)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Seção 3: O que você recebe */}
        <Card className="border-2 border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              📦 O que você recebe
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ArrayInput
              label="Itens Incluídos no Plano"
              placeholder="Ex: 1 vela artesanal exclusiva de 180g"
              values={formData.items_included}
              onChange={(values) => handleChange('items_included', values)}
              maxItems={15}
            />
          </CardContent>
        </Card>

        {/* Seção 4: Benefícios Exclusivos */}
        <Card className="border-2 border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              🎁 Benefícios Exclusivos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ArrayInput
              label="Benefícios do Plano"
              placeholder="Ex: Acesso ao conteúdo premium exclusivo"
              values={formData.benefits}
              onChange={(values) => handleChange('benefits', values)}
              maxItems={15}
            />
          </CardContent>
        </Card>

        {/* Seção 5: Imagens */}
        <Card className="border-2 border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              🖼️ Imagens do Plano
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ImageUploadMultiple
              label="Imagens"
              images={formData.images}
              onImagesChange={(images) => handleChange('images', images)}
              maxImages={5}
              maxSizeMB={5}
            />
          </CardContent>
        </Card>

        {/* Seção 6: SEO (Colapsável) */}
        <Collapsible>
          <Card className="border-2 border-gray-200 rounded-xl shadow-sm">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors">
                <CardTitle className="text-lg font-semibold text-[#2C2419] text-left">
                  🔍 SEO (Opcional)
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    SEO Title
                  </Label>
                  <Input
                    value={formData.seo_title}
                    onChange={(e) => handleChange('seo_title', e.target.value)}
                    placeholder="Título otimizado para SEO"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    SEO Description
                  </Label>
                  <Textarea
                    value={formData.seo_description}
                    onChange={(e) => handleChange('seo_description', e.target.value)}
                    placeholder="Descrição otimizada para motores de busca"
                    rows={3}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Seção 7: Status */}
        <Card className="border-2 border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              ⚙️ Status do Plano
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Plano Ativo
                </Label>
                <p className="text-xs text-gray-500">
                  Planos ativos são exibidos para os clientes
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => handleChange('is_active', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/plans")}
            disabled={createPlanMutation.isPending}
            className="rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={createPlanMutation.isPending}
            className="bg-[#8B7355] hover:bg-[#6B5845] text-white rounded-lg"
          >
            {createPlanMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Criar Plano
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
