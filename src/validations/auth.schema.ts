import {z} from 'zod';

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

export type AuthSchema = {
    register: typeof registerSchema,
    login: typeof loginSchema
};