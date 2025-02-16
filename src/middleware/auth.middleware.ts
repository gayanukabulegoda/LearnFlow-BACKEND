import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma/prisma-client';
import logger from '../utils/logger';
import {config} from '../config/config';
/**
 * @description Middleware to authenticate user requests
 * @param req - Request object
 * @param res - Response object
 * @param next - Next function
 * declare global {} is required to extend the Request interface to access user property in req
 */
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                name: string | null;
            };
        }
    }
}

export const auth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            res.status(401).json({success: false, message: 'Authentication required'});
            return;
        }

        const decoded = jwt.verify(accessToken, config.JWT_SECRET) as { id: number };
        const user = await prisma.user.findUnique({
            where: {id: decoded.id},
            select: {id: true, email: true, name: true, refreshToken: true}
        });

        if (!user) {
            res.status(401).json({success: false, message: 'User not found'});
            return;
        }

        req.user = {id: user.id, email: user.email, name: user.name};
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
            return;
        }

        logger.error('Authentication error:', error);
        const message = error instanceof jwt.JsonWebTokenError
            ? 'Invalid token'
            : 'Authentication failed';
        res.status(401).json({success: false, message});
    }
};