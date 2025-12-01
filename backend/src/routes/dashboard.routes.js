import express from 'express';
import { getDashboardData } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getDashboardData);
router.get('/stats', authMiddleware, getDashboardData); // Alias for main dashboard
router.get('/orders/recent', authMiddleware, async (req, res, next) => {
    try {
        const { prisma } = await import('../lib/prisma.js');
        const orders = await prisma.order.findMany({
            where: req.user.isAdmin ? {} : { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: { select: { name: true } } } }
            }
        });
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

export default router;
