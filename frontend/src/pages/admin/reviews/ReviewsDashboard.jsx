import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const reviews = [
  { id: 1, product: "Box Essencial", cliente: "João", rating: 5, status: "pending", texto: "Ótimo produto!", data: "2025-11-10" },
  { id: 2, product: "Óleo Lavanda", cliente: "Maria", rating: 4, status: "approved", texto: "Gostei bastante.", data: "2025-11-09" },
];
export default function ReviewsDashboard() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>
      <Card className="mb-6 p-4">
        <div className="font-semibold mb-2">Métricas</div>
        <div className="h-24 bg-gray-100 flex items-center justify-center text-gray-400">[Média por produto, distribuição, RPS]</div>
      </Card>
      <Card className="p-4 mb-6">
        <div className="font-semibold mb-2">Lista de Reviews</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>ID</th>
              <th>Produto</th>
              <th>Cliente</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Texto</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r.id} className="border-b">
                <td>{r.id}</td>
                <td>{r.product}</td>
                <td>{r.cliente}</td>
                <td>{r.rating}</td>
                <td>{r.status}</td>
                <td>{r.texto}</td>
                <td>{r.data}</td>
                <td>
                  <Button size="sm" variant="primary">Aprovar</Button>
                  <Button size="sm" variant="destructive">Rejeitar</Button>
                  <Button size="sm" variant="outline">Responder</Button>
                  <Button size="sm" variant="outline">Flag</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="flex gap-4">
        <Button variant="outline">Exportar Reviews</Button>
        <Button variant="outline">Ver Produto</Button>
      </div>
    </div>
  );
}
