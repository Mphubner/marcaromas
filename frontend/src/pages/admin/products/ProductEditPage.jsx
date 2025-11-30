import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { adminService } from '@/services/adminService';
import ArrayInput from '@/components/admin/ArrayInput';
import ImageUploadMultiple from '@/components/admin/ImageUploadMultiple';

function slugify(text) {
  return text?.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || '';
}

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => api.get('/products/categories').then(r => r.data)
  });

  useEffect(() => {
    (async () => {
      try {
        const product = await adminService.getProductById(id);
        setFormData({
          ...product,
          tags: product.tags || [],
          aroma_notes: product.aroma_notes || [],
          ingredients: product.ingredients || [],
          price: product.price || '',
          compare_at_price: product.compare_at_price || '',
          stock_quantity: product.stock_quantity || '',
          weight: product.weight || '',
          length: product.length || '',
          width: product.width || '',
          height: product.height || '',
        });
      } catch (err) {
        toast.error('Erro ao carregar produto');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return await adminService.updateProduct(id, data);
    },
    onSuccess: () => {
      toast.success('Produto atualizado com sucesso!');
      queryClient.invalidateQueries(['admin-products']);
      navigate('/admin/products');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar produto');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      toast.success('Produto deletado com sucesso!');
      queryClient.invalidateQueries(['admin-products']);
      navigate('/admin/products');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao deletar produto');
    }
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Slug é obrigatório');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Preço deve ser maior que zero');
      return;
    }

    const dataToSend = {
      ...formData,
      price: parseFloat(formData.price),
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : undefined,
      stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : 0,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      length: formData.length ? parseFloat(formData.length) : undefined,
      width: formData.width ? parseFloat(formData.width) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
    };

    updateMutation.mutate(dataToSend);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.')) {
      deleteMutation.mutate();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B7355]" />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Produto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/products')}
            className="rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-[#2C2419]">Editar Produto</h2>
            <p className="text-gray-600 mt-1">{formData.name}</p>
          </div>
        </div>

        <Button
          variant="destructive"
          onClick={handleDelete}
          className="rounded-lg"
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Deletar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Informações Básicas */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              📋 Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Nome do Produto <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ex: Vela Aromática Lavanda"
                  className="mt-1.5 rounded-lg"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="vela-aromatica-lavanda"
                  className="mt-1.5 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">SKU</Label>
                <Input
                  value={formData.sku || ''}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  placeholder="VELA-LAV-001"
                  className="mt-1.5 rounded-lg"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Barcode</Label>
                <Input
                  value={formData.barcode || ''}
                  onChange={(e) => handleChange('barcode', e.target.value)}
                  placeholder="7891234567890"
                  className="mt-1.5 rounded-lg"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Categoria</Label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full mt-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">Tipo de Produto</Label>
                <Input
                  value={formData.product_type || ''}
                  onChange={(e) => handleChange('product_type', e.target.value)}
                  placeholder="Vela, Difusor, etc"
                  className="mt-1.5 rounded-lg"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Fornecedor</Label>
                <Input
                  value={formData.vendor || ''}
                  onChange={(e) => handleChange('vendor', e.target.value)}
                  placeholder="Nome do fornecedor"
                  className="mt-1.5 rounded-lg"
                />
              </div>
            </div>

            <ArrayInput
              label="Tags"
              placeholder="lavanda, relaxante, aroma"
              values={formData.tags}
              onChange={(values) => handleChange('tags', values)}
              maxItems={10}
            />
          </CardContent>
        </Card>

        {/* 2. Preços e Estoque */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              💰 Preços e Estoque
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Preço (R$) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="89.90"
                  className="mt-1.5 rounded-lg"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Preço Promocional (R$)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.compare_at_price}
                  onChange={(e) => handleChange('compare_at_price', e.target.value)}
                  placeholder="120.00"
                  className="mt-1.5 rounded-lg"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Quantidade em Estoque
                </Label>
                <Input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleChange('stock_quantity', e.target.value)}
                  placeholder="50"
                  className="mt-1.5 rounded-lg"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Política de Inventário</Label>
              <select
                value={formData.inventory_policy || ''}
                onChange={(e) => handleChange('inventory_policy', e.target.value)}
                className="w-full mt-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
              >
                <option value="">Padrão</option>
                <option value="deny">deny - Bloquear venda sem estoque</option>
                <option value="continue">continue - Permitir venda sem estoque</option>
              </select>
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
              <Label className="text-sm font-medium text-gray-700">Descrição Curta</Label>
              <Textarea
                value={formData.short_description || ''}
                onChange={(e) => handleChange('short_description', e.target.value)}
                placeholder="Breve descrição do produto..."
                rows={3}
                className="mt-1.5 rounded-lg"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Descrição Completa</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descrição detalhada do produto..."
                rows={6}
                className="mt-1.5 rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* 4. Imagens */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              🖼️ Imagens
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ImageUploadMultiple
              label="Galeria de Imagens"
              images={formData.images || []}
              onImagesChange={(images) => handleChange('images', images)}
              maxImages={10}
              maxSizeMB={5}
            />
          </CardContent>
        </Card>

        {/* 5. Detalhes do Produto */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              🕯️ Detalhes do Produto
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">Família Aromática</Label>
                <Input
                  value={formData.aroma_family || ''}
                  onChange={(e) => handleChange('aroma_family', e.target.value)}
                  placeholder="Ex: Floral, Cítrico"
                  className="mt-1.5 rounded-lg"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Tamanho</Label>
                <Input
                  value={formData.size || ''}
                  onChange={(e) => handleChange('size', e.target.value)}
                  placeholder="Ex: 180g"
                  className="mt-1.5 rounded-lg"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Tempo de Queima</Label>
              <Input
                value={formData.burn_time || ''}
                onChange={(e) => handleChange('burn_time', e.target.value)}
                placeholder="Ex: 35-40 horas"
                className="mt-1.5 rounded-lg"
              />
            </div>

            <ArrayInput
              label="Notas Aromáticas"
              placeholder="Ex: Lavanda, Bergamota"
              values={formData.aroma_notes}
              onChange={(values) => handleChange('aroma_notes', values)}
              maxItems={10}
            />

            <ArrayInput
              label="Ingredientes"
              placeholder="Ex: Cera de soja"
              values={formData.ingredients}
              onChange={(values) => handleChange('ingredients', values)}
              maxItems={15}
            />
          </CardContent>
        </Card>

        {/* 6. Dimensões e Peso */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              📦 Dimensões e Peso
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">Peso (kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  placeholder="0.18"
                  className="mt-1.5 rounded-lg"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Comprimento (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.length}
                  onChange={(e) => handleChange('length', e.target.value)}
                  placeholder="10.0"
                  className="mt-1.5 rounded-lg"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Largura (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.width}
                  onChange={(e) => handleChange('width', e.target.value)}
                  placeholder="10.0"
                  className="mt-1.5 rounded-lg"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Altura (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  placeholder="8.0"
                  className="mt-1.5 rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7. SEO */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              🔍 SEO e Otimização
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">Título SEO</Label>
              <Input
                value={formData.seo_title || ''}
                onChange={(e) => handleChange('seo_title', e.target.value)}
                placeholder="Título otimizado para buscadores"
                className="mt-1.5 rounded-lg"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Descrição SEO</Label>
              <Textarea
                value={formData.seo_description || ''}
                onChange={(e) => handleChange('seo_description', e.target.value)}
                placeholder="Descrição para resultados de busca"
                rows={3}
                className="mt-1.5 rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* 8. Disponibilidade */}
        <Card className="rounded-xl border-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-[#2C2419]">
              ⚙️ Disponibilidade e Publicação
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-900">Produto Disponível</Label>
                <p className="text-xs text-gray-500 mt-1">
                  Se ativado, o produto ficará visível na loja
                </p>
              </div>
              <Switch
                checked={formData.is_available}
                onCheckedChange={(checked) => handleChange('is_available', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-900">Produto em Destaque</Label>
                <p className="text-xs text-gray-500 mt-1">
                  Destacar na página inicial
                </p>
              </div>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleChange('is_featured', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
            className="rounded-lg"
            disabled={updateMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-[#8B7355] hover:bg-[#6d5940] text-white rounded-lg"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
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
