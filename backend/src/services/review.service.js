
import { prisma } from '../lib/prisma.js';

// Agora você pode usá-lo diretamente:
// Exemplo:
async function getReviews() {
  const allReviews = await prisma.review.findMany();
  return allReviews;
}