const { PrismaClient } = require('@prisma/client');
const config = require('../config/env');

const prismaClientSingleton = () => {
  try {
    return new PrismaClient();
  } catch (error) {
    if (error.message.includes('did not initialize yet')) {
      console.warn('⚠️ Prisma Client is not generated yet (no models defined). Returning mock client.');
      return {
        $connect: async () => {},
        $disconnect: async () => {},
      };
    }
    throw error;
  }
};

const globalForPrisma = global;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (config.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

module.exports = prisma;
