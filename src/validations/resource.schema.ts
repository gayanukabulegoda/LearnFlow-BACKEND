import {z} from 'zod';

const InteractionType = z.enum(['VIEW', 'BOOKMARK', 'COMPLETE', 'DISMISS']);

export const interactionSchema = z.object({
    body: z.object({
        recommendationId: z.number().int().positive('Invalid resource ID'),
        type: InteractionType
    })
});

export type ResourceSchema = {
    interaction: typeof interactionSchema
};