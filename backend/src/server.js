import app from "./app.js";
import prisma from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('📦 Connected to database successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Marc Aromas rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch(console.error);
