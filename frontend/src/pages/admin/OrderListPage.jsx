import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';

export default function OrderListPage() {
  const { data: orders = [], isLoading } = useQuery({ queryKey: ['admin-orders'], queryFn: adminService.getAllOrders });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin — Pedidos</h1>
        {isLoading ? (
          <p>Carregando pedidos...</p>
        ) : (
          <p className="text-gray-600 mb-6">Total de pedidos: {orders.length}</p>
        )}
        <Link to="/admin" className="text-sm text-[#8B7355]">Voltar ao dashboard</Link>
      </div>
    </div>
  );
}
