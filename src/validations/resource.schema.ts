import {z} from 'zod';
/**
 * @description Zod schema for interaction object
 * @property {z.ZodObject} body - Object containing recommendationId and type
 * @returns {z.ZodObject} Zod object schema
 */
const InteractionType = z.enum(['VIEW', 'BOOKMARK', 'COMPLETE', 'DISMISS']);

export const interactionSchema = z.object({
    body: z.object({
        recommendationId: z.number().int().positive('Invalid resource ID'),
        type: InteractionType
    })
});