import logger from '../utils/logger.js';
import loggerService, { LOG_LEVELS, MODULES } from '../services/logger.service.js';

const errorHandler = (err, req, res, next) => {
  // Log error with context
  logger.error(err.message, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    userId: req.user?.id,
  });

  // Log to Database
  loggerService.logSystem(
    LOG_LEVELS.ERROR,
    MODULES.SYSTEM,
    err.message,
    {
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      userId: req.user?.id,
    }
  );

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Send error response
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor'
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export default errorHandler;
