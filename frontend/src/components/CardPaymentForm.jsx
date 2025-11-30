import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CardPaymentForm({ onSubmit, loading }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <input type="text" placeholder="Número do cartão" className="w-full p-2 border rounded" />
          <input type="text" placeholder="Nome do titular" className="w-full p-2 border rounded" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Mês/Ano" className="w-full p-2 border rounded" />
            <input type="text" placeholder="CVV" className="w-full p-2 border rounded" />
          </div>
          <Button onClick={onSubmit} disabled={loading} className="w-full">
            {loading ? 'Processando...' : 'Pagar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
