import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
  Ticket,
  X,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Premium Client Components
import {
  ClientPageHeader,
  ClientCard,
  ClientButton,
  ClientEmptyState
} from '@/components/client';

// UI Components
import { Input } from '@/components/ui/input';

// Context
import { useCart } from '../context/CartContext';

export default function CarrinhoPage() {
  const navigate = useNavigate();
  const { cart: cartItems, loading: cartLoading, updateQuantity, remove } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

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

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock_quantity) {
      toast.error('Quantidade indisponível em estoque');
      return;
    }
    updateQuantity(item.id, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    remove(itemId);
    toast.success('Item removido do carrinho');
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Digite um código de cupom');
      return;
    }

    setCouponLoading(true);

    // TODO: Integrate with real API
    // Simulating coupon validation
    setTimeout(() => {
      const mockCoupons = {
        'PRIMEIRA': { type: 'percentage', value: 10, code: 'PRIMEIRA' },
        'FRETEGRATIS': { type: 'fixed', value: 15, code: 'FRETEGRATIS' },
        'DESCONTO20': { type: 'percentage', value: 20, code: 'DESCONTO20' }
      };

      const coupon = mockCoupons[couponCode.toUpperCase()];

      if (coupon) {
        setAppliedCoupon(coupon);
        toast.success('Cupom aplicado com sucesso!');
      } else {
        toast.error('Cupom inválido ou expirado');
      }

      setCouponLoading(false);
    }, 1000);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Cupom removido');
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientPageHeader
          title="Meu Carrinho"
          subtitle={`${cartItems.length} ${cartItems.length === 1 ? 'item' : 'itens'} no carrinho`}
          backTo="/loja"
        />

        {cartItems.length === 0 ? (
          <ClientEmptyState
            icon={ShoppingBag}
            title="Seu carrinho está vazio"
            message="Explore nossa loja e adicione produtos incríveis!"
            actionLabel="Ir para a Loja"
            onAction={() => navigate('/loja')}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ClientCard hoverable>
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.product.images && item.product.images[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8B7355]/20 to-[#7A6548]/20">
                            <Package className="w-12 h-12 text-[#8B7355]/50" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-[#2C2419] mb-1">
                              {item.product.name}
                            </h3>
                            {item.product.size && (
                              <p className="text-sm text-gray-500">{item.product.size}</p>
                            )}
                            {item.product.stock_quantity <= 5 && (
                              <p className="text-xs text-orange-600 mt-1">
                                Apenas {item.product.stock_quantity} em estoque
                              </p>
                            )}
                          </div>

                          <ClientButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </ClientButton>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <ClientButton
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-10 w-10 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </ClientButton>

                            <span className="w-12 text-center font-bold text-lg">
                              {item.quantity}
                            </span>

                            <ClientButton
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock_quantity}
                              className="h-10 w-10 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </ClientButton>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#8B7355] font-['Playfair_Display']">
                              R$ {(item.product.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              R$ {item.product.price.toFixed(2)} cada
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ClientCard>
                </motion.div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 sticky top-24"
              >

                {/* Coupon Card */}
                <ClientCard title="Cupom de Desconto" icon={Ticket}>
                  {!appliedCoupon ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite o cupom"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="rounded-2xl"
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        />
                        <ClientButton
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                          size="sm"
                        >
                          {couponLoading ? 'Validando...' : 'Aplicar'}
                        </ClientButton>
                      </div>
                      <p className="text-xs text-gray-500">
                        Ex: PRIMEIRA, DESCONTO20
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-900">
                            Cupom Aplicado
                          </span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm text-green-800 font-mono">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        {appliedCoupon.type === 'percentage'
                          ? `${appliedCoupon.value}% de desconto`
                          : `R$ ${appliedCoupon.value.toFixed(2)} de desconto`}
                      </p>
                    </div>
                  )}
                </ClientCard>

                {/* Order Summary */}
                <ClientCard gradient hoverable={false}>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4 font-['Playfair_Display']">
                      Resumo do Pedido
                    </h3>

                    <div className="space-y-3 text-white/90">
                      <div className="flex justify-between">
                        <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
                        <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
                      </div>

                      {appliedCoupon && (
                        <div className="flex justify-between text-green-300">
                          <span>Desconto ({appliedCoupon.code})</span>
                          <span className="font-semibold">- R$ {discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Frete</span>
                        {shippingCost === 0 ? (
                          <span className="font-semibold text-green-300">Grátis</span>
                        ) : (
                          <span className="font-semibold">R$ {shippingCost.toFixed(2)}</span>
                        )}
                      </div>

                      {shippingCost > 0 && (
                        <p className="text-xs text-white/70">
                          Faltam R$ {(200 - afterDiscount).toFixed(2)} para frete grátis
                        </p>
                      )}
                    </div>

                    <div className="h-px bg-white/20 my-4" />

                    <div className="flex justify-between items-baseline text-white">
                      <span className="text-lg font-semibold">Total</span>
                      <p className="text-4xl font-bold font-['Playfair_Display']">
                        R$ {total.toFixed(2)}
                      </p>
                    </div>

                    <Link to="/checkout-produto" className="block">
                      <ClientButton variant="secondary" className="w-full h-14 text-lg">
                        Finalizar Compra
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </ClientButton>
                    </Link>

                    <Link to="/loja">
                      <ClientButton variant="ghost" className="w-full text-white hover:text-white">
                        Continuar Comprando
                      </ClientButton>
                    </Link>
                  </div>
                </ClientCard>

                {/* Trust Badges */}
                <ClientCard>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Pagamento seguro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Frete grátis acima de R$ 200</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>7 dias para troca</span>
                    </div>
                  </div>
                </ClientCard>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
