import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Crown,
  Calendar,
  Package,
  Gift,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Download,
  Heart
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
import { subscriptionService } from '../services/subscriptionService';
import { planService } from '../services/planService';

export default function SubscriptionSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subscriptionId = searchParams.get('subscriptionId');
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  // Fetch subscription details
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', subscriptionId],
    queryFn: () => subscriptionService.getMySubscription(),
    enabled: !!subscriptionId
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

  // Mock subscription if not found
  const subscriptionData = subscription || {
    id: subscriptionId || '1',
    plan: {
      name: 'Plano Premium',
      price: 89.90,
      features: [
        'Box mensal personalizada',
        'Frete grátis',
        'Conteúdo exclusivo',
        'Descontos especiais'
      ]
    },
    nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
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
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8B7355] to-[#7A6548] flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Crown className="w-14 h-14 text-white" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-[#2C2419] mb-4 font-['Playfair_Display']"
          >
            Bem-vindo ao Club!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600"
          >
            Sua assinatura foi confirmada com sucesso
          </motion.p>
        </motion.div>

        {/* Subscription Summary */}
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
                  <p className="text-sm opacity-90 mb-1">Plano</p>
                  <p className="text-3xl font-bold font-['Playfair_Display']">
                    {subscriptionData.plan?.name}
                  </p>
                </div>
                <ClientBadge variant="success">Ativo</ClientBadge>
              </div>

              <Separator className="bg-white/20 mb-6" />

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5" />
                    <span className="text-sm opacity-90">Primeira Entrega</span>
                  </div>
                  <p className="font-semibold">
                    {subscriptionData.nextDelivery
                      ? new Date(subscriptionData.nextDelivery).toLocaleDateString('pt-BR')
                      : 'Em até 7 dias'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm opacity-90">Próxima Cobrança</span>
                  </div>
                  <p className="font-semibold">
                    {subscriptionData.nextBilling
                      ? new Date(subscriptionData.nextBilling).toLocaleDateString('pt-BR')
                      : '30 dias'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5" />
                    <span className="text-sm opacity-90">Valor Mensal</span>
                  </div>
                  <p className="font-semibold text-2xl font-['Playfair_Display']">
                    R$ {subscriptionData.plan?.price?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </ClientCard>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-[#2C2419] mb-6 font-['Playfair_Display']">
            Seus Benefícios
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {subscriptionData.plan?.features?.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
              >
                <ClientCard hoverable>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-semibold text-[#2C2419]">{feature}</p>
                  </div>
                </ClientCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What's Next */}
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
                    Enviamos todos os detalhes da sua assinatura para seu email
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-[#2C2419]">Complete seu Perfil</p>
                  <p className="text-sm text-gray-600">
                    Escolha suas preferências de aromas para personalizar sua box
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-[#2C2419]">Primeira Box em Produção</p>
                  <p className="text-sm text-gray-600">
                    Estamos preparando sua box personalizada com muito carinho
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <p className="font-semibold text-[#2C2419]">Receba em Casa</p>
                  <p className="text-sm text-gray-600">
                    Sua primeira box chegará em até 7 dias úteis
                  </p>
                </div>
              </div>
            </div>
          </ClientCard>
        </motion.div>

        {/* Special Welcome Gift */}
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
                <h4 className="text-xl font-bold mb-2">Presente de Boas-Vindas!</h4>
                <p className="mb-4 opacity-90">
                  Como agradecimento, você ganhou <strong>50 pontos</strong> e acesso
                  imediato ao conteúdo exclusivo para membros
                </p>
                <ClientButton variant="secondary" onClick={() => navigate('/conteudo-exclusivo')}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Explorar Conteúdo
                </ClientButton>
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
            onClick={() => navigate('/perfil-aromas')}
            className="flex-1"
          >
            <Heart className="w-4 h-4 mr-2" />
            Escolher Preferências
          </ClientButton>

          <ClientButton
            variant="outline"
            onClick={() => navigate('/minha-assinatura')}
            className="flex-1"
          >
            Gerenciar Assinatura
            <ArrowRight className="w-4 h-4 ml-2" />
          </ClientButton>
        </motion.div>

        {/* Download Contract */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => {/* Download contract logic */ }}
            className="text-[#8B7355] hover:underline font-semibold inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Baixar Contrato de Assinatura
          </button>
        </motion.div>
      </div>
    </div>
  );
}
