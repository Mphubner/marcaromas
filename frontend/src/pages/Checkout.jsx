// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { buscarEnderecoPorCEP } from '../utils/viacep';
import { API_URL } from '../utils/api';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card.jsx";

export default function CheckoutPage() {
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState({});
  const [step, setStep] = useState(1);
  const [items, setItems] = useState([{ title: 'Vela Aromática', quantity: 1, unit_price: 79.9 }]);

  async function onCepBlur() {
    const data = await buscarEnderecoPorCEP(cep);
    if (data) setEndereco(data);
  }

  async function iniciarPagamento() {
    const res = await fetch(`${API_URL}/api/mp/create_preference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, payer: { email: 'cliente@exemplo.com' } })
    });
    const data = await res.json();
    if (data.init_point) window.location.href = data.init_point;
    else alert('Erro criando checkout');
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {step === 1 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Endereço de entrega</h2>
          <input placeholder="CEP" value={cep} onChange={e=>setCep(e.target.value)} onBlur={onCepBlur} className="border p-2 mb-2 w-full" />
          <input placeholder="Rua" value={endereco.rua || ''} onChange={e=>setEndereco({...endereco, rua:e.target.value})} className="border p-2 mb-2 w-full" />
          <div className="flex gap-2">
            <input placeholder="Cidade" value={endereco.cidade || ''} onChange={e=>setEndereco({...endereco, cidade:e.target.value})} className="border p-2 mb-2 w-full" />
            <input placeholder="UF" value={endereco.uf || ''} onChange={e=>setEndereco({...endereco, uf:e.target.value})} className="border p-2 mb-2 w-24" />
          </div>
          <button onClick={()=>setStep(2)} className="mt-4 px-4 py-2 bg-brand-primary text-white rounded">Continuar</button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Resumo do pedido</h2>
          <ul>
            {items.map((it, i) => <li key={i}>{it.title} — {it.quantity} x R$ {it.unit_price}</li>)}
          </ul>
          <div className="mt-4">
            <button onClick={()=>setStep(1)} className="mr-2 px-4 py-2 border rounded">Voltar</button>
            <button onClick={iniciarPagamento} className="px-4 py-2 bg-green-600 text-white rounded">Pagar</button>
          </div>
        </>
      )}
    </div>
  );
}
