import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const coupons = [
  { code: "PROMO10", type: "percent", value: 10, active: true, usage: 23 },
  { code: "FRETEGRATIS", type: "freeShipping", value: 0, active: false, usage: 5 },
];
export default function CouponsDashboard() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Cupons</h2>
      <Card className="mb-6 p-4 flex justify-between items-center">
        <Button variant="primary">Criar Cupom</Button>
        <Button variant="outline">Bulk Import</Button>
      </Card>
      <Card className="p-4 mb-6">
        <div className="font-semibold mb-2">Preview de Impacto</div>
        <div className="h-24 bg-gray-100 flex items-center justify-center text-gray-400">[Simulação de desconto em pedido]</div>
      </Card>
      <Card className="p-4 mb-6">
        <div className="font-semibold mb-2">Cupons</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Código</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Ativo</th>
              <th>Usos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.code} className="border-b">
                <td>{c.code}</td>
                <td>{c.type}</td>
                <td>{c.type === "percent" ? `${c.value}%` : c.type === "fixed" ? `R$ ${c.value}` : "-"}</td>
                <td>{c.active ? "Sim" : "Não"}</td>
                <td>{c.usage}</td>
                <td>
                  <Button size="sm" variant="outline">Editar</Button>
                  <Button size="sm" variant={c.active ? "destructive" : "default"}>{c.active ? "Desativar" : "Ativar"}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="flex gap-4">
        <Button variant="outline">Exportar Cupons</Button>
        <Button variant="outline">Ver Uso</Button>
      </div>
    </div>
  );
}
