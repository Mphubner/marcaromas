import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { Button } from '@/components/ui/button';

export default function CouponCreatePage(){
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ code: '', type: 'percentage', amount: 0, is_active: true });
  const createMutation = useMutation({ mutationFn: adminService.createCoupon, onSuccess: () => queryClient.invalidateQueries(['admin-coupons']) });

  const submit = async (e) => {
    e.preventDefault();
    try{
      await createMutation.mutateAsync(form);
      navigate('/admin/coupons');
    }catch(err){
      console.error(err);
      alert('Erro ao criar cupom');
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Novo Cupom</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" name="code" placeholder="Código" value={form.code} onChange={(e)=>setForm({...form, code: e.target.value.toUpperCase()})} />
        <select className="input" value={form.type} onChange={(e)=>setForm({...form, type: e.target.value})}>
          <option value="percentage">Porcentagem</option>
          <option value="fixed_amount">Valor Fixo</option>
        </select>
        <input className="input" type="number" value={form.amount} onChange={(e)=>setForm({...form, amount: Number(e.target.value)})} />
        <label className="inline-flex items-center"><input type="checkbox" checked={form.is_active} onChange={(e)=>setForm({...form, is_active: e.target.checked})} /> <span className="ml-2">Ativo</span></label>
        <div>
          <Button type="submit">Criar</Button>
          <Button variant="ghost" onClick={()=>navigate('/admin/coupons')} className="ml-2">Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
