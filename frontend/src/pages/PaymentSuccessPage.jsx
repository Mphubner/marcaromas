import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Download,
  ArrowRight,
  Sparkles,
  Gift
} from 'lucide-react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

// Premium Client Components
import {
  ClientCard,
  ClientButton,
  ClientBadge
} from '@/components/client';

// UI Components
import { Separator } from '@/components/ui/separator';

// Services
import { orderService } from '../services/orderService';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  // Fetch order details
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId
  });

  // Stop confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
      </div>
    );
  }

  // Mock order if not found
  const orderData = order || {
    id: orderId || '1234',
    total: 149.90,
    items: [
      { product: { name: 'Vela Lavanda Premium' }, quantity: 2 },
      { product: { name: 'Vela Baunilha' }, quantity: 1 }
    ],
    shippingAddress: {
      street: 'Rua Example',
      number: '123',
      city: 'São Paulo',
      state: 'SP'
    },
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle2 className="w-14 h-14 text-white" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-[#2C2419] mb-4 font-['Playfair_Display']"
          >
            Pagamento Confirmado!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600"
          >
            Seu pedido foi realizado com sucesso
          </motion.p>
        </motion.div>

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <ClientCard gradient>
            <div className="text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm opacity-90 mb-1">Pedido</p>
                  <p className="text-3xl font-bold font-['Playfair_Display']">
                    #{orderData.id}
                  </p>
                </div>
                <ClientBadge variant="success">Confirmado</ClientBadge>
              </div>

              <Separator className="bg-white/20 mb-6" />

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5" />
                    <span className="text-sm opacity-90">Itens</span>
                  </div>
                  <p className="font-semibold">
                    {orderData.items?.length || 0} {orderData.items?.length === 1 ? 'produto' : 'produtos'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-sm opacity-90">Total</span>
                  </div>
                  <p className="font-semibold text-2xl font-['Playfair_Display']">
                    R$ {orderData.total?.toFixed(2)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm opacity-90">Previsão de Entrega</span>
                  </div>
                  <p className="font-semibold">
                    {orderData.estimatedDelivery
                      ? new Date(orderData.estimatedDelivery).toLocaleDateString('pt-BR')
                      : '7 dias úteis'}
                  </p>
                </div>
              </div>
            </div>
          </ClientCard>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ClientCard title="Detalhes do Pedido" icon={Package}>
              <div className="space-y-3">
                {orderData.items?.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-700">
                      {item.quantity}x {item.product.name}
                    </span>
                  </div>
                ))}
              </div>
            </ClientCard>
          </motion.div>

          {/* Delivery Address */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <ClientCard title="Endereço de Entrega" icon={MapPin}>
              {orderData.shippingAddress && (
                <div className="text-gray-700">
                  <p>
                    {orderData.shippingAddress.street}, {orderData.shippingAddress.number}
                  </p>
                  {orderData.shippingAddress.complement && (
                    <p>{orderData.shippingAddress.complement}</p>
                  )}
                  <p>
                    {orderData.shippingAddress.city} - {orderData.shippingAddress.state}
                  </p>
                </div>
              )}
            </ClientCard>
          </motion.div>
        </div>

        {/* What Happens Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <ClientCard>
            <h3 className="text-xl font-bold text-[#2C2419] mb-4 font-['Playfair_Display']">
              <Sparkles className="w-6 h-6 inline mr-2 text-[#8B7355]" />
              O que acontece agora?
            </h3>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-[#2C2419]">Confirmação por Email</p>
                  <p className="text-sm text-gray-600">
                    Enviamos um email com todos os detalhes do seu pedido
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-[#2C2419]">Preparação do Pedido</p>
                  <p className="text-sm text-gray-600">
                    Vamos separar seus produtos com todo cuidado
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-[#2C2419]">Envio e Rastreamento</p>
                  <p className="text-sm text-gray-600">
                    Assim que enviarmos, você receberá o código de rastreamento
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <p className="font-semibold text-[#2C2419]">Entrega</p>
                  <p className="text-sm text-gray-600">
                    Seu pedido chegará em até 7 dias úteis
                  </p>
                </div>
              </div>
            </div>
          </ClientCard>
        </motion.div>

        {/* Special Offer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-8"
        >
          <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white shadow-lg">
            <div className="flex items-start gap-4">
              <Gift className="w-8 h-8 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-xl font-bold mb-2">Ganhe 10% OFF na próxima compra!</h4>
                <p className="mb-4 opacity-90">
                  Use o cupom <strong>OBRIGADO10</strong> em sua próxima compra
                </p>
                <div className="inline-block px-4 py-2 bg-white/20 rounded-full font-mono font-bold backdrop-blur">
                  OBRIGADO10
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <ClientButton
            onClick={() => navigate(`/pedido/${orderData.id}`)}
            className="flex-1"
          >
            <Package className="w-4 h-4 mr-2" />
            Ver Detalhes do Pedido
          </ClientButton>

          <ClientButton
            variant="outline"
            onClick={() => navigate('/loja')}
            className="flex-1"
          >
            Continuar Comprando
            <ArrowRight className="w-4 h-4 ml-2" />
          </ClientButton>
        </motion.div>

        {/* Download Invoice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => {/* Download invoice logic */ }}
            className="text-[#8B7355] hover:underline font-semibold inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Baixar Nota Fiscal
          </button>
        </motion.div>
      </div>
    </div>
  );
}
