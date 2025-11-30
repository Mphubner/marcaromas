import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function CouponsPage(){
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: coupons = [], isLoading } = useQuery({ queryKey: ['admin-coupons'], queryFn: adminService.getAllCoupons });
  const deleteMutation = useMutation({ mutationFn: adminService.deleteCoupon, onSuccess: () => queryClient.invalidateQueries(['admin-coupons']) });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Cupons</h2>
        <Button onClick={() => navigate('/admin/coupons/create')}>Novo Cupom</Button>
      </div>
      {isLoading ? <p>Carregando...</p> : (
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 text-left">Código</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Valor</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="p-2 font-mono">{c.code}</td>
                  <td className="p-2">{c.type}</td>
                  <td className="p-2">{c.type === 'percentage' ? `${c.amount}%` : `R$ ${c.amount}`}</td>
                  <td className="p-2">{c.is_active ? 'Ativo' : 'Inativo'}</td>
                  <td className="p-2 text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/coupons/${c.id}/edit`)}>Editar</Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteMutation.mutate(c.id)}>Excluir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
