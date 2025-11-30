import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Calendar,
  DollarSign,
  Package,
  Check,
  Sparkles,
  Music,
  Heart,
  ShoppingCart,
  Eye,
  Flame
} from 'lucide-react';
import api from '@/lib/api';

export default function BoxDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: box, isLoading } = useQuery({
    queryKey: ['admin-box-detail', id],
    queryFn: async () => {
      const { data } = await api.get(`/boxes/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <p className="text-center text-gray-500">Carregando detalhes da box...</p>
      </div>
    );
  }

  if (!box) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <Card className="rounded-xl border-2">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Box não encontrada</h3>
            <p className="text-gray-600 mb-6">Esta box não existe ou foi removida.</p>
            <Button onClick={() => navigate('/admin/boxes')} className="rounded-lg">
              Voltar para Boxes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
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
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-[#2C2419]">{box.theme}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{box.month}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={box.is_published ? 'default' : 'secondary'} className="rounded-md">
            {box.is_published ? 'Publicada' : 'Rascunho'}
          </Badge>
          {box.is_available_for_purchase && (
            <Badge variant="outline" className="rounded-md border-green-500 text-green-700">
              <ShoppingCart className="w-3 h-3 mr-1" />
              À Venda
            </Badge>
          )}
        </div>
        <Link to={`/admin/boxes/${box.id}/edit`}>
          <Button className="bg-[#8B7355] hover:bg-[#6d5940] text-white rounded-lg">
            <Edit className="w-4 h-4 mr-2" />
            Editar Box
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Descrição */}
          <Card className="rounded-xl border-2">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg font-semibold text-[#2C2419]">
                📝 Descrição
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed">
                {box.description || 'Sem descrição'}
              </p>
            </CardContent>
          </Card>

          {/* Vela e Aromas */}
          <Card className="rounded-xl border-2">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg font-semibold text-[#2C2419] flex items-center">
                <Flame className="w-5 h-5 mr-2 text-orange-500" />
                Vela e Aromas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Nome da Vela:</p>
                <p className="text-lg text-gray-900">{box.candle_name || 'Não especificado'}</p>
              </div>
              {box.aroma_notes && box.aroma_notes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Notas Aromáticas:</p>
                  <div className="flex flex-wrap gap-2">
                    {box.aroma_notes.map((note, i) => (
                      <Badge key={i} variant="outline" className="rounded-full">
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Itens Incluídos */}
          {box.items_included && box.items_included.length > 0 && (
            <Card className="rounded-xl border-2">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg font-semibold text-[#2C2419] flex items-center">
                  <Package className="w-5 h-5 mr-2 text-[#8B7355]" />
                  O que você recebe ({box.items_included.length} itens)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {box.items_included.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Benefícios */}
          {box.benefits && box.benefits.length > 0 && (
            <Card className="rounded-xl border-2">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg font-semibold text-[#2C2419] flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                  Benefícios Exclusivos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {box.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <Heart className="w-5 h-5 text-pink-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Ritual Tips */}
          {box.ritual_tips && (
            <Card className="rounded-xl border-2 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="border-b bg-white/50">
                <CardTitle className="text-lg font-semibold text-[#2C2419]">
                  ✨ Dicas de Ritual
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed italic">
                  {box.ritual_tips}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Spotify Playlist */}
          {box.spotify_playlist && (
            <Card className="rounded-xl border-2">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg font-semibold text-[#2C2419] flex items-center">
                  <Music className="w-5 h-5 mr-2 text-green-600" />
                  Playlist Spotify
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <a
                  href={box.spotify_playlist}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8B7355] hover:underline flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Abrir Playlist
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Imagem Principal */}
          {box.image_url && (
            <Card className="rounded-xl border-2 overflow-hidden">
              <img
                src={box.image_url}
                alt={box.theme}
                className="w-full h-64 object-cover"
              />
            </Card>
          )}

          {/* Galeria */}
          {box.images && box.images.length > 0 && (
            <Card className="rounded-xl border-2">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-sm font-semibold text-[#2C2419]">
                  Galeria ({box.images.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {box.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${box.theme} ${i + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Valores */}
          <Card className="rounded-xl border-2 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="text-sm font-semibold text-[#2C2419]">
                💰 Valores
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Valor Total Itens:
                </span>
                <span className="font-semibold text-gray-900">
                  R$ {box.total_items_value?.toFixed(2) || '0,00'}
                </span>
              </div>

              {box.original_price && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Preço Original:</span>
                  <span className="text-gray-500 line-through">
                    R$ {box.original_price.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Preço Box:
                </span>
                <span className="text-2xl font-bold text-[#8B7355]">
                  R$ {box.price?.toFixed(2) || '0,00'}
                </span>
              </div>

              {box.original_price && box.original_price > box.price && (
                <div className="text-center pt-2">
                  <Badge className="bg-green-100 text-green-800">
                    💰 Economia: R$ {(box.original_price - box.price).toFixed(2)}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estoque e Disponibilidade */}
          <Card className="rounded-xl border-2">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-sm font-semibold text-[#2C2419]">
                📊 Estoque e Disponibilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Categoria:</span>
                <Badge variant="outline" className="rounded-md">
                  {box.category || 'box'}
                </Badge>
              </div>

              {box.stock_quantity !== null && box.stock_quantity !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estoque:</span>
                  <span className={`font-semibold ${box.stock_quantity > 20 ? 'text-green-600' :
                      box.stock_quantity > 5 ? 'text-yellow-600' :
                        'text-red-600'
                    }`}>
                    {box.stock_quantity} unidades
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Disponível p/ Compra:</span>
                <Badge variant={box.is_available_for_purchase ? 'default' : 'secondary'}>
                  {box.is_available_for_purchase ? 'Sim' : 'Não'}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={box.is_published ? 'default' : 'secondary'}>
                  {box.is_published ? 'Publicada' : 'Rascunho'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Info Técnica */}
          <Card className="rounded-xl border-2">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-sm font-semibold text-[#2C2419]">
                ℹ️ Informações Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="text-gray-900 font-mono">#{box.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Criado em:</span>
                <span className="text-gray-900">
                  {new Date(box.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
