import redis from '../lib/redis.js';
import logger from '../utils/logger.js';

export const cacheMiddleware = (duration = 300) => async (req, res, next) => {
    if (!redis) {
        return next();
    }

    // Create a unique key based on the request URL and query parameters
    const key = `cache:${req.originalUrl || req.url}`;

    try {
        const cachedResponse = await redis.get(key);

        if (cachedResponse) {
            logger.debug(`Cache hit for ${key}`);
            return res.json(JSON.parse(cachedResponse));
        }

        // Override res.json to store the response in cache
        const originalJson = res.json;
        res.json = (body) => {
            // Restore original json method
            res.json = originalJson;

            // Cache the response asynchronously
            redis.set(key, JSON.stringify(body), 'EX', duration).catch((err) => {
                logger.error('Redis cache set error:', err);
            });

            // Send the response
            return res.json(body);
        };

        next();
    } catch (error) {
        logger.error('Redis cache middleware error:', error);
        next();
    }
};
