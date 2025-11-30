import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import api from '../../lib/api';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus, Edit, Package, Search, Filter, MoreVertical, Trash2,
  Eye, EyeOff, Star, TrendingUp, AlertCircle, CheckCircle2
} from "lucide-react";
import { toast } from 'sonner';

export default function ProductListPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // all | available | unavailable
  const [featuredFilter, setFeaturedFilter] = useState(''); // all | featured | not-featured
  const [selected, setSelected] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: adminService.getAllProducts
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => api.get('/products/categories').then(r => r.data)
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (statusFilter === 'available' && !p.is_available) return false;
      if (statusFilter === 'unavailable' && p.is_available) return false;
      if (featuredFilter === 'featured' && !p.is_featured) return false;
      if (featuredFilter === 'not-featured' && p.is_featured) return false;
      return true;
    });
  }, [products, search, categoryFilter, statusFilter, featuredFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: products.length,
      available: products.filter(p => p.is_available).length,
      featured: products.filter(p => p.is_featured).length,
      lowStock: products.filter(p => p.stock_quantity < 10).length,
    };
  }, [products]);

  // Bulk operations
  const bulkDeleteMutation = useMutation({
    mutationFn: (productIds) => api.post('/products/bulk/delete', { productIds }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      setSelected(new Set());
      toast.success('Produtos deletados com sucesso');
    },
    onError: () => toast.error('Erro ao deletar produtos'),
  });

  const bulkUpdateAvailabilityMutation = useMutation({
    mutationFn: ({ productIds, is_available }) =>
      api.post('/products/bulk/availability', { productIds, is_available }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      setSelected(new Set());
      toast.success('Produtos atualizados');
    },
    onError: () => toast.error('Erro ao atualizar produtos'),
  });

  const bulkUpdateFeaturedMutation = useMutation({
    mutationFn: ({ productIds, is_featured }) =>
      api.post('/products/bulk/featured', { productIds, is_featured }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      setSelected(new Set());
      toast.success('Produtos atualizados');
    },
    onError: () => toast.error('Erro ao atualizar produtos'),
  });

  const handleSelectAll = () => {
    if (selected.size === filteredProducts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleSelect = (id) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleBulkDelete = () => {
    if (!window.confirm(`Deletar ${selected.size} produtos?`)) return;
    bulkDeleteMutation.mutate(Array.from(selected));
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Produtos</h2>
          <p className="text-gray-500 mt-1">Gerencie seu catálogo de produtos</p>
        </div>
        <Link to="/admin/products/create">
          <Button className="bg-[#8B7355] hover:bg-[#7A6548] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Produtos</div>
                <div className="text-2xl font-bold">{stats.total}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Disponíveis</div>
                <div className="text-2xl font-bold">{stats.available}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Em Destaque</div>
                <div className="text-2xl font-bold">{stats.featured}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Estoque Baixo</div>
                <div className="text-2xl font-bold">{stats.lowStock}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Bulk Actions */}
      <Card>
        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-[#8B7355] text-white' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>

            {selected.size > 0 && (
              <div className="flex gap-2 ml-auto">
                <Badge variant="secondary" className="px-3 py-1">
                  {selected.size} selecionados
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkUpdateAvailabilityMutation.mutate({
                    productIds: Array.from(selected),
                    is_available: true
                  })}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Disponível
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkUpdateAvailabilityMutation.mutate({
                    productIds: Array.from(selected),
                    is_available: false
                  })}
                >
                  <EyeOff className="w-3 h-3 mr-1" />
                  Indisponível
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkUpdateFeaturedMutation.mutate({
                    productIds: Array.from(selected),
                    is_featured: true
                  })}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Destacar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Deletar
                </Button>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Categoria</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Todas</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Disponibilidade</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="available">Disponível</option>
                  <option value="unavailable">Indisponível</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Destaque</label>
                <select
                  value={featuredFilter}
                  onChange={(e) => setFeaturedFilter(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="featured">Em destaque</option>
                  <option value="not-featured">Não destacado</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent" />
        </div>
      ) : (
        <>
          {filteredProducts.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Checkbox
                checked={selected.size === filteredProducts.length}
                onCheckedChange={handleSelectAll}
              />
              <span>Selecionar todos ({filteredProducts.length})</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] rounded-xl overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100">
                    <Checkbox
                      className="absolute top-2 left-2 z-10 bg-white"
                      checked={selected.has(product.id)}
                      onCheckedChange={() => handleSelect(product.id)}
                    />
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    {product.is_featured && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1.5 rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    )}
                    {!product.is_available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary">Indisponível</Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm flex-1">
                        {product.name}
                      </h3>
                    </div>

                    {product.category && (
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    )}

                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[#8B7355]">
                        R$ {product.price.toFixed(2)}
                      </span>
                      {product.compare_at_price && product.compare_at_price > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          R$ {product.compare_at_price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Package className="w-3 h-3" />
                      <span>Estoque: {product.stock_quantity}</span>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t flex gap-2">
                      <Link to={`/admin/products/${product.id}/edit`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card className="p-12">
              <div className="text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">Nenhum produto encontrado</p>
                <p className="text-sm mt-1">Ajuste os filtros ou crie um novo produto</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
