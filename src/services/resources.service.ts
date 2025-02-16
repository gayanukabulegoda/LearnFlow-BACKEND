import prisma from '../../src/prisma/prisma-client';
import {ResourceInteraction, ResourceRecommendation} from '@prisma/client';
import logger from '../utils/logger';
import {analyzeLearningGoal} from './ai.service';
import compromise from "compromise";
/**
 * @description Generate resource recommendations for a user based on their learning goals
 * @description Analyze learning goals to generate AI recommendations
 * @description Track user interactions with the recommendations
 * @param userId
 * @returns Resource recommendations
 */
export const getUserRecommendations = async (
    userId: number
): Promise<ResourceRecommendation[]> => {
    try {
        const goals = await prisma.learningGoal.findMany({
            where: {userId, status: 'ACTIVE'},
        });

        const recommendations = await Promise.all(
            goals.map(async (goal) => {
                const aiRecommendations = await analyzeLearningGoal(goal);

                const dbRecommendations = await Promise.all(
                    aiRecommendations.map(rec =>
                        prisma.resourceRecommendation.create({
                            data: {
                                title: rec.title,
                                url: rec.url,
                                type: rec.type,
                                reason: rec.reason,
                                aiScore: rec.aiScore,
                                // Generate tags from keywords in reason or title
                                tags: extractTags(rec.reason, rec.title).join(','),
                                userId,
                                goalId: goal.id
                            }
                        })
                    )
                );

                return dbRecommendations;
            })
        );
        // Flatten (convert a 2D array into a 1D array) and reverse the recommendations
        return recommendations.flat().reverse();
    } catch (error) {
        logger.error('Recommendation service error:', error);
        throw new Error('Failed to generate recommendations');
    }
};

const extractTags = (reason: string, title: string): string[] => {
    const text = `${reason} ${title}`.toLowerCase();
    const doc = compromise(text);
    return [
        ...new Set([
            ...doc.nouns().out('array'),
            ...doc.adjectives().out('array')
        ])
    ].slice(0, 5); // Limit to 5 tags
}

export const createResourceInteraction = async (
    userId: number,
    data: {
        recommendationId: number;
        type: 'VIEW' | 'BOOKMARK' | 'COMPLETE' | 'DISMISS';
    }
): Promise<ResourceInteraction> => {
    try {
        return await prisma.resourceInteraction.create({
            data: {
                ...data,
                userId
            }
        });
    } catch (error) {
        logger.error('Interaction tracking failed:', error);
        throw new Error('Failed to track interaction');
    }
};