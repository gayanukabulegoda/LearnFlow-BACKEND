import {z} from 'zod';
/**
 * @description Zod schema for goal management & goal progress tracking
 * @property {body} - Object containing goal data or progress data
 * @returns {z.ZodObject} Zod schema object
 */
const GoalStatus = z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']);
const MAX_DESCRIPTION = 500;

export const goalCreateSchema = z.object({
    body: z.object({
        title: z.string().min(3, 'Title too short').max(255, 'Title too long'),
        description: z.string().max(MAX_DESCRIPTION).optional(),
        status: GoalStatus.optional(),
        targetDate: z.coerce.date()
            .min(new Date(), 'Target date must be in the future')
            .optional()
    })
});

export const goalUpdateSchema = goalCreateSchema.deepPartial().extend({
    body: goalCreateSchema.shape.body.extend({
        status: GoalStatus.optional(),
        progress: z.number().min(0).max(100).optional()
    })
});

export const progressSchema = z.object({
    body: z.object({
        notes: z.string().max(1000, 'Notes too long').optional(),
        duration: z.number().int().positive('Invalid duration').optional()
    })
});