import { prisma } from '../lib/prisma.js';

// Retorna produtos filtrados por categoria
export async function getProducts(category) {
  const where = category ? { category: { name: category } } : {};
  return prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

// Retorna o “box atual” de produtos em destaque
export async function getCurrentBox() {
  return prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}
