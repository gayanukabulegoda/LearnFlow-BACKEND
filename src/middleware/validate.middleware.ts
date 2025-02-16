import {Request, Response, NextFunction} from 'express';
import {AnyZodObject, ZodError} from 'zod';
/**
 * @description Middleware to validate request data
 * @param schema - Zod schema object to validate request data
 * @returns Express middleware function to be used in routes
 */
export const validate = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.errors.map(e => ({
                        field: e.path.join('.'),
                        message: e.message
                    }))
                });
            } else {
                next(error);
            }
        }
    };
};