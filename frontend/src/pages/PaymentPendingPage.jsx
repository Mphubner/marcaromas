import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export default function PaymentPendingPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-brand-dark mb-4">Pagamento Pendente</h1>
        <p className="text-gray-600 mb-8">Seu pagamento está sendo processado. Você receberá uma confirmação em breve.</p>
        <Link to="/">
          <Button className="bg-brand-primary hover:bg-brand-dark">
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
}
