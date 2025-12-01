import Redis from 'ioredis';
import logger from '../utils/logger.js';

const redisUrl = process.env.REDIS_URL;

let redis = null;

if (redisUrl) {
    redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            if (times > 3) {
                logger.warn('Redis connection failed too many times, disabling Redis.');
                return null;
            }
            return Math.min(times * 50, 2000);
        }
    });

    redis.on('connect', () => {
        logger.info('Redis connected successfully');
    });

    redis.on('error', (err) => {
        logger.error('Redis connection error:', err);
    });
} else {
    logger.warn('REDIS_URL not found, caching disabled.');
}

export default redis;
