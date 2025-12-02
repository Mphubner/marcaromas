import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { buscarEnderecoPorCEP } from '../utils/viacep';
import { API_URL } from '../lib/api';

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2, Lock } from 'lucide-react';
import CardPaymentForm from '../components/CardPaymentForm';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clear } = useCart();
  const { user, token } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const planId = params.get('plan');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [endereco, setEndereco] = useState({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
  });

  // Se não estiver logado, redirecionar para login
  if (!token || !user) {
    return <Navigate to="/login?redirect=/checkout" />;
  }
  // se não houver itens no carrinho, mas há um planId (assinatura), permitir checkout da assinatura
  if (cart.length === 0 && !planId) {
    return <Navigate to="/loja" />;
  }

  // Se veio com planId, buscar detalhes do plano para mostrar no resumo
  const [plan, setPlan] = useState(null);
  useEffect(() => {
    let mounted = true;
    async function fetchPlan() {
      if (!planId) return;
      try {
        const res = await fetch(`${API_URL}/plans/${planId}`);
        if (!res.ok) throw new Error('Erro ao buscar plano');
        const data = await res.json();
        if (mounted) setPlan(data);
      } catch (err) {
        console.warn('Não foi possível buscar plano:', err.message);
      }
    }
    fetchPlan();
    return () => { mounted = false; };
  }, [planId]);

  const handleCepBlur = async () => {
    if (endereco.cep.length === 8) {
      setLoading(true);
      const data = await buscarEnderecoPorCEP(endereco.cep);
      if (data) {
        setEndereco(prev => ({
          ...prev,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf,
        }));
      }
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEndereco(prev => ({ ...prev, [name]: value }));
  };

  const calcularTotal = () => {
    if (plan) return plan.price;
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const iniciarPagamento = async () => {
    setLoading(true);
    setError('');
    try {
      if (planId) {
        // Subscription flow: requires card tokenization
        // Will use CardPaymentForm to get the token, then pass to /subscriptions
        setShowCardForm(true);
      } else {
        const items = cart.map(item => ({
          id: item.id,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
        }));

        const payer = {
          name: user.name,
          email: user.email,
        };

        const res = await fetch(`${API_URL}/payment/create-preference`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ items, payer, shipping_address: endereco }),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Falha ao criar a preferência de pagamento.');
        }

        const data = await res.json();
        if (data.init_point) {
          // Limpar o carrinho antes de redirecionar
          clear();
          window.location.href = data.init_point;
        } else {
          setError('Não foi possível iniciar o pagamento. Tente novamente.');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [showCardForm, setShowCardForm] = React.useState(false);

  const onCardFormClose = ({ success, data, error } = {}) => {
    setShowCardForm(false);
    if (success) {
      // redirect to success page or show a message
      window.location.href = '/payment/success';
    } else if (error) {
      setError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finalizar Compra</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
            Revise seu pedido e preencha o endereço de entrega.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna do Endereço */}
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" name="cep" value={endereco.cep ?? ''} onChange={handleInputChange} onBlur={handleCepBlur} maxLength="8" placeholder="Apenas números" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="rua">Rua</Label>
                    <Input id="rua" name="rua" value={endereco.rua ?? ''} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="numero">Número</Label>
                    <Input id="numero" name="numero" value={endereco.numero ?? ''} onChange={handleInputChange} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="complemento">Complemento (Opcional)</Label>
                  <Input id="complemento" name="complemento" value={endereco.complemento ?? ''} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input id="bairro" name="bairro" value={endereco.bairro ?? ''} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input id="cidade" name="cidade" value={endereco.cidade ?? ''} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="uf">UF</Label>
                    <Input id="uf" name="uf" value={endereco.uf ?? ''} onChange={handleInputChange} maxLength="2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna do Resumo do Pedido */}
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plan ? (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{plan.name} (assinatura)</span>
                      <span className="font-medium">R$ {Number(plan.price).toFixed(2)}</span>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{item.name} (x{item.quantity})</span>
                        <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t my-4"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R$ {calcularTotal().toFixed(2)}</span>
                </div>
                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                <div className="flex flex-col gap-3">
                  <Button onClick={() => !planId && setShowCardForm(true)} disabled={loading || !!planId} className="w-full mt-2 bg-brand-primary text-white">
                    Pagar com cartão
                  </Button>
                  <Button onClick={() => planId && setShowCardForm(true)} disabled={loading || !planId} className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
                    {loading ? <Loader2 className="animate-spin" /> : <>Pagar Assinatura</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {showCardForm && <CardPaymentForm onClose={onCardFormClose} />}
      </div>
    </div>
  );
}

// Render CardPaymentForm conditionally at module bottom to avoid redeclaring inside component
export function CheckoutCardModal(props) {
  return <CardPaymentForm {...props} />;
}
