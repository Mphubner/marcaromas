import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Eye,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  User,
  Calendar,
  DollarSign,
  ShoppingCart
} from "lucide-react";
import api from "@/lib/api";

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  paid: { label: "Pago", color: "bg-green-100 text-green-800", icon: CreditCard },
  processing: { label: "Processando", color: "bg-purple-100 text-purple-800", icon: Package },
  shipped: { label: "Enviado", color: "bg-indigo-100 text-indigo-800", icon: Truck },
  delivered: { label: "Entregue", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle },
  canceled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
  refunded: { label: "Reembolsado", color: "bg-orange-100 text-orange-800", icon: DollarSign }
};

const channelIcons = {
  website: <ShoppingCart className="w-4 h-4" />,
  whatsapp: <span className="text-green-600">💬</span>,
  instagram: <span className="text-pink-600">📷</span>,
  marketplace: <span className="text-blue-600">🏪</span>
};

export default function OrdersListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders", { search, status: statusFilter, channel: channelFilter }],
    queryFn: async () => {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (channelFilter) params.channel = channelFilter;

      const { data } = await api.get("/orders", { params });
      return data;
    },
  });

  const getStatusInfo = (status) => statusConfig[status] || statusConfig.pending;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedidos</h1>
        <p className="text-gray-600">Gerencie todos os pedidos da plataforma</p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6 rounded-xl shadow-sm border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por pedido, cliente, tracking..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] bg-white"
          >
            <option value="">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="paid">Pago</option>
            <option value="processing">Processando</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregue</option>
            <option value="canceled">Cancelado</option>
            <option value="refunded">Reembolsado</option>
          </select>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] bg-white"
          >
            <option value="">Todos os Canais</option>
            <option value="website">Website</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="marketplace">Marketplace</option>
          </select>

          <Button
            variant="outline"
            className="rounded-lg"
            onClick={() => { setSearch(""); setStatusFilter(""); setChannelFilter(""); }}
          >
            Limpar
          </Button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""} encontrado{orders.length !== 1 ? "s" : ""}
        </div>
      </Card>

      {/* Orders List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-[#8B7355] border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-12 text-center rounded-xl">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou aguarde novos pedidos</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            const hasAlert = order.status === 'pending' || (order.status === 'shipped' && !order.tracking_code);

            return (
              <Card key={order.id} className="p-6 rounded-xl border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>

                      <Badge className={`${statusInfo.color} rounded-full px-3 py-1 flex items-center gap-1.5 font-medium`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusInfo.label}
                      </Badge>

                      <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                        {channelIcons[order.channel]}
                        <span className="capitalize">{order.channel}</span>
                      </div>

                      {hasAlert && (
                        <Badge className="bg-red-50 text-red-700 rounded-full px-3 py-1 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Atenção
                        </Badge>
                      )}
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <Link
                        to={`/admin/customers/${order.user?.id}`}
                        className="text-gray-700 hover:text-[#8B7355] font-medium"
                      >
                        {order.user?.name || "Cliente"}
                      </Link>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{order.user?.email}</span>
                    </div>

                    {/* Details Row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </div>

                      {order.paymentMethod && (
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4" />
                          <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                          {order.paymentStatus && (
                            <Badge className={`text-xs ${order.paymentStatus === 'approved' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                              {order.paymentStatus}
                            </Badge>
                          )}
                        </div>
                      )}

                      {order.carrier && (
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-4 h-4" />
                          {order.carrier} {order.shippingMethod && `- ${order.shippingMethod}`}
                        </div>
                      )}

                      {order.tracking_code && (
                        <div className="flex items-center gap-1.5 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {order.tracking_code}
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'itens'}
                      </div>
                    </div>
                  </div>

                  {/* Right: Total & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        R$ {order.total.toFixed(2)}
                      </div>
                      {order.shippingCost > 0 && (
                        <div className="text-xs text-gray-500">
                          Frete: R$ {order.shippingCost.toFixed(2)}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/admin/orders/${order.id}`}>
                        <Button size="sm" variant="outline" className="rounded-lg">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalhes
                        </Button>
                      </Link>

                      {order.labelUrl && (
                        <Button size="sm" variant="outline" className="rounded-lg" asChild>
                          <a href={order.labelUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
