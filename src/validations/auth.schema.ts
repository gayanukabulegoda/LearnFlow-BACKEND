import {z} from 'zod';
/**
 * @description Zod schema for user registration & login
 * @property {object} body - Object containing user registration & login schema
 * @returns {z.ZodObject} - Zod object schema for user registration & login
 */
export const registerSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string()
            .min(8, 'Password must be at least 8 characters')
            .max(32, 'Password too long (max 32 characters)')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                'Password must contain uppercase, lowercase, and number'),
        name: z.string().max(100, 'Name too long').optional()
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(1, 'Password is required')
    })
});