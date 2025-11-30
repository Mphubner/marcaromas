import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package, Search, Filter, Download, Truck, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Premium Client Components
import {
  ClientPageHeader,
  ClientCard,
  ClientButton,
  ClientEmptyState,
  ClientBadge,
  getStatusBadge
} from "@/components/client";

// UI Components
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Services
import { orderService } from "../services/orderService";
import { useAuth } from "../context/AuthContext";

export default function MinhasCompras() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: orderService.getMyOrders,
    enabled: !!user,
  });

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientPageHeader
          title="Minhas Compras"
          subtitle="Acompanhe o histórico e status dos seus pedidos"
          backTo="/dashboard"
        />

        {orders.length === 0 ? (
          <ClientEmptyState
            icon={Package}
            title="Nenhuma compra ainda"
            message="Você ainda não fez pedidos. Explore nossa loja e encontre produtos incríveis!"
            actionLabel="Ir para Loja"
            onAction={() => navigate('/loja')}
          />
        ) : (
          <>
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row gap-4 mb-8"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por número do pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-2xl border-gray-300"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-64 rounded-2xl">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="PENDING_PAYMENT">Pagamento Pendente</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                  <SelectItem value="SHIPPED">Enviado</SelectItem>
                  <SelectItem value="DELIVERED">Entregue</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Results Count */}
            <p className="text-sm text-gray-600 mb-4">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
            </p>

            {/* Orders List */}
            <div className="space-y-6">
              {filteredOrders.map((order, index) => {
                const statusInfo = getStatusBadge(order.status);

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ClientCard hoverable>
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-[#2C2419]">
                              Pedido #{order.orderNumber || order.id}
                            </h3>
                            <ClientBadge variant={statusInfo.variant}>
                              {statusInfo.label}
                            </ClientBadge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {format(new Date(order.createdAt), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>

                        <div className="flex gap-2 mt-4 md:mt-0">
                          {order.status === 'SHIPPED' || order.status === 'DELIVERED' ? (
                            <ClientButton
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/pedido/${order.id}/rastrear`)}
                            >
                              <Truck className="w-4 h-4 mr-2" />
                              Rastrear
                            </ClientButton>
                          ) : null}

                          <ClientButton
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/pedido/${order.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </ClientButton>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items?.map(item => (
                          <div key={item.id} className="flex items-center gap-4">
                            {/* Product Image */}
                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={item.product?.images?.[0] || item.product?.image}
                                alt={item.product?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#2C2419] truncate">
                                {item.product?.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantidade: {item.quantity}
                              </p>
                            </div>

                            {/* Price */}
                            <p className="font-bold text-[#8B7355] text-lg whitespace-nowrap">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Total */}
                      <div className="border-t mt-4 pt-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {order.paymentMethod && (
                            <span>Pagamento: {order.paymentMethod}</span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Total do Pedido</p>
                          <p className="font-bold text-2xl text-[#2C2419] font-['Playfair_Display']">
                            R$ {order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </ClientCard>
                  </motion.div>
                );
              })}
            </div>

            {filteredOrders.length === 0 && searchTerm && (
              <ClientEmptyState
                icon={Search}
                title="Nenhum pedido encontrado"
                message={`Não encontramos pedidos com "${searchTerm}". Tente outro termo de busca.`}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
