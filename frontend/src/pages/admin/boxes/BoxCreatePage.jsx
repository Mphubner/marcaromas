import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import ArrayInput from '@/components/admin/ArrayInput';
import ImageUploadMultiple from '@/components/admin/ImageUploadMultiple';

export default function BoxCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    month: '',
    theme: '',
    description: '',
    image_url: '',
    images: [],
    candle_name: '',
    aroma_notes: [],
    items_included: [],
    benefits: [],
    price: '',
    original_price: '',
    total_items_value: '',
    is_available_for_purchase: true,
    category: 'box',
    stock_quantity: '',
    spotify_playlist: '',
    ritual_tips: '',
    is_published: false
  });

  // Mutation para criar
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/boxes', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Box criada com sucesso!');
      queryClient.invalidateQueries(['admin-boxes']);
      navigate(`/admin/boxes/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao criar box');
    }
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validações
    if (!formData.month.trim()) {
      toast.error('Mês é obrigatório');
      return;
    }
    if (!formData.theme.trim()) {
      toast.error('Tema é obrigatório');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Preço deve ser maior que zero');
      return;
    }

    // Preparar dados
    const dataToSend = {
      ...formData,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      total_items_value: formData.total_items_value ? parseFloat(formData.total_items_value) : null,
      stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null
    };

    createMutation.mutate(dataToSend);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/boxes')}
          className="rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-[#2C2419]">Criar Nova Box</h2>
          <p className="text-gray-600 mt-1">Preencha todos os detalhes da nova box mensal</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Informações Básicas */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              📅 Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Mês <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.month}
                  onChange={(e) => handleChange('month', e.target.value)}
                  placeholder="Ex: Dezembro 2025"
                  className="mt-1.5 rounded-lg"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Formato: "Mês Ano"</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Tema <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                  placeholder="Ex: Magia do Natal"
                  className="mt-1.5 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Categoria</Label>
              <Input
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="box"
                className="mt-1.5 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">Para filtros em produtos</p>
            </div>
          </CardContent>
        </Card>

        {/* 2. Preços e Valores */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              💰 Preços e Valores
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Preço da Box (R$) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="129.90"
                  className="mt-1.5 rounded-lg"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Preço Original (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => handleChange('original_price', e.target.value)}
                  placeholder="180.00"
                  className="mt-1.5 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Para mostrar desconto</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Valor Total Itens (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.total_items_value}
                  onChange={(e) => handleChange('total_items_value', e.target.value)}
                  placeholder="180.00"
                  className="mt-1.5 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Soma dos produtos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Descrições */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              📝 Descrições
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">Descrição Geral</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Celebre o Natal com aromas acolhedores..."
                rows={4}
                className="mt-1.5 rounded-lg"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Dicas de Ritual</Label>
              <Textarea
                value={formData.ritual_tips}
                onChange={(e) => handleChange('ritual_tips', e.target.value)}
                placeholder="Acenda sua vela durante a ceia..."
                rows={3}
                className="mt-1.5 rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* 4. Vela e Aromas */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              🕯️ Vela e Aromas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">Nome da Vela</Label>
              <Input
                value={formData.candle_name}
                onChange={(e) => handleChange('candle_name', e.target.value)}
                placeholder="Ex: Vela Especiarias Natalinas"
                className="mt-1.5 rounded-lg"
              />
            </div>

            <ArrayInput
              label="Notas Aromáticas"
              placeholder="Ex: Canela"
              values={formData.aroma_notes}
              onChange={(values) => handleChange('aroma_notes', values)}
              maxItems={10}
            />
          </CardContent>
        </Card>

        {/* 5. Conteúdo da Box */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              📦 Conteúdo da Box
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <ArrayInput
              label="Itens Incluídos"
              placeholder="Ex: 1 Vela artesanal de soja 180g"
              values={formData.items_included}
              onChange={(values) => handleChange('items_included', values)}
              maxItems={15}
            />

            <ArrayInput
              label="Benefícios Exclusivos"
              placeholder="Ex: Aromas exclusivos de celebração"
              values={formData.benefits}
              onChange={(values) => handleChange('benefits', values)}
              maxItems={10}
            />
          </CardContent>
        </Card>

        {/* 6. Imagens */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              🖼️ Imagens
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">URL da Imagem Principal</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="https://..."
                className="mt-1.5 rounded-lg"
              />
            </div>

            <ImageUploadMultiple
              label="Galeria de Imagens"
              images={formData.images}
              onImagesChange={(images) => handleChange('images', images)}
              maxImages={5}
              maxSizeMB={5}
            />
          </CardContent>
        </Card>

        {/* 7. Experiência */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              🎵 Experiência
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">Link da Playlist Spotify</Label>
              <Input
                value={formData.spotify_playlist}
                onChange={(e) => handleChange('spotify_playlist', e.target.value)}
                placeholder="https://open.spotify.com/playlist/..."
                className="mt-1.5 rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* 8. Estoque */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              📊 Estoque
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">Quantidade em Estoque</Label>
              <Input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => handleChange('stock_quantity', e.target.value)}
                placeholder="50"
                className="mt-1.5 rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* 9. Publicação e Disponibilidade */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              ⚙️ Publicação e Disponibilidade
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-900">Box Publicada</Label>
                <p className="text-xs text-gray-500 mt-1">
                  Se ativado, a box ficará visível no site
                </p>
              </div>
              <Switch
                checked={formData.is_published}
                onCheckedChange={(checked) => handleChange('is_published', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-900">Disponível para Compra Avulsa</Label>
                <p className="text-xs text-gray-500 mt-1">
                  Permitir compra da box fora da assinatura
                </p>
              </div>
              <Switch
                checked={formData.is_available_for_purchase}
                onCheckedChange={(checked) => handleChange('is_available_for_purchase', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/boxes')}
            className="rounded-lg"
            disabled={createMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-[#8B7355] hover:bg-[#6d5940] text-white rounded-lg"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Criar Box
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
