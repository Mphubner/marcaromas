import app from "./app.js";
import { prisma } from "./lib/prisma.js";
import { validateEnvironment } from "./utils/validateEnv.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // Validate environment variables
    validateEnvironment();

    // Test database connection
    await prisma.$connect();
    console.log('📦 Connected to database successfully');
    logger.info('Database connected successfully');

    // Start content scheduler (auto-publish scheduled posts)
    const { startContentScheduler } = await import('./jobs/contentScheduler.js');
    startContentScheduler();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Marc Aromas rodando na porta ${PORT}`);
      logger.info(`Server started on port ${PORT}`, {
        env: process.env.NODE_ENV || 'development',
        port: PORT
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

startServer().catch((error) => {
  logger.error('Unhandled error during startup', { error: error.message, stack: error.stack });
  console.error(error);
});
