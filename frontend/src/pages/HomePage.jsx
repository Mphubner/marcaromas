import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../lib/api.js";

// Swiper CSS - Required for HeroCarousel
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

// Componentes de UI
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent } from "../components/ui/card.jsx";
import { Badge } from "../components/ui/badge.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog.jsx";

// Ícones
import {
  Sparkles,
  Heart,
  Package,
  Gift,
  Star,
  Wand2,
  Calendar,
  Music,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";

// Animação
import { motion } from "framer-motion";

// Premium Homepage Components
import { HeroCarousel } from "../components/home/HeroCarousel.jsx";
import { WelcomePopup } from "../components/home/WelcomePopup.jsx";

// Componentes Reutilizáveis
import AromaQuiz from "../components/AromaQuiz.jsx";
import NewsletterForm from "../components/NewsletterForm.jsx";
import ProductRecommendations from "../components/ProductRecommendations.jsx";
import ReviewCard from "../components/ReviewCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import PlanCard from "../components/PlanCard.jsx";

// Serviços
import { productService } from "../services/productService.js";
import { planService } from "../services/planService.js";

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false);

  // Hooks para buscar dados
  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: planService.getPopular
  });

  const { data: currentBox } = useQuery({
    queryKey: ['current-box'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/current-box`);
      if (!response.ok) throw new Error('Failed to fetch current box');
      return response.json();
    }
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/reviews/approved`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    }
  });

  const { data: bestSellers = [] } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: async () => {
      const products = await productService.getAll();
      return products.slice(0, 6);
    }
  });

  return (
    <div className="min-h-screen">
      {/* Welcome Popup - Appears on first visit */}
      <WelcomePopup />

      {/* Hero Carousel - Premium Banner Carousel */}
      <HeroCarousel />

      {/* Botão flutuante do Quiz - Improved Visibility */}
      <button
        onClick={() => setShowQuiz(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#8B7355] text-white px-6 py-4 rounded-full shadow-2xl hover:bg-[#7A6548] transition-all hover:scale-105 group animate-bounce-subtle"
      >
        <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="font-semibold tracking-wide">Descubra seu Aroma</span>
      </button>

      {/* Modal do Quiz */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle>Descubra Seu Perfil Aromático</DialogTitle>
            <DialogDescription>
              Responda 4 perguntas rápidas e receba recomendações personalizadas de velas
            </DialogDescription>
          </DialogHeader>
          <AromaQuiz onComplete={() => setShowQuiz(false)} />
        </DialogContent>
      </Dialog>

      {/* Value Proposition - New Section */}
      <section className="py-16 bg-[#F5F0EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Sparkles className="w-8 h-8 text-[#8B7355] mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C2419] mb-6 font-playfair">
              Mais que uma vela, um hábito na sua rotina
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              O Marc Club é o primeiro clube de assinatura de velas artesanais premium do Brasil.
              Receba mensalmente uma experiência olfativa curada por especialistas, com descontos exclusivos e acesso antecipado a lançamentos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-gray-600">
              Simples, automático e pensado para você
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Wand2, title: "Escolha Seu Plano", desc: "Selecione o plano ideal para você" },
              { icon: Heart, title: "Personalize", desc: "Defina suas preferências aromáticas" },
              { icon: Package, title: "Receba Todo Mês", desc: "Velas exclusivas na sua porta" },
              { icon: Sparkles, title: "Aproveite", desc: "Momentos de autocuidado especiais" },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-lg text-center h-full hover:-translate-y-2 transition-transform duration-300">
                    <CardContent className="p-6 flex flex-col items-center h-full">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center mb-6 shadow-md">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-brand-dark mb-3">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prévia dos Planos - Moved Up */}
      {plans.length > 0 && (
        <section className="py-20 bg-brand-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-brand-dark mb-4">
                Escolha Seu Plano
              </h2>
              <p className="text-lg text-gray-600">
                Comece sua jornada olfativa hoje mesmo
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.slice(0, 3).map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <PlanCard plan={plan} index={index} />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/clube">
                <Button size="lg" variant="outline" className="text-brand-primary border-brand-primary hover:bg-brand-primary/10 px-8 py-6 text-lg">
                  Ver Todos os Planos
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Seção da Box do Mês */}
      {currentBox && (
        <section className="py-20 bg-gradient-to-br from-brand-primary to-brand-dark text-white overflow-hidden relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white blur-[100px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent blur-[100px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6 border border-white/10">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Box de {currentBox.month}</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 font-playfair">{currentBox.theme}</h2>
              <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                {currentBox.description}
              </p>

              <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
                {currentBox.image_url && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.5 }}
                    className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"
                  >
                    <img
                      src={currentBox.image_url}
                      alt={currentBox.theme}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
                <div className="text-left space-y-8">
                  <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-brand-accent" />
                      Vela do Mês
                    </h3>
                    <p className="text-3xl font-playfair mb-4">{currentBox.candle_name}</p>
                    {currentBox.aroma_notes && currentBox.aroma_notes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {currentBox.aroma_notes.map((note, i) => (
                          <Badge key={i} className="bg-white/20 hover:bg-white/30 text-white border-none px-3 py-1 text-sm">
                            {note}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentBox.spotify_playlist && (
                      <a
                        href={currentBox.spotify_playlist}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                          <Music className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Playlist Exclusiva</p>
                          <p className="text-xs opacity-70">Ouvir no Spotify</p>
                        </div>
                      </a>
                    )}

                    {currentBox.ritual_tips && (
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center text-white shadow-lg">
                          <Star className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Rotina do Mês</p>
                          <p className="text-xs opacity-70">Dicas exclusivas</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <Link to="/clube">
                      <Button size="lg" className="w-full bg-white text-brand-primary hover:bg-brand-light font-bold text-lg py-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                        Quero Receber Esta Box
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Depoimentos */}
      {reviews.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-brand-dark mb-4">
                O Que Nossos Clientes Dizem
              </h2>
              <p className="text-lg text-gray-600">
                Experiências reais de quem já faz parte do clube
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ReviewCard review={review} index={index} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Produtos Recomendados (Store) - Moved Down as Secondary */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors px-4 py-1">
              Marc Store
            </Badge>
            <h2 className="text-4xl font-bold text-brand-dark mb-4">
              Nossas Velas Mais Amadas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra os best-sellers da nossa loja avulsa
            </p>
          </motion.div>

          <ProductRecommendations products={bestSellers} title="" />

          <div className="text-center mt-12">
            <Link to="/loja">
              <Button size="lg" className="bg-brand-primary hover:bg-brand-dark text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Ver Todos os Produtos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter - Premium Brown Gradient Section */}
      <NewsletterForm />
    </div>
  );
}