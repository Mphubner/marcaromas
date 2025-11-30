import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  MapPin,
  CreditCard,
  Package,
  ArrowRight,
  ArrowLeft,
  Ticket,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Premium Client Components
import {
  ClientPageHeader,
  ClientCard,
  ClientButton,
  ClientBadge
} from '@/components/client';

// UI Components  
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

// Services
import { cartService } from '../services/cartService';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { id: 1, name: 'Endereço', icon: MapPin },
  { id: 2, name: 'Pagamento', icon: CreditCard },
  { id: 3, name: 'Revisão', icon: Package }
];

export default function CheckoutProduto() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Fetch cart
  const { data: cartItems = [], isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: !!user
  });

  // Fetch addresses
  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressService.getAddresses,
    enabled: !!user
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (orderData) => orderService.createOrder(orderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['cart']);
      queryClient.invalidateQueries(['orders']);

      // Redirect based on payment method
      if (paymentMethod === 'pix' && data.payment?.qr_code) {
        navigate(`/pagamento-pendente?orderId=${data.id}`);
      } else {
        navigate(`/pagamento-sucesso?orderId=${data.id}`);
      }

      toast.success('Pedido criado com sucesso!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao criar pedido');
    }
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) =>
    sum + (item.product.price * item.quantity), 0
  );

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? subtotal * (appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;

  const afterDiscount = subtotal - discountAmount;
  const shippingCost = afterDiscount > 200 ? 0 : 15;
  const total = afterDiscount + shippingCost;

  const handleApplyCoupon = () => {
    // Mock coupon validation
    const mockCoupons = {
      'PRIMEIRA': { type: 'percentage', value: 10, code: 'PRIMEIRA' },
      'FRETEGRATIS': { type: 'fixed', value: 15, code: 'FRETEGRATIS' },
      'DESCONTO20': { type: 'percentage', value: 20, code: 'DESCONTO20' }
    };

    const coupon = mockCoupons[couponCode.toUpperCase()];
    if (coupon) {
      setAppliedCoupon(coupon);
      toast.success('Cupom aplicado!');
    } else {
      toast.error('Cupom inválido');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedAddressId) {
      toast.error('Selecione um endereço de entrega');
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = () => {
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      })),
      addressId: selectedAddressId,
      paymentMethod,
      couponCode: appliedCoupon?.code,
      subtotal,
      shippingCost,
      discount: discountAmount,
      total
    };

    createOrderMutation.mutate(orderData);
  };

  if (cartLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    navigate('/carrinho');
    return null;
  }

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientPageHeader
          title="Finalizar Compra"
          subtitle={`${cartItems.length} ${cartItems.length === 1 ? 'item' : 'itens'} no carrinho`}
          backTo="/carrinho"
        />

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= step.id
                        ? 'bg-[#8B7355] text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-500'
                      }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`mt-2 text-sm font-semibold ${currentStep >= step.id ? 'text-[#8B7355]' : 'text-gray-500'
                    }`}>
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 transition-all duration-300 ${currentStep > step.id ? 'bg-[#8B7355]' : 'bg-gray-200'
                    }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Address Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ClientCard title="Endereço de Entrega" icon={MapPin}>
                    {addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">
                          Você ainda não tem endereços cadastrados
                        </p>
                        <ClientButton onClick={() => navigate('/enderecos')}>
                          Adicionar Endereço
                        </ClientButton>
                      </div>
                    ) : (
                      <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                        <div className="space-y-4">
                          {addresses.map((address, index) => (
                            <motion.div
                              key={address.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <label
                                className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressId === address.id
                                    ? 'border-[#8B7355] bg-[#8B7355]/5'
                                    : 'border-gray-200 hover:border-[#8B7355]/50'
                                  }`}
                              >
                                <RadioGroupItem value={address.id} className="mt-1" />
                                <div className="ml-4 flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold text-[#2C2419]">
                                      {address.label || 'Endereço'}
                                    </span>
                                    {address.isDefault && (
                                      <ClientBadge variant="success">Padrão</ClientBadge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {address.street}, {address.number}
                                    {address.complement && ` - ${address.complement}`}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {address.neighborhood}, {address.city} - {address.state}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    CEP: {address.zipCode}
                                  </p>
                                </div>
                              </label>
                            </motion.div>
                          ))}
                        </div>
                      </RadioGroup>
                    )}

                    <div className="mt-6">
                      <ClientButton variant="outline" onClick={() => navigate('/enderecos')}>
                        + Adicionar Novo Endereço
                      </ClientButton>
                    </div>
                  </ClientCard>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ClientCard title="Forma de Pagamento" icon={CreditCard}>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-4">
                        {/* PIX */}
                        <label
                          className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'pix'
                              ? 'border-[#8B7355] bg-[#8B7355]/5'
                              : 'border-gray-200 hover:border-[#8B7355]/50'
                            }`}
                        >
                          <RadioGroupItem value="pix" className="mt-1" />
                          <div className="ml-4 flex-1">
                            <div className="font-semibold text-[#2C2419] mb-1">PIX</div>
                            <p className="text-sm text-gray-600">
                              Pagamento instantâneo via QR Code
                            </p>
                            <ClientBadge variant="success" className="mt-2">
                              Aprovação imediata
                            </ClientBadge>
                          </div>
                        </label>

                        {/* Credit Card */}
                        <label
                          className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'credit_card'
                              ? 'border-[#8B7355] bg-[#8B7355]/5'
                              : 'border-gray-200 hover:border-[#8B7355]/50'
                            }`}
                        >
                          <RadioGroupItem value="credit_card" className="mt-1" />
                          <div className="ml-4 flex-1">
                            <div className="font-semibold text-[#2C2419] mb-1">
                              Cartão de Crédito
                            </div>
                            <p className="text-sm text-gray-600">
                              Visa, Mastercard, Amex
                            </p>
                            <ClientBadge variant="info" className="mt-2">
                              Parcelamento disponível
                            </ClientBadge>
                          </div>
                        </label>

                        {/* Boleto */}
                        <label
                          className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'boleto'
                              ? 'border-[#8B7355] bg-[#8B7355]/5'
                              : 'border-gray-200 hover:border-[#8B7355]/50'
                            }`}
                        >
                          <RadioGroupItem value="boleto" className="mt-1" />
                          <div className="ml-4 flex-1">
                            <div className="font-semibold text-[#2C2419] mb-1">Boleto</div>
                            <p className="text-sm text-gray-600">
                              Vencimento em 3 dias úteis
                            </p>
                            <ClientBadge variant="warning" className="mt-2">
                              Aprovação em até 2 dias
                            </ClientBadge>
                          </div>
                        </label>
                      </div>
                    </RadioGroup>

                    {/* Security Notice */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-900">
                          <p className="font-semibold mb-1">Pagamento Seguro</p>
                          <p>
                            Seus dados são criptografados e protegidos. Não armazenamos
                            informações de cartão de crédito.
                          </p>
                        </div>
                      </div>
                    </div>
                  </ClientCard>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Items Review */}
                  <ClientCard title="Itens do Pedido" icon={Package}>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex-shrink-0">
                            {item.product.images?.[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-2xl"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#2C2419]">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Quantidade: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#8B7355]">
                              R$ {(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ClientCard>

                  {/* Delivery Address */}
                  {selectedAddress && (
                    <ClientCard title="Endereço de Entrega" icon={MapPin}>
                      <div>
                        <p className="font-semibold text-[#2C2419] mb-2">
                          {selectedAddress.label || 'Endereço'}
                        </p>
                        <p className="text-gray-600">
                          {selectedAddress.street}, {selectedAddress.number}
                          {selectedAddress.complement && ` - ${selectedAddress.complement}`}
                        </p>
                        <p className="text-gray-600">
                          {selectedAddress.neighborhood}, {selectedAddress.city} -{' '}
                          {selectedAddress.state}
                        </p>
                        <p className="text-gray-600">CEP: {selectedAddress.zipCode}</p>
                      </div>
                    </ClientCard>
                  )}

                  {/* Payment Method */}
                  <ClientCard title="Forma de Pagamento" icon={CreditCard}>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#8B7355]" />
                      <span className="font-semibold capitalize">
                        {paymentMethod === 'pix' ? 'PIX' :
                          paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 'Boleto'}
                      </span>
                    </div>
                  </ClientCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <ClientButton variant="outline" onClick={handlePrevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </ClientButton>
              )}

              {currentStep < 3 ? (
                <ClientButton onClick={handleNextStep} className="ml-auto">
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </ClientButton>
              ) : (
                <ClientButton
                  onClick={handleSubmitOrder}
                  disabled={createOrderMutation.isPending}
                  className="ml-auto"
                >
                  {createOrderMutation.isPending ? 'Processando...' : 'Finalizar Pedido'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </ClientButton>
              )}
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-24"
            >
              <ClientCard gradient>
                <div className="text-white space-y-4">
                  <h3 className="text-xl font-bold font-['Playfair_Display']">
                    Resumo do Pedido
                  </h3>

                  <Separator className="bg-white/20" />

                  {/* Coupon Input */}
                  {currentStep === 3 && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-white/90">Cupom de Desconto</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Digite o cupom"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                          <ClientButton variant="secondary" size="sm" onClick={handleApplyCoupon}>
                            Aplicar
                          </ClientButton>
                        </div>
                        {appliedCoupon && (
                          <div className="flex items-center gap-2 text-sm text-green-300">
                            <CheckCircle2 className="w-4 h-4" />
                            Cupom {appliedCoupon.code} aplicado
                          </div>
                        )}
                      </div>
                      <Separator className="bg-white/20" />
                    </>
                  )}

                  <div className="space-y-3 text-white/90">
                    <div className="flex justify-between">
                      <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-green-300">
                        <span>Desconto ({appliedCoupon.code})</span>
                        <span>- R$ {discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Frete</span>
                      {shippingCost === 0 ? (
                        <span className="text-green-300 font-semibold">Grátis</span>
                      ) : (
                        <span>R$ {shippingCost.toFixed(2)}</span>
                      )}
                    </div>

                    {shippingCost > 0 && afterDiscount < 200 && (
                      <p className="text-xs text-white/70">
                        Faltam R$ {(200 - afterDiscount).toFixed(2)} para frete grátis
                      </p>
                    )}
                  </div>

                  <Separator className="bg-white/20" />

                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold">Total</span>
                    <p className="text-4xl font-bold font-['Playfair_Display']">
                      R$ {total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </ClientCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
