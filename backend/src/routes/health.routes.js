import express from 'express';
import { prisma } from '../lib/prisma.js';
import { getIntegrationStatus } from '../utils/validateEnv.js';

const router = express.Router();

/**
 * GET /api/health
 * General health check
 */
router.get('/', async (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

/**
 * GET /api/health/db
 * Database connection health check
 */
router.get('/db', async (req, res, next) => {
    try {
        // Try a simple query
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString(),
        });
    }
});

/**
 * GET /api/health/integrations
 * Check status of external integrations
 */
router.get('/integrations', (req, res) => {
    const integrations = getIntegrationStatus();

    const allConfigured = Object.values(integrations).every(status => status === true);

    res.json({
        status: allConfigured ? 'ok' : 'partial',
        integrations: {
            mercadoPago: {
                payment: integrations.mercadoPagoPayment ? 'configured' : 'not configured',
                subscription: integrations.mercadoPagoSubscription ? 'configured' : 'not configured',
            },
            googleOAuth: integrations.googleOAuth ? 'configured' : 'not configured',
            melhorEnvio: integrations.melhorEnvio ? 'configured' : 'not configured',
        },
        timestamp: new Date().toISOString(),
    });
});

/**
 * GET /api/health/detailed
 * Comprehensive health check (all checks combined)
 */
router.get('/detailed', async (req, res, next) => {
    try {
        // Database check
        let dbStatus = 'unknown';
        let dbError = null;
        try {
            await prisma.$queryRaw`SELECT 1`;
            dbStatus = 'connected';
        } catch (err) {
            dbStatus = 'disconnected';
            dbError = err.message;
        }

        // Integration status
        const integrations = getIntegrationStatus();

        // Overall status
        const isHealthy = dbStatus === 'connected';
        const httpStatus = isHealthy ? 200 : 503;

        res.status(httpStatus).json({
            status: isHealthy ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            database: {
                status: dbStatus,
                error: dbError,
            },
            integrations: {
                mercadoPago: {
                    payment: integrations.mercadoPagoPayment,
                    subscription: integrations.mercadoPagoSubscription,
                },
                googleOAuth: integrations.googleOAuth,
                melhorEnvio: integrations.melhorEnvio,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
