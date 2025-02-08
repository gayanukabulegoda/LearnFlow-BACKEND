import prisma from '../../src/prisma/prisma-client';
import {ResourceInteraction, ResourceRecommendation} from '@prisma/client';
import logger from '../utils/logger';
import {analyzeLearningGoal} from './ai.service';

export const getUserRecommendations = async (
    userId: number
): Promise<ResourceRecommendation[]> => {
    try {
        // Get active goals
        const goals = await prisma.learningGoal.findMany({
            where: {userId, status: 'ACTIVE'},
            take: 3
        });

        // Generate and store recommendations
        const recommendations = await Promise.all(
            goals.map(async (goal) => {
                const aiRecommendations = await analyzeLearningGoal(goal);

                // Create database records for recommendations
                const dbRecommendations = await Promise.all(
                    aiRecommendations.map(rec =>
                        prisma.resourceRecommendation.create({
                            data: {
                                title: rec.title,
                                url: rec.url,
                                type: rec.type,
                                reason: rec.reason,
                                aiScore: rec.aiScore,
                                tags: rec.tags?.join(','),
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