import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  XCircle,
  AlertTriangle,
  CreditCard,
  RefreshCw,
  MessageCircle,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

// Premium Client Components
import {
  ClientCard,
  ClientButton,
  ClientBadge
} from '@/components/client';

// UI Components
import { Separator } from '@/components/ui/separator';

const ERROR_REASONS = {
  'insufficient_funds': {
    title: 'Saldo Insuficiente',
    description: 'Seu cartão não possui saldo suficiente para esta compra.',
    icon: CreditCard,
    color: 'orange'
  },
  'invalid_card': {
    title: 'Cartão Inválido',
    description: 'Os dados do cartão estão incorretos ou o cartão expirou.',
    icon: AlertTriangle,
    color: 'red'
  },
  'timeout': {
    title: 'Tempo Esgotado',
    description: 'A transação demorou muito e foi cancelada por segurança.',
    icon: AlertTriangle,
    color: 'yellow'
  },
  'declined': {
    title: 'Transação Recusada',
    description: 'A transação foi recusada pelo banco emissor.',
    icon: XCircle,
    color: 'red'
  },
  'default': {
    title: 'Erro no Pagamento',
    description: 'Não foi possível processar seu pagamento.',
    icon: AlertTriangle,
    color: 'red'
  }
};

export default function PaymentFailurePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const errorCode = searchParams.get('error') || 'default';
  const orderId = searchParams.get('orderId');

  const errorInfo = ERROR_REASONS[errorCode] || ERROR_REASONS.default;
  const ErrorIcon = errorInfo.icon;

  const getColorClasses = (color) => {
    const colors = {
      red: 'from-red-400 to-red-600',
      orange: 'from-orange-400 to-orange-600',
      yellow: 'from-yellow-400 to-orange-500'
    };
    return colors[color] || colors.red;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Error Icon Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getColorClasses(errorInfo.color)} flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
            <ErrorIcon className="w-14 h-14 text-white" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-[#2C2419] mb-4 font-['Playfair_Display']"
          >
            {errorInfo.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600"
          >
            {errorInfo.description}
          </motion.p>
        </motion.div>

        {/* Error Details Card */}
        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <div className="p-4 bg-red-50 rounded-2xl border-2 border-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900 mb-1">
                    Pedido #{orderId} não foi confirmado
                  </p>
                  <p className="text-sm text-red-700">
                    Não se preocupe, nenhuma cobrança foi realizada.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* What to Do */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ClientCard title="O que fazer?" icon={HelpCircle}>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-[#2C2419]">Verifique seus dados</p>
                    <p className="text-sm text-gray-600">
                      Confirme se todas as informações do cartão estão corretas
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-[#2C2419]">Entre em contato com seu banco</p>
                    <p className="text-sm text-gray-600">
                      Eles podem fornecer mais detalhes sobre a recusa
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-[#2C2419]">Tente outro método</p>
                    <p className="text-sm text-gray-600">
                      Você pode usar PIX, outro cartão ou boleto
                    </p>
                  </div>
                </div>
              </div>
            </ClientCard>
          </motion.div>

          {/* Alternative Payment Methods */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <ClientCard title="Métodos Alternativos" icon={CreditCard}>
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-green-50 border-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-900">PIX</p>
                      <p className="text-sm text-green-700">Aprovação imediata</p>
                    </div>
                    <ClientBadge variant="success">Recomendado</ClientBadge>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50 border-2 border-blue-200">
                  <div>
                    <p className="font-semibold text-blue-900">Outro Cartão</p>
                    <p className="text-sm text-blue-700">Débito ou crédito</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50 border-2 border-purple-200">
                  <div>
                    <p className="font-semibold text-purple-900">Boleto</p>
                    <p className="text-sm text-purple-700">Vencimento em 3 dias</p>
                  </div>
                </div>
              </div>
            </ClientCard>
          </motion.div>
        </div>

        {/* Need Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <ClientCard gradient>
            <div className="text-white text-center py-6">
              <MessageCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 font-['Playfair_Display']">
                Precisa de Ajuda?
              </h3>
              <p className="mb-6 opacity-90">
                Nossa equipe está pronta para ajudar você a concluir sua compra
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <ClientButton variant="secondary" onClick={() => navigate('/suporte')}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Falar com Suporte
                </ClientButton>

                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ClientButton variant="secondary">
                    WhatsApp
                  </ClientButton>
                </a>
              </div>
            </div>
          </ClientCard>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <ClientButton
            onClick={() => orderId ? navigate(`/checkout-produto?retry=${orderId}`) : navigate(-1)}
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </ClientButton>

          <ClientButton
            variant="outline"
            onClick={() => navigate('/carrinho')}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Carrinho
          </ClientButton>
        </motion.div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-600">
            Seus itens estão salvos no carrinho. Você pode finalizar a compra quando quiser.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
