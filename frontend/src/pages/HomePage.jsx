import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../utils/api.js"; // Caminho relativo

// Componentes de UI (stubs)
import { Button } from "../components/ui/button.jsx"; // Caminho relativo
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card.jsx";
import { Badge } from "../components/ui/badge.jsx"; // Caminho relativo
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog.jsx"; // Caminho relativo

// Ícones
import {
  Sparkles,
  Heart,
  Package,
  Gift,
  Star,
  ChevronDown,
  Wand2,
  Calendar,
  Mail, // Ícone corrigido
  Music,
  Trophy,
  Clock,
  TrendingUp,
  Settings,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";

// Animação
import { motion } from "framer-motion";

// Componentes Reutilizáveis
import AromaQuiz from "../components/AromaQuiz.jsx"; // Caminho relativo
import NewsletterForm from "../components/NewsletterForm.jsx"; // Caminho relativo
import ProductRecommendations from "../components/ProductRecommendations.jsx"; // Caminho relativo

// Função hook para buscar dados da API
const useApiQuery = (queryKey, endpoint) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }
      return response.json();
    },
  });
};

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Hooks para buscar dados
  const { data: plans = [] } = useApiQuery("plans", "plans");
  const { data: currentBox } = useApiQuery("current-box", "current-box");
  const { data: reviews = [] } = useApiQuery("reviews", "approved-reviews");
  const { data: heroSettings } = useApiQuery("hero-settings", "page-settings/hero");
  const { data: products } = useApiQuery("products", "products");

  // Mock de usuário (vamos implementar o login real depois)
  const user = null; 

  // Valores padrão para o Hero (usados enquanto a API carrega)
  const hero = heroSettings || {
    title: "Transforme Sua\nRotina em Ritual",
    subtitle: "Velas artesanais feitas à mão, com aromas exclusivos e intenções poderosas. Receba todo mês uma box única de autocuidado.",
    background_image: "https://images.unsplash.com/photo-1594031641829-7d4086d3b433?w=1600",
    cta_primary_text: "Conhecer o Clube",
    cta_primary_link: "/clube",
    cta_secondary_text: "Ver Produtos",
    cta_secondary_link: "/loja",
    features: [
      { title: "100% Natural" },
      { title: "Feito à Mão" },
      { title: "Cancele Quando Quiser" },
      { title: "Frete Grátis" },
    ],
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Agora Dinâmico */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Fundo Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-primary to-brand-accent opacity-90 z-0" />

        {/* Imagem de Fundo Dinâmica */}
        {hero.background_image && (
          <div
            className="absolute inset-0 opacity-20 z-0"
            style={{
              backgroundImage: `url(${hero.background_image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-white/20 text-white backdrop-blur-sm border-white/30 px-4 py-2 text-sm">
              +Clube de Velas Artesanais por Assinatura
            </Badge>

            {/* Título Dinâmico */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 whitespace-pre-line">
              {hero.title.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i === 0 ? line : (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-white">
                      {line}
                    </span>
                  )}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
            </h1>

            {/* Subtítulo Dinâmico */}
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              {hero.subtitle}
            </p>

            {/* CTAs Dinâmicos */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {hero.cta_primary_text && (
                <Link to={hero.cta_primary_link}>
                  <Button size="lg" className="bg-white text-brand-primary hover:bg-gray-100 px-8 py-6 text-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {hero.cta_primary_text}
                  </Button>
                </Link>
              )}
              {hero.cta_secondary_text && (
                <Link to={hero.cta_secondary_link}>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {hero.cta_secondary_text}
                  </Button>
                </Link>
              )}
            </div>

            {/* Features Dinâmicas */}
            <div className="flex flex-wrap justify-center gap-8 text-white/80 text-sm">
              {(hero.features || []).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{feature.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Indicador de Scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Botão flutuante do Quiz */}
      <button
        onClick={() => setShowQuiz(true)}
        className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg z-40 hover:bg-brand-dark transition-transform hover:scale-110"
      >
        <Wand2 className="w-6 h-6" />
      </button>

      {/* Modal do Quiz (Agora usa o componente Dialog corrigido) */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Descubra Seu Perfil Aromático</DialogTitle>
            <DialogDescription>
              Responda 4 perguntas rápidas e receba recomendações personalizadas de velas
            </DialogDescription>
          </DialogHeader>
          <AromaQuiz onComplete={() => setShowQuiz(false)} />
        </DialogContent>
      </Dialog>

      {/* Seção da Box do Mês */}
      {currentBox && (
        <section className="py-20 bg-gradient-to-br from-brand-primary to-brand-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{currentBox.month}</span>
              </div>
              <h2 className="text-5xl font-bold mb-4">{currentBox.theme}</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                {currentBox.description}
              </p>

              <div className="grid md:grid-cols-2 gap-8 mt-12">
                {currentBox.image_url && (
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <img
                      src={currentBox.image_url}
                      alt={currentBox.theme}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="text-left space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Vela do Mês</h3>
                    <p className="text-lg font-semibold">{currentBox.candle_name}</p>
                    {currentBox.aroma_notes && currentBox.aroma_notes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {currentBox.aroma_notes.map((note, i) => (
                          <Badge key={i} className="bg-white/20 backdrop-blur-sm text-white">
                            {note}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  {currentBox.spotify_playlist && (
                    <div>
                      <h3 className="text-lg font-bold mb-2">Playlist Exclusiva</h3>
                      <a
                        href={currentBox.spotify_playlist}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white/90 hover:text-white"
                      >
                        <Music className="w-4 h-4" />
                        Ouvir no Spotify
                      </a>
                    </div>
                  )}
                  {currentBox.ritual_tips && (
                    <div>
                      <h3 className="text-lg font-bold mb-2">Ritual do Mês</h3>
                      <p className="text-white/90">{currentBox.ritual_tips}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

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
                  <Card className="border-none shadow-lg text-center">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-brand-dark mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Produtos Recomendados (usando o componente stub) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-brand-primary/10 text-brand-primary">
              Mais Vendidos
            </Badge>
            <h2 className="text-4xl font-bold text-brand-dark mb-4">
              Nossas Velas Mais Amadas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Velas testadas e aprovadas por centenas de clientes
            </p>
          </motion.div>
          
          <ProductRecommendations title="" user={user} />
          
          <div className="text-center mt-12">
            <Link to="/loja">
              <Button size="lg" className="bg-brand-primary hover:bg-brand-dark">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Ver Todos os Produtos
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
                  <Card className="border-none shadow-lg h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      {review.title && (
                        <h4 className="font-bold text-brand-dark mb-2">{review.title}</h4>
                      )}
                      <p className="text-gray-700 text-sm mb-4 line-clamp-4">
                        {review.comment}
                      </p>
                      <p className="text-xs text-gray-500">
                        - {review.user_email.split('@')[0]}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Prévia dos Planos */}
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
                Velas artesanais todo mês na sua casa
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="border-2 border-gray-200 hover:border-brand-primary hover:shadow-2xl transition-all">
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-bold text-brand-dark mb-2">{plan.name}</h3>
                      <div className="text-5xl font-bold text-brand-primary mb-4">
                        R$ {plan.price.toFixed(2).replace('.', ',')}
                        <span className="text-lg text-gray-500">/mês</span>
                      </div>
                      <p className="text-gray-600 mb-6">{plan.description}</p>
                      <Link to={`/checkout?plan=${plan.id}`}>
                        <Button className="w-full bg-brand-primary hover:bg-brand-dark">
                          Assinar {plan.name}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/clube">
                <Button size="lg" variant="outline" className="text-brand-primary border-brand-primary hover:bg-brand-primary/10">
                  Ver Todos os Planos
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-br from-brand-primary to-brand-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Mail className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Receba Novidades e Dicas de Bem-Estar
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Cadastre-se e ganhe 10% de desconto na primeira compra
            </p>
            <NewsletterForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}