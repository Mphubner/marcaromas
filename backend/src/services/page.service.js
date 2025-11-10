import { prisma } from '../lib/prisma.js';// Mock inicial — depois pode vir do banco

export async function getHeroSection() {
  return {
    title: "Transforme Sua Rotina em Ritual",
    subtitle: "Velas artesanais feitas à mão, com aromas exclusivos e intenções poderosas.",
    ctaText: "Assine Agora",
    ctaLink: "/clube",
    background: "/images/hero-bg.jpg",
  };
}
