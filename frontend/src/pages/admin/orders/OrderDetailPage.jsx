import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  User,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  FileText,
  Edit,
  Mail,
  Phone,
  ShoppingBag
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
  paid: { label: "Pago", color: "bg-green-100 text-green-800 border-green-200", icon: CreditCard },
  processing: { label: "Processando", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Package },
  shipped: { label: "Enviado", color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: Truck },
  delivered: { label: "Entregue", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle },
  canceled: { label: "Cancelado", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  refunded: { label: "Reembolsado", color: "bg-orange-100 text-orange-800 border-orange-200", icon: DollarSign }
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [statusModal, setStatusModal] = useState(false);
  const [trackingModal, setTrackingModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [refundModal, setRefundModal] = useState(false);

  const [newStatus, setNewStatus] = useState("");
  const [trackingData, setTrackingData] = useState({ carrier: "", shippingMethod: "", tracking_code: "" });
  const [cancelReason, setCancelReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  const { data: order, isLoading } = useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${orderId}`);
      return data;
    },
    enabled: !!orderId,
  });

  // Update Status
  const updateStatusMutation = useMutation({
    mutationFn: async (data) => {
      await api.patch(`/orders/${orderId}/status`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["order-detail", orderId]);
      toast.success("Status atualizado com sucesso!");
      setStatusModal(false);
    },
    onError: () => {
      toast.error("Erro ao atualizar status");
    }
  });

  // Update Tracking
  const updateTrackingMutation = useMutation({
    mutationFn: async (data) => {
      await api.patch(`/orders/${orderId}/shipping`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["order-detail", orderId]);
      toast.success("Informações de envio atualizadas!");
      setTrackingModal(false);
    },
    onError: () => {
      toast.error("Erro ao atualizar tracking");
    }
  });

  // Generate Label
  const generateLabelMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/orders/${orderId}/label`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["order-detail", orderId]);
      toast.success("Etiqueta gerada com sucesso!");
      if (data.labelUrl) {
        window.open(data.labelUrl, '_blank');
      }
    },
    onError: () => {
      toast.error("Erro ao gerar etiqueta");
    }
  });

  // Cancel Order
  const cancelOrderMutation = useMutation({
    mutationFn: async (reason) => {
      await api.post(`/orders/${orderId}/cancel`, { cancellationReason: reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["order-detail", orderId]);
      toast.success("Pedido cancelado");
      setCancelModal(false);
    },
    onError: () => {
      toast.error("Erro ao cancelar pedido");
    }
  });

  // Refund Order
  const refundOrderMutation = useMutation({
    mutationFn: async (amount) => {
      await api.post(`/orders/${orderId}/refund`, { refundAmount: parseFloat(amount) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["order-detail", orderId]);
      toast.success("Reembolso processado!");
      setRefundModal(false);
    },
    onError: () => {
      toast.error("Erro ao processar reembolso");
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-[#8B7355] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pedido não encontrado</h2>
        <Button onClick={() => navigate("/admin/orders")}>Voltar para pedidos</Button>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/orders")}
          className="mb-4 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Pedidos
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{order.orderNumber}</h1>
            <div className="flex items-center gap-3">
              <Badge className={`${statusInfo.color} border px-4 py-1.5 rounded-full flex items-center gap-2 font-medium`}>
                <StatusIcon className="w-4 h-4" />
                {statusInfo.label}
              </Badge>
              <span className="text-gray-600 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(order.createdAt).toLocaleString('pt-BR')}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              R$ {order.total.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Valor total</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column - Customer, Products, Addresses, Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card className="p-6 rounded-xl border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#8B7355]" />
              Informações do Cliente
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{order.user?.name || "Cliente"}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {order.user?.email}
                  </div>
                </div>
                <Link to={`/admin/customers/${order.user?.id}`}>
                  <Button size="sm" variant="outline" className="rounded-lg">
                    Ver Perfil
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Products */}
          <Card className="p-6 rounded-xl border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8B7355]" />
              Produtos ({order.items?.length || 0})
            </h2>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  {item.product?.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.product?.name || "Produto"}</div>
                    <div className="text-sm text-gray-600">
                      Quantidade: {item.quantity} × R$ {item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-bold text-gray-900">
                    R$ {(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>R$ {order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>- R$ {order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Frete</span>
                <span>R$ {order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
                <span>Total</span>
                <span>R$ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Addresses */}
          {(order.deliveryAddress || order.billingAddress) && (
            <Card className="p-6 rounded-xl border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {order.deliveryAddress && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#8B7355]" />
                      Endereço de Entrega
                    </h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>{order.deliveryAddress.name}</div>
                      <div>{order.deliveryAddress.street}, {order.deliveryAddress.number}</div>
                      {order.deliveryAddress.complement && <div>{order.deliveryAddress.complement}</div>}
                      <div>{order.deliveryAddress.neighborhood}</div>
                      <div>{order.deliveryAddress.city} - {order.deliveryAddress.state}</div>
                      <div>CEP: {order.deliveryAddress.zipCode}</div>
                      {order.deliveryAddress.phone && <div>Tel: {order.deliveryAddress.phone}</div>}
                    </div>
                  </div>
                )}

                {order.billingAddress && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#8B7355]" />
                      Endereço de Cobrança
                    </h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>{order.billingAddress.name}</div>
                      <div>{order.billingAddress.street}, {order.billingAddress.number}</div>
                      {order.billingAddress.complement && <div>{order.billingAddress.complement}</div>}
                      <div>{order.billingAddress.neighborhood}</div>
                      <div>{order.billingAddress.city} - {order.billingAddress.state}</div>
                      <div>CEP: {order.billingAddress.zipCode}</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card className="p-6 rounded-xl border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#8B7355]" />
              Histórico do Pedido
            </h2>
            <div className="space-y-4">
              {order.history && order.history.length > 0 ? (
                order.history.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-[#8B7355]' : 'bg-gray-300'}`}></div>
                      {index < order.history.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{event.description}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {new Date(event.createdAt).toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {event.eventStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Sem histórico de eventos</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Info */}
          <Card className="p-6 rounded-xl border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#8B7355]" />
              Pagamento
            </h3>
            <div className="space-y-3 text-sm">
              {order.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Método:</span>
                  <span className="font-semibold capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                </div>
              )}
              {order.paymentStatus && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={order.paymentStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              )}
              {order.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Pago em:</span>
                  <span className="font-semibold">{new Date(order.paidAt).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              {order.couponCode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cupom:</span>
                  <span className="font-semibold font-mono">{order.couponCode}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Shipping Info */}
          <Card className="p-6 rounded-xl border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#8B7355]" />
              Envio
            </h3>
            <div className="space-y-3 text-sm">
              {order.carrier && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transportadora:</span>
                  <span className="font-semibold">{order.carrier}</span>
                </div>
              )}
              {order.shippingMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Método:</span>
                  <span className="font-semibold">{order.shippingMethod}</span>
                </div>
              )}
              {order.tracking_code && (
                <div>
                  <span className="text-gray-600 block mb-1">Tracking:</span>
                  <code className="block bg-gray-100 p-2 rounded text-xs font-mono break-all">
                    {order.tracking_code}
                  </code>
                </div>
              )}
              {order.shippedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Enviado em:</span>
                  <span className="font-semibold">{new Date(order.shippedAt).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              {order.estimatedDeliveryDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Previsão:</span>
                  <span className="font-semibold">{new Date(order.estimatedDeliveryDate).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Entregue em:</span>
                  <span className="font-semibold">{new Date(order.deliveredAt).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              {order.labelUrl && (
                <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                  <a href={order.labelUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-4 h-4 mr-2" />
                    Ver Etiqueta
                  </a>
                </Button>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 rounded-xl border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
                onClick={() => setStatusModal(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Atualizar Status
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
                onClick={() => setTrackingModal(true)}
              >
                <Truck className="w-4 h-4 mr-2" />
                Adicionar Tracking
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
                onClick={() => generateLabelMutation.mutate()}
                disabled={generateLabelMutation.isLoading}
              >
                <FileText className="w-4 h-4 mr-2" />
                {generateLabelMutation.isLoading ? "Gerando..." : "Gerar Etiqueta"}
              </Button>
              {order.status !== 'canceled' && order.status !== 'refunded' && (
                <>
                  <Button
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    variant="outline"
                    size="sm"
                    onClick={() => setCancelModal(true)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancelar Pedido
                  </Button>
                  <Button
                    className="w-full justify-start text-orange-600 hover:text-orange-700"
                    variant="outline"
                    size="sm"
                    onClick={() => setRefundModal(true)}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Processar Reembolso
                  </Button>
                </>
              )}
            </div>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card className="p-6 rounded-xl border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Observações Internas</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.notes}</p>
            </Card>
          )}

          {order.customerNotes && (
            <Card className="p-6 rounded-xl border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Observações do Cliente</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.customerNotes}</p>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      {/* Status Update Modal */}
      <Dialog open={statusModal} onOpenChange={setStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Status do Pedido</DialogTitle>
            <DialogDescription>Altere o status atual do pedido</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Novo Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Selecione...</option>
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmado</option>
                <option value="paid">Pago</option>
                <option value="processing">Processando</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregue</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusModal(false)}>Cancelar</Button>
            <Button
              onClick={() => updateStatusMutation.mutate({ status: newStatus })}
              disabled={!newStatus || updateStatusMutation.isLoading}
            >
              {updateStatusMutation.isLoading ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tracking Modal */}
      <Dialog open={trackingModal} onOpenChange={setTrackingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Informações de Envio</DialogTitle>
            <DialogDescription>Configure o rastreamento e transportadora</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Transportadora</label>
              <Input
                value={trackingData.carrier}
                onChange={(e) => setTrackingData({ ...trackingData, carrier: e.target.value })}
                placeholder="Ex: Correios"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Método de Envio</label>
              <Input
                value={trackingData.shippingMethod}
                onChange={(e) => setTrackingData({ ...trackingData, shippingMethod: e.target.value })}
                placeholder="Ex: SEDEX"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Código de Rastreio</label>
              <Input
                value={trackingData.tracking_code}
                onChange={(e) => setTrackingData({ ...trackingData, tracking_code: e.target.value })}
                placeholder="Ex: BR123456789BR"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTrackingModal(false)}>Cancelar</Button>
            <Button
              onClick={() => updateTrackingMutation.mutate(trackingData)}
              disabled={!trackingData.tracking_code || updateTrackingMutation.isLoading}
            >
              {updateTrackingMutation.isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Modal */}
      <Dialog open={cancelModal} onOpenChange={setCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Pedido</DialogTitle>
            <DialogDescription>Esta ação cancelará o pedido</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">Tem certeza que deseja cancelar este pedido?</p>
            <div>
              <label className="text-sm font-medium mb-2 block">Motivo do Cancelamento</label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Descreva o motivo..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelModal(false)}>Voltar</Button>
            <Button
              variant="destructive"
              onClick={() => cancelOrderMutation.mutate(cancelReason)}
              disabled={!cancelReason || cancelOrderMutation.isLoading}
            >
              {cancelOrderMutation.isLoading ? "Cancelando..." : "Confirmar Cancelamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Modal */}
      <Dialog open={refundModal} onOpenChange={setRefundModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Processar Reembolso</DialogTitle>
            <DialogDescription>Estorne o pagamento para o cliente</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Valor do Reembolso</label>
              <Input
                type="number"
                step="0.01"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder={`Valor total: R$ ${order.total.toFixed(2)}`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Deixe em branco para reembolsar o valor total
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundModal(false)}>Cancelar</Button>
            <Button
              onClick={() => refundOrderMutation.mutate(refundAmount || order.total)}
              disabled={refundOrderMutation.isLoading}
            >
              {refundOrderMutation.isLoading ? "Processando..." : "Processar Reembolso"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
