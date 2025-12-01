import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

export const MODULES = {
    AUTH: 'AUTH',
    ORDER: 'ORDER',
    PAYMENT: 'PAYMENT',
    SYSTEM: 'SYSTEM',
    WEBHOOK: 'WEBHOOK',
    NOTIFICATION: 'NOTIFICATION',
};

/**
 * Log a system event
 */
export const logSystem = async (level, module, message, metadata = null) => {
    try {
        // Console log for immediate visibility
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level}] [${module}] ${message}`);
        if (metadata && level === LOG_LEVELS.ERROR) console.error(metadata);

        // Persist to DB
        await prisma.systemLog.create({
            data: {
                level,
                module,
                message,
                metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined, // Ensure valid JSON
            },
        });
    } catch (error) {
        console.error('Failed to write system log:', error);
    }
};

/**
 * Log a webhook event
 */
export const logWebhook = async (provider, event, payload, status, error = null) => {
    try {
        await prisma.webhookLog.create({
            data: {
                provider,
                event,
                payload: payload ? JSON.parse(JSON.stringify(payload)) : undefined,
                status,
                error,
            },
        });
    } catch (err) {
        console.error('Failed to write webhook log:', err);
    }
};

/**
 * Get system logs with pagination and filtering
 */
export const getSystemLogs = async ({ page = 1, limit = 50, level, module, startDate, endDate }) => {
    const skip = (page - 1) * limit;
    const where = {};

    if (level) where.level = level;
    if (module) where.module = module;
    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
        prisma.systemLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: Number(limit),
            skip: Number(skip),
        }),
        prisma.systemLog.count({ where }),
    ]);

    return {
        logs,
        pagination: {
            total,
            pages: Math.ceil(total / limit),
            currentPage: Number(page),
            limit: Number(limit),
        },
    };
};

/**
 * Get webhook logs with pagination and filtering
 */
export const getWebhookLogs = async ({ page = 1, limit = 50, provider, status, startDate, endDate }) => {
    const skip = (page - 1) * limit;
    const where = {};

    if (provider) where.provider = provider;
    if (status) where.status = status;
    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
        prisma.webhookLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: Number(limit),
            skip: Number(skip),
        }),
        prisma.webhookLog.count({ where }),
    ]);

    return {
        logs,
        pagination: {
            total,
            pages: Math.ceil(total / limit),
            currentPage: Number(page),
            limit: Number(limit),
        },
    };
};

export default {
    logSystem,
    logWebhook,
    getSystemLogs,
    getWebhookLogs,
    LOG_LEVELS,
    MODULES,
};
