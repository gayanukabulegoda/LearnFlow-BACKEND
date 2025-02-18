import {Request, Response, NextFunction} from 'express';
import {CustomError} from '../errors/custom-error';
/**
 * @description Middleware to catch and handle 404 errors
 * @param req - Request object
 * @param res - Response object
 * @param next - Next function
 * @throws CustomError 404
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    next(new CustomError(404, 'Endpoint not found'));
};