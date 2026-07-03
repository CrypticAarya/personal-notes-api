const { PrismaClient } = require('@prisma/client');
const config = require('../config/env');

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const globalForPrisma = global;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (config.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

module.exports = prisma;
