import {Request, Response, NextFunction} from 'express';
import {ZodError} from 'zod';
import {Prisma} from '@prisma/client';
import logger from '../utils/logger';
import {CustomError} from '../errors/custom-error';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        logger.error('Prisma error:', err);

        if (err.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'Duplicate entry',
                field: err.meta?.target
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Database operation failed'
        });
    }

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    logger.error('Unexpected error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};