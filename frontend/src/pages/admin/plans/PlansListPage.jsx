import { useMutation, useQueryClient } from "@tanstack/react-query";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function PlansListPage() {
  const queryClient = useQueryClient();
  const togglePlanMutation = useMutation({
    mutationFn: async (plan) => {
      await api.patch(`/plans/${plan.id}`, { is_active: !plan.is_active });
    },
    onSuccess: () => queryClient.invalidateQueries(["admin-plans"]),
  });

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["admin-plans"],
    queryFn: async () => {
      const { data } = await api.get("/plans/admin");
      return Array.isArray(data) ? data : [];
    },
  });
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Planos de Assinatura</h2>
      <Card className="mb-6 p-4 flex justify-between items-center">
        <Button variant="primary" onClick={() => navigate('/admin/plans/create')}>Criar Novo Plano</Button>
      </Card>
      {/*
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-2">Simular Receita Recorrente (MRR)</h3>
        <MRRSimulator plans={plans} />
      </Card>
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-2">Teste A/B de Página</h3>
        <ABTestTable plans={plans} />
      </Card>
      */}
      <Card className="p-4">
        {isLoading ? <p>Carregando...</p> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Título</th>
                <th className="p-2 text-left">Descrição</th>
                <th className="p-2 text-left">Preço</th>
                <th className="p-2 text-left">Ciclo</th>
                <th className="p-2 text-left">Ativo</th>
                <th className="p-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{plan.id}</td>
                  <td className="p-2">{plan.name}</td>
                  <td className="p-2">{plan.description}</td>
                  <td className="p-2">R$ {plan.price?.toFixed(2)}</td>
                  <td className="p-2">{plan.billingCycle || '-'}</td>
                  <td className="p-2">{plan.is_active ? 'Sim' : 'Não'}</td>
                  <td className="p-2 text-right">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/admin/plans/${plan.id}/edit`)}>Editar</Button>
                    <Button size="sm" variant={plan.is_active ? "destructive" : "default"} onClick={() => togglePlanMutation.mutate(plan)}>
                      {plan.is_active ? 'Desativar' : 'Ativar'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
