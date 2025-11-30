import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * PlanCard - Componente para exibição de planos de assinatura
 * Mostra nome, preço, descrição, benefícios e botão de ação
 * @component
 * @example
 * <PlanCard 
 *   plan={{ id: 1, name: "Plano Duo", price: 99.90, description: "2 velas/mês" }} 
 *   index={0}
 *   featured={false}
 * />
 */
const PlanCard = ({ plan, index = 0, featured = false }) => {
  const isPopular = plan.is_popular || featured || plan.name.toLowerCase().includes('plus');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card
        className={`border-2 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative ${isPopular
            ? 'border-brand-primary bg-gradient-to-br from-white to-brand-primary/5'
            : 'border-gray-200 bg-white'
          }`}
      >
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
            <Badge className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-6 py-2 text-xs font-bold shadow-lg">
              MAIS POPULAR
            </Badge>
          </div>
        )}

        <CardContent className="p-8 flex flex-col justify-between h-full">
          {/* Header */}
          <div>
            {/* Name */}
            <h3 className="text-2xl font-bold text-brand-dark mb-3">
              {plan.name}
            </h3>

            {/* Price */}
            <div className="mb-4">
              <div className="text-4xl font-bold text-brand-primary">
                R$ {plan.price.toFixed(2).replace('.', ',')}
                <span className="text-sm text-gray-500 font-normal">/mês</span>
              </div>
            </div>

            {/* Description */}
            {plan.description && (
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {plan.description}
              </p>
            )}

            {/* Benefits List */}
            {plan.benefits && plan.benefits.length > 0 && (
              <div className="space-y-3 mb-6">
                <p className="font-semibold text-xs uppercase tracking-wide text-gray-700">
                  O que você recebe:
                </p>
                {plan.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 leading-tight">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Link to={`/checkout?plan=${plan.id}`} className="w-full">
            <Button
              className={`w-full py-3 text-base font-semibold gap-2 text-white ${isPopular
                  ? 'bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-dark hover:to-brand-primary'
                  : 'bg-brand-accent hover:bg-brand-primary'
                }`}
            >
              Assinar {plan.name}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlanCard;
