import {Request, Response, NextFunction} from 'express';
import {ZodError} from 'zod';
import {Prisma} from '@prisma/client';
import {ErrorRequestHandler} from 'express-serve-static-core';
import logger from '../utils/logger';
import {CustomError} from '../errors/custom-error';

export const errorHandler: ErrorRequestHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
        return;
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        logger.error('Prisma error:', err);

        if (err.code === 'P2002') {
            res.status(409).json({
                success: false,
                message: 'Duplicate entry',
                field: err.meta?.target
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Database operation failed'
        });
        return;
    }

    if (err instanceof CustomError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
        return;
    }

    logger.error('Unexpected error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};