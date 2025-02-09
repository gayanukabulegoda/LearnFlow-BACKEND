import prisma from '../../src/prisma/prisma-client';
import {ResourceInteraction, ResourceRecommendation, ResourceType} from '@prisma/client';
import logger from '../utils/logger';
import {analyzeLearningGoal} from './ai.service';
import compromise from "compromise";

export const getUserRecommendations = async (
    userId: number
): Promise<ResourceRecommendation[]> => {
    try {
        const goals = await prisma.learningGoal.findMany({
            where: {userId, status: 'ACTIVE'},
            take: 3
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

        return recommendations.flat();
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