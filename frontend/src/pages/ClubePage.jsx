import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// --- CAMINHOS CORRIGIDOS (Relativos) ---
import { API_URL } from "../utils/api.js";
import { Button } from "../components/ui/button.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card.jsx";
import { Badge } from "../components/ui/badge.jsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion.jsx";

// Icons
import { Sparkles, Check, Gift, Heart, Package, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

// Novo componente e serviço
import PlanCard from "../components/PlanCard.jsx";
import { planService } from "../services/planService.js";

export default function ClubePage() {
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: planService.getAll
  });

  const faqs = [
    {
      question: "Posso cancelar quando quiser?",
      answer: "Sim! Você pode cancelar sua assinatura a qualquer momento, sem burocracia. Basta acessar sua área do assinante e solicitar o cancelamento."
    },
    {
      question: "O frete é incluso?",
      answer: "Sim! O frete está incluído em todos os planos e enviamos para todo o Brasil."
    },
    {
      question: "Quando recebo minha caixa?",
      answer: "Sua primeira box será enviada em até 7 dias após a confirmação do pagamento. As boxes seguintes são enviadas todo início de mês."
    },
  ];

  const howItWorks = [
    { step: 1, title: "Escolha seu plano", description: "Selecione entre Duo ou Plus", icon: Gift },
    { step: 2, title: "Complete o cadastro", description: "Preencha seus dados e endereço", icon: Package },
    { step: 3, title: "Receba sua box", description: "Todo mês, uma nova experiência", icon: Heart },
    { step: 4, title: "Renove automaticamente", description: "Sem preocupações, tudo automático", icon: Zap }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Clube de Assinaturas</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-brand-dark mb-6 leading-tight">
              Transforme cada mês em<br />
              <span className="text-brand-primary">um ritual de autocuidado</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Receba velas artesanais exclusivas todo mês, com aromas únicos,
              playlists personalizadas e conteúdo de bem-estar pensado para você.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              Escolha seu plano
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Planos especiais para você viver a experiência Marc Aromas
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <PlanCard plan={plan} index={index} featured={false} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Em poucos passos você já está no caminho do autocuidado mensal
            </p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className="border-none shadow-lg bg-white h-full">
                    <CardContent className="p-6 text-center">
                      <div className="relative inline-block mb-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold text-sm">
                          {item.step}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-brand-dark mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-brand-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-gray-600">
              Tudo o que você precisa saber sobre o clube
            </p>
          </motion.div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`} className="border rounded-lg px-6 bg-white shadow-sm">
                  <AccordionTrigger className="text-left font-semibold text-brand-dark hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-brand-primary to-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Escolha seu plano e comece sua jornada de autocuidado mensal agora mesmo.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-brand-primary hover:bg-gray-100 px-8 py-6 text-lg"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Ver Planos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}