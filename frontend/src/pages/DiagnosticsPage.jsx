import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';

export default function DiagnosticsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-brand-dark mb-8">Diagnósticos</h1>
        <p className="text-gray-600 mb-8">Página de diagnósticos do sistema.</p>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-brand-dark mb-2">Status do Sistema</h3>
            <p className="text-gray-600">Tudo funcionando normalmente</p>
          </div>
        </div>
        <Link to="/" className="mt-8">
          <Button className="bg-brand-primary hover:bg-brand-dark">
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
}
