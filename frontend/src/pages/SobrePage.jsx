import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Leaf, Users, Target, Award } from "lucide-react";
import { motion } from "framer-motion";

// Meu serviço de API
import { pageSettingsService } from "../services/pageSettingsService";

export default function Sobre() {
  const { data: aboutSettings } = useQuery({
    queryKey: ["about-settings"],
    queryFn: () => pageSettingsService.getSettingsBySection('about'),
  });

  // Conteúdo padrão enquanto os dados carregam
  const content = aboutSettings || {
    title: "Uma Marca Nascida do Coração",
    subtitle: "Marc Aromas nasceu do desejo de trazer mais presença, calma e beleza para o dia a dia das pessoas.",
    text_content: "Somos uma marca brasileira de velas artesanais premium, criada para mulheres e homens que valorizam qualidade, autocuidado e momentos de pausa em meio à rotina acelerada.\n\nCada vela é feita à mão, com ingredientes 100% naturais, sem parafina ou substâncias tóxicas. Usamos apenas cera de soja, óleos essenciais puros e pavios de algodão.\n\nMais do que produtos, criamos experiências sensoriais que conectam você com suas emoções e transformam sua casa em um santuário de bem-estar.",
    image_url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#8B7355] to-[#6B5845] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">{content.title}</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              {content.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {content.image_url && (
                <img
                  src={content.image_url}
                  alt="Nossa História"
                  className="rounded-2xl shadow-2xl w-full"
                />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Badge className="bg-[#8B7355]/10 text-[#8B7355]">Nossa História</Badge>
              <div className="text-gray-700 space-y-4 whitespace-pre-line">
                {content.text_content}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#2C2419] mb-4">Nossos Valores</h2>
            <p className="text-lg text-gray-600">O que nos move todos os dias</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: "Sustentabilidade",
                description: "100% natural, vegano e livre de crueldade. Embalagens recicláveis e processos conscientes."
              },
              {
                icon: Heart,
                title: "Autocuidado",
                description: "Acreditamos que cuidar de si não é luxo, é necessidade. Nossos produtos são ferramentas de bem-estar."
              },
              {
                icon: Sparkles,
                title: "Qualidade Artesanal",
                description: "Cada vela é feita à mão com atenção aos detalhes. Valorizamos o tempo e o carinho no processo."
              }
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="border-none shadow-xl text-center h-full">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B7355] to-[#D4A574] flex items-center justify-center mx-auto mb-6">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#2C2419] mb-3">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-[#2C2419] to-[#8B7355] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Target className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Nossa Missão</h2>
            <p className="text-xl opacity-90 mb-8">
              Tornar o autocuidado acessível, bonito e parte natural da rotina das pessoas.
              Queremos que cada casa tenha um cantinho de paz, onde uma vela acesa marca
              a transição entre a correria e o descanso.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <p className="text-4xl font-bold mb-2">10k+</p>
                <p className="text-sm opacity-80">Velas Enviadas</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">2k+</p>
                <p className="text-sm opacity-80">Assinantes Felizes</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">98%</p>
                <p className="text-sm opacity-80">Satisfação</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team/Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#2C2419] mb-4">Por Que Escolher Marc Aromas?</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Sparkles, title: "Feito à Mão", desc: "Cada vela é única" },
              { icon: Leaf, title: "100% Natural", desc: "Sem parafina ou tóxicos" },
              { icon: Award, title: "Qualidade Premium", desc: "Ingredientes selecionados" },
              { icon: Users, title: "Clube Exclusivo", desc: "Experiência completa" }
            ].map((item, index) => {
              const Icon = item.icon;
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
                      <Icon className="w-12 h-12 text-[#8B7355] mx-auto mb-4" />
                      <h3 className="font-bold text-[#2C2419] mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

