import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ContentPage(){
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: content = [], isLoading } = useQuery({ queryKey: ['admin-content'], queryFn: adminService.getAllContent });
  const deleteMutation = useMutation({ mutationFn: adminService.deleteContent, onSuccess: () => queryClient.invalidateQueries(['admin-content']) });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Conteúdo</h2>
        <Button onClick={() => navigate('/admin/content/create')}>Novo Conteúdo</Button>
      </div>
      {isLoading ? <p>Carregando...</p> : (
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 text-left">Título</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {content.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.title}</td>
                  <td className="p-2">{c.type}</td>
                  <td className="p-2">{c.is_published ? 'Publicado' : 'Rascunho'}</td>
                  <td className="p-2 text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/content/${c.id}/edit`)}>Editar</Button>
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
