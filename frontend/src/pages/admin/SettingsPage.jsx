import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';

export default function SettingsPage() {
  const { data: settings = {}, isLoading } = useQuery({ queryKey: ['admin-settings'], queryFn: adminService.getAllSettings });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin — Configurações</h1>
        {isLoading ? (
          <p>Carregando configurações...</p>
        ) : (
          <div className="text-gray-600 mb-6">
            <p>Chaves carregadas: {Object.keys(settings || {}).length}</p>
          </div>
        )}
        <Link to="/admin" className="text-sm text-[#8B7355]">Voltar ao dashboard</Link>
      </div>
    </div>
  );
}
