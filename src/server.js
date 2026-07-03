const app = require('./app');
const config = require('./config/env');
const prisma = require('./lib/prisma');

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    const server = app.listen(config.PORT, () => {
      console.log(`🚀 Server is running in ${config.NODE_ENV} mode on port ${config.PORT}`);
    });

    // Graceful shutdown handler
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} signal received. Closing server...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        await prisma.$disconnect();
        console.log('Database connection closed.');
        process.exit(0);
      });

      // Force close if it takes too long
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error) {
    console.error('❌ Error starting server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
