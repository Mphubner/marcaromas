import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit, Save, Truck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { adminService } from "../../../services/adminService";

export default function AdminPedidoDetalhes() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const { data: order, isLoading } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => adminService.getOrderById(orderId), // adminService.getOrderById uses /orders/:orderId
    enabled: !!orderId,
    onSuccess: (data) => {
      setEditData({ status: data.status, tracking_code: data.tracking_code || "" });
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: (data) => adminService.updateOrder(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["order-details", orderId]);
      setEditMode(false);
    },
  });

  if (isLoading) return <div>Carregando...</div>;
  if (!order) return <div>Pedido não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold mb-6">Detalhes do Pedido #{order.id}</h1>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Informações Gerais</CardTitle>
              <Button onClick={() => setEditMode(!editMode)} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                {editMode ? "Cancelar" : "Editar"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><strong>Cliente:</strong> {order.user.email}</div>
            <div><strong>Data:</strong> {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</div>
            <div><strong>Total:</strong> R$ {order.total.toFixed(2)}</div>
            <div>
              <strong>Status:</strong>
              {editMode ? (
                <Select value={editData.status} onValueChange={(value) => setEditData({ ...editData, status: value })}>
                  <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING_PAYMENT">Pagamento Pendente</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                    <SelectItem value="SHIPPED">Enviado</SelectItem>
                    <SelectItem value="DELIVERED">Entregue</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge>{order.status}</Badge>
              )}
            </div>
            <div>
              <strong>Rastreio:</strong>
              {editMode ? (
                <Input value={editData.tracking_code} onChange={(e) => setEditData({ ...editData, tracking_code: e.target.value })} />
              ) : (
                <span>{order.tracking_code || "N/A"}</span>
              )}
            </div>
            {editMode && (
              <Button onClick={() => updateOrderMutation.mutate(editData)}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

