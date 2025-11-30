import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export const authOptional = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    req.user = null;
    return next();
  }

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    req.user = user || null;
  } catch (err) {
    // If token invalid, treat as unauthenticated rather than erroring here
    req.user = null;
  }
  return next();
};
