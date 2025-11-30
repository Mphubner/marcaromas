import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Package, Check, Pause, Play, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function PlansPage() {
  const queryClient = useQueryClient();
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: adminService.getAllPlansAdmin
  });

  // Mutation para toggle de status
  const toggleStatusMutation = useMutation({
    mutationFn: async (planId) => {
      const { data } = await api.patch(`/plans/${planId}/toggle-status`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['admin-plans']);
      queryClient.invalidateQueries(['plans']);
      const action = data.is_active ? 'ativado' : 'pausado';
      toast.success(`Plano ${action} com sucesso!`);
    },
    onError: (error) => {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do plano');
    }
  });

  const handleToggleStatus = (planId) => {
    toggleStatusMutation.mutate(planId);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Planos de Assinatura</h2>
          <p className="text-gray-500 mt-1">Gerencie os níveis de assinatura e preços</p>
        </div>
        <Link to="/admin/plans/create">
          <Button className="bg-[#8B7355] hover:bg-[#7A6548] text-white rounded-lg shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Novo Plano
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#8B7355]" />
            <p className="text-gray-600">Carregando planos...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <Card key={plan.id} className="hover:shadow-lg transition-all rounded-xl border-2 border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
                <Badge
                  variant={plan.is_active ? "default" : "secondary"}
                  className={plan.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                  {plan.is_active ? 'Ativo' : 'Pausado'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold text-[#8B7355]">
                  R$ {plan.price?.toFixed(2)} <span className="text-sm text-gray-500 font-normal">/mês</span>
                </div>

                {plan.total_value && (
                  <div className="text-xs text-gray-500">
                    Valor em produtos: <span className="font-semibold text-gray-700">R$ {plan.total_value.toFixed(2)}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="line-clamp-1">{plan.description || plan.short_description || 'Sem descrição'}</span>
                  </div>

                  {plan.items_included && plan.items_included.length > 0 && (
                    <div className="space-y-1 mt-3">
                      <p className="text-xs font-semibold text-gray-700">Itens incluídos:</p>
                      {plan.items_included.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-start text-xs text-gray-500">
                          <Check className="w-3 h-3 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                      {plan.items_included.length > 2 && (
                        <p className="text-xs text-gray-400 pl-5">+{plan.items_included.length - 2} mais</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4border-t">
                  <Link to={`/admin/plans/${plan.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full rounded-lg border-gray-300">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(plan.id)}
                    disabled={toggleStatusMutation.isPending}
                    className={`rounded-lg flex-1 ${plan.is_active
                        ? 'border-orange-300 text-orange-700 hover:bg-orange-50'
                        : 'border-green-300 text-green-700 hover:bg-green-50'
                      }`}
                  >
                    {toggleStatusMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : plan.is_active ? (
                      <Pause className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {plan.is_active ? 'Pausar' : 'Ativar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {plans.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Nenhum plano cadastrado</p>
              <Link to="/admin/plans/create">
                <Button className="mt-4 bg-[#8B7355] hover:bg-[#7A6548] rounded-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Plano
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
