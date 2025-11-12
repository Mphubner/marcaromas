import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { CheckCircle } from 'lucide-react';

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-brand-dark mb-4">Assinatura Ativada!</h1>
        <p className="text-gray-600 mb-8">Bem-vindo ao Clube Marc Aromas! Sua primeira box será enviada em breve.</p>
        <Link to="/">
          <Button className="bg-brand-primary hover:bg-brand-dark">
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
}
