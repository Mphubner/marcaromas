import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Box,
  Edit,
  Eye,
  Package,
  Check,
  DollarSign,
  Calendar,
  ShoppingCart,
  Sparkles
} from 'lucide-react';
import api from '@/lib/api';

export default function BoxesListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: boxes = [], isLoading } = useQuery({
    queryKey: ['admin-boxes', { search, status: statusFilter }],
    queryFn: async () => {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const { data } = await api.get('/boxes/admin', { params });
      return Array.isArray(data) ? data : [];
    },
  });

  const filteredBoxes = boxes.filter(box => {
    const matchesSearch = !search ||
      box.theme?.toLowerCase().includes(search.toLowerCase()) ||
      box.month?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter ||
      (statusFilter === 'published' && box.is_published) ||
      (statusFilter === 'draft' && !box.is_published) ||
      (statusFilter === 'available' && box.is_available_for_purchase) ||
      (statusFilter === 'unavailable' && !box.is_available_for_purchase);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C2419]">Boxes Mensais</h2>
          <p className="text-gray-600 mt-1">Gerencie as boxes de assinatura mensal</p>
        </div>
        <Link to="/admin/boxes/new">
          <Button className="bg-[#8B7355] hover:bg-[#6d5940] text-white rounded-lg">
            <Package className="w-4 h-4 mr-2" />
            Criar Nova Box
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6 rounded-xl border-2">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Buscar por tema ou mês..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
            >
              <option value="">Todos os Status</option>
              <option value="published">Publicado</option>
              <option value="draft">Rascunho</option>
              <option value="available">Disponível p/ Compra</option>
              <option value="unavailable">Indisponível</option>
            </select>

            {(search || statusFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                }}
                className="rounded-lg"
              >
                Limpar Filtros
              </Button>
            )}

            <div className="ml-auto text-sm text-gray-600">
              {filteredBoxes.length} box{filteredBoxes.length !== 1 ? 'es' : ''} encontrada{filteredBoxes.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando boxes...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredBoxes.length === 0 && (
        <Card className="rounded-xl border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {boxes.length === 0 ? 'Nenhuma box cadastrada' : 'Nenhuma box encontrada'}
            </h3>
            <p className="text-gray-600 mb-6">
              {boxes.length === 0
                ? 'Comece criando sua primeira box mensal'
                : 'Tente ajustar os filtros de busca'
              }
            </p>
            {boxes.length === 0 && (
              <Link to="/admin/boxes/new">
                <Button className="bg-[#8B7355] hover:bg-[#6d5940] text-white rounded-lg">
                  <Package className="w-4 h-4 mr-2" />
                  Criar Primeira Box
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Boxes Grid */}
      {!isLoading && filteredBoxes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoxes.map((box) => (
            <Card
              key={box.id}
              className="rounded-xl border-2 hover:shadow-lg transition-all duration-200"
            >
              <CardHeader className="bg-gray-50 border-b rounded-t-xl">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-[#2C2419] mb-1">
                      {box.theme}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{box.month}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge
                      variant={box.is_published ? 'default' : 'secondary'}
                      className="rounded-md"
                    >
                      {box.is_published ? 'Publicada' : 'Rascunho'}
                    </Badge>
                    {box.is_available_for_purchase && (
                      <Badge variant="outline" className="rounded-md border-green-500 text-green-700">
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        À Venda
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Imagem */}
                {box.image_url && (
                  <img
                    src={box.image_url}
                    alt={box.theme}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Comparativo de Valores */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Valor Total Itens:
                    </span>
                    <span className="font-semibold text-gray-900">
                      R$ {box.total_items_value?.toFixed(2) || '0,00'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Preço Box:
                    </span>
                    <span className="text-lg font-bold text-[#8B7355]">
                      R$ {box.price?.toFixed(2) || '0,00'}
                    </span>
                  </div>
                  {box.original_price && box.original_price > box.price && (
                    <div className="mt-2 text-center">
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Economia: R$ {(box.original_price - box.price).toFixed(2)}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Vela */}
                {box.candle_name && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700">🕯️ Vela:</p>
                    <p className="text-sm text-gray-900">{box.candle_name}</p>
                  </div>
                )}

                {/* Itens Incluídos */}
                {box.items_included && box.items_included.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Itens Incluídos ({box.items_included.length}):
                    </p>
                    <div className="space-y-1">
                      {box.items_included.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-start text-xs text-gray-600">
                          <Check className="w-3 h-3 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                      {box.items_included.length > 2 && (
                        <span className="text-xs text-gray-400 ml-5">
                          +{box.items_included.length - 2} mais itens
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Estoque */}
                {box.stock_quantity !== null && box.stock_quantity !== undefined && (
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estoque:</span>
                    <span className={`font-semibold ${box.stock_quantity > 20 ? 'text-green-600' :
                        box.stock_quantity > 5 ? 'text-yellow-600' :
                          'text-red-600'
                      }`}>
                      {box.stock_quantity} unidades
                    </span>
                  </div>
                )}

                {/* Ações */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Link to={`/admin/boxes/${box.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-lg hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Link to={`/admin/boxes/${box.id}/edit`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-lg hover:bg-[#8B7355] hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
