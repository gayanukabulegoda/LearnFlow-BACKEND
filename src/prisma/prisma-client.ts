import {PrismaClient} from '@prisma/client';
/**
 * @description Prisma client instance to interact with the database
 * @exports prisma
 */
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error']
});

export default prisma;