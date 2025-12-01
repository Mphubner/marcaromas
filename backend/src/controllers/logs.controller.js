import loggerService from '../services/logger.service.js';

export const getSystemLogs = async (req, res, next) => {
    try {
        const { page, limit, level, module, startDate, endDate } = req.query;
        const result = await loggerService.getSystemLogs({
            page,
            limit,
            level,
            module,
            startDate,
            endDate,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getWebhookLogs = async (req, res, next) => {
    try {
        const { page, limit, provider, status, startDate, endDate } = req.query;
        const result = await loggerService.getWebhookLogs({
            page,
            limit,
            provider,
            status,
            startDate,
            endDate,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export default {
    getSystemLogs,
    getWebhookLogs,
};
