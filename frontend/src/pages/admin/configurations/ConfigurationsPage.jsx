import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ConfigurationsPage() {
  // Placeholder for configurations data
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Configurações</h2>
      <Card className="mb-6 p-4">
        <div className="font-semibold mb-2">Configurações Gerais</div>
        <div className="h-24 bg-gray-100 flex items-center justify-center text-gray-400">[Configurações do sistema, integrações, etc]</div>
      </Card>
      <Card className="p-4 mb-6">
        <div className="font-semibold mb-2">Lista de Configurações</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Chave</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Adicione dados reais depois */}
            <tr className="border-b">
              <td>API_KEY</td>
              <td>*********</td>
              <td>Ativo</td>
              <td><Button size="sm" variant="primary">Editar</Button></td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
