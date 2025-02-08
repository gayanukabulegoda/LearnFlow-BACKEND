import {Request, Response, NextFunction} from 'express';
import {CustomError} from '../errors/custom-error';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    next(new CustomError(404, 'Endpoint not found'));
};