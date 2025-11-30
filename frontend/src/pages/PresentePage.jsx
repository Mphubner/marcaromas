import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

// Components
import GiftHero from '../components/gift/GiftHero';
import GiftPlanSelector from '../components/gift/GiftPlanSelector';
import GiftDurationSelector from '../components/gift/GiftDurationSelector';
import GiftGiverForm from '../components/gift/GiftGiverForm';
import GiftRecipientForm from '../components/gift/GiftRecipientForm';
import GiftMessageCard from '../components/gift/GiftMessageCard';
import GiftProductExtras from '../components/gift/GiftProductExtras';
import GiftSummary from '../components/gift/GiftSummary';

// Services
import { planService } from '../services/planService';
import { productService } from '../services/productService';

export default function PresentePage() {
  const navigate = useNavigate();

  // Refs for smooth scrolling
  const planSelectorRef = useRef(null);
  const summaryRef = useRef(null);

  // State management
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(3); // Default 3 months
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [formData, setFormData] = useState({
    // Giver info
    giverName: '',
    giverEmail: '',
    giverPhone: '',
    giverCPF: '',
    // Recipient info
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    recipientZipCode: '',
    recipientStreet: '',
    recipientNumber: '',
    recipientComplement: '',
    recipientNeighborhood: '',
    recipientCity: '',
    recipientState: '',
    // Message
    giftMessage: '',
    sendImmediate: true,
    scheduledDate: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch plans
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: planService.getAll,
  });

  // Fetch products for extras
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
  });

  // Handlers
  const handleStartClick = () => {
    planSelectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    toast.success(`Plano ${plan.name} selecionado!`);
  };

  const handleDurationSelect = (months) => {
    setSelectedDuration(months);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleToggleExtra = (product) => {
    setSelectedExtras(prev => {
      const exists = prev.find(extra => extra.productId === product.id);
      if (exists) {
        // Remove
        return prev.filter(extra => extra.productId !== product.id);
      } else {
        // Add
        return [...prev, { productId: product.id, quantity: 1, product }];
      }
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setSelectedExtras(prev =>
      prev.map(extra =>
        extra.productId === productId
          ? { ...extra, quantity: newQuantity }
          : extra
      )
    );
  };

  const validateForm = () => {
    const newErrors = {};

    // Giver validation
    if (!formData.giverName) newErrors.giverName = 'Nome é obrigatório';
    if (!formData.giverEmail) newErrors.giverEmail = 'E-mail é obrigatório';
    if (!formData.giverCPF) newErrors.giverCPF = 'CPF é obrigatório';

    // Recipient validation
    if (!formData.recipientName) newErrors.recipientName = 'Nome é obrigatório';
    if (!formData.recipientEmail) newErrors.recipientEmail = 'E-mail é obrigatório';
    if (!formData.recipientPhone) newErrors.recipientPhone = 'Telefone é obrigatório';
    if (!formData.recipientZipCode) newErrors.recipientZipCode = 'CEP é obrigatório';
    if (!formData.recipientStreet) newErrors.recipientStreet = 'Rua é obrigatória';
    if (!formData.recipientNumber) newErrors.recipientNumber = 'Número é obrigatório';
    if (!formData.recipientCity) newErrors.recipientCity = 'Cidade é obrigatória';
    if (!formData.recipientState) newErrors.recipientState = 'Estado é obrigatório';

    // Message validation
    if (!formData.giftMessage) newErrors.giftMessage = 'Mensagem é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (!selectedPlan) {
      toast.error('Selecione um plano');
      planSelectorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!validateForm()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Prepare gift data for checkout
    const giftData = {
      type: 'gift',
      plan: selectedPlan,
      duration: selectedDuration,
      giver: {
        name: formData.giverName,
        email: formData.giverEmail,
        phone: formData.giverPhone,
        cpf: formData.giverCPF,
      },
      recipient: {
        name: formData.recipientName,
        email: formData.recipientEmail,
        phone: formData.recipientPhone,
        address: {
          zipCode: formData.recipientZipCode,
          street: formData.recipientStreet,
          number: formData.recipientNumber,
          complement: formData.recipientComplement,
          neighborhood: formData.recipientNeighborhood,
          city: formData.recipientCity,
          state: formData.recipientState,
        },
      },
      message: formData.giftMessage,
      scheduledDate: formData.sendImmediate ? null : formData.scheduledDate,
      extras: selectedExtras,
    };

    // Store in sessionStorage for checkout page
    sessionStorage.setItem('giftData', JSON.stringify(giftData));

    // Navigate to checkout
    navigate(`/checkout?type=gift&plan=${selectedPlan.id}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <GiftHero onStartClick={handleStartClick} />

      {/* Plan Selection */}
      <div ref={planSelectorRef} className="scroll-mt-20">
        <GiftPlanSelector
          plans={plans}
          selectedPlan={selectedPlan}
          onSelectPlan={handlePlanSelect}
          isLoading={plansLoading}
        />
      </div>

      {/* Show rest only after plan is selected */}
      <AnimatePresence>
        {selectedPlan && (
          <>
            {/* Duration Selection */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <GiftDurationSelector
                selectedDuration={selectedDuration}
                onSelectDuration={handleDurationSelect}
                planPrice={selectedPlan.price}
              />
            </motion.div>

            {/* Giver Form */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ delay: 0.1 }}
            >
              <GiftGiverForm
                formData={formData}
                onChange={handleFormChange}
                errors={errors}
              />
            </motion.div>

            {/* Recipient Form */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ delay: 0.2 }}
            >
              <GiftRecipientForm
                formData={formData}
                onChange={handleFormChange}
                errors={errors}
              />
            </motion.div>

            {/* Message Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ delay: 0.3 }}
            >
              <GiftMessageCard
                formData={formData}
                onChange={handleFormChange}
              />
            </motion.div>

            {/* Product Extras */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ delay: 0.4 }}
            >
              <GiftProductExtras
                products={products}
                selectedExtras={selectedExtras}
                onToggleExtra={handleToggleExtra}
                onQuantityChange={handleQuantityChange}
                isLoading={productsLoading}
              />
            </motion.div>

            {/* Summary */}
            <motion.div
              ref={summaryRef}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ delay: 0.5 }}
            >
              <GiftSummary
                giftData={{
                  selectedPlan,
                  selectedDuration,
                  formData,
                  selectedExtras,
                }}
                onCheckout={handleCheckout}
              />
            </motion.div>

            {/* Floating Scroll to Summary Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => summaryRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-[#8B7355] to-[#D4A574] text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
              title="Ver resumo"
            >
              <ArrowDown className="w-6 h-6" />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

