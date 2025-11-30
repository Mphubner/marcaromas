import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';

export default function BlogAdminPage() {
  const { data: content = [], isLoading } = useQuery({ queryKey: ['admin-content'], queryFn: adminService.getAllContent });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin — Blog / Conteúdo</h1>
        {isLoading ? (
          <p>Carregando conteúdo...</p>
        ) : (
          <p className="text-gray-600 mb-6">Total de itens de conteúdo: {content.length}</p>
        )}
        <Link to="/admin" className="text-sm text-[#8B7355]">Voltar ao dashboard</Link>
      </div>
    </div>
  );
}
