import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function SubscriptionFailurePage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-brand-dark mb-4">Erro na Assinatura</h1>
        <p className="text-gray-600 mb-8">Desculpe, houve um problema ao processar sua assinatura. Tente novamente.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/clube">
            <Button className="bg-brand-primary hover:bg-brand-dark">
              Tentar Novamente
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
