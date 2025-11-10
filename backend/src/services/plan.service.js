import { prisma } from '../lib/prisma.js';

export async function getPlans() {
  return prisma.plan.findMany({
    where: { active: true },
    orderBy: { price: "asc" },
  });
}
