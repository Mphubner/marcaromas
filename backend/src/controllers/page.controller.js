import * as PageService from "../services/page.service.js";

export const getHeroSection = async (req, res) => {
  try {
    const hero = {
      title: "Transforme Sua Rotina em Ritual",
      subtitle: "Velas artesanais feitas à mão, com aromas exclusivos e intenções poderosas.",
      description:
        "Receba todo mês uma box única de autocuidado e bem-estar. Feita com ingredientes naturais e propósito.",
      image: "/images/hero-banner.webp",
      ctaText: "Assine Agora",
      ctaLink: "/clube",
    };

    res.json(hero);
  } catch (error) {
    console.error("Erro ao carregar hero section:", error);
    res.status(500).json({ message: "Erro ao carregar conteúdo da página" });
  }
};

