import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma/prisma-client';
import logger from '../utils/logger';
import {config} from '../config';

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
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({success: false, message: 'Authentication required'});
            return;
        }

        const decoded = jwt.verify(token, config.JWT_SECRET) as { id: number };
        const user = await prisma.user.findUnique({
            where: {id: decoded.id},
            select: {id: true, email: true, name: true}
        });

        if (!user) {
            res.status(401).json({success: false, message: 'User not found'});
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        const message = error instanceof jwt.JsonWebTokenError
            ? 'Invalid token'
            : 'Authentication failed';
        res.status(401).json({success: false, message});
    }
};