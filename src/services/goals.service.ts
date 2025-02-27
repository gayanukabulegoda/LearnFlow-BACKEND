import prisma from '../../src/prisma/prisma-client';
import {LearningGoal, GoalStatus} from '@prisma/client';
import logger from '../utils/logger';
/**
 * @description Manage learning goals for a user
 * @description Log progress and fetch progress history for a goal
 * @param userId
 * @param data - Goal details
 */
export const createGoal = async (
    userId: number,
    data: {
        title: string;
        description?: string;
        targetDate?: Date;
    }
): Promise<LearningGoal> => {
    try {
        return await prisma.learningGoal.create({
            data: {
                title: data.title,
                description: data.description,
                startDate: new Date(),
                targetDate: data.targetDate,
                userId: userId
            }
        });
    } catch (error) {
        logger.error('Goal creation failed:', error);
        throw new Error('Failed to create goal');
    }
};

export const getUserGoals = async (userId: number): Promise<LearningGoal[]> => {
    try {
        // if, use status equal completed, update the learning progress to 100
        const goals = await prisma.learningGoal.findMany({
            where: {userId, status: {not: 'DELETED'}},
            orderBy: {createdAt: 'desc'}
        });

        if (goals) {
            for (const goal of goals) {
                if (goal.status === 'COMPLETED') {
                    await prisma.learningGoal.update({
                        where: {id: goal.id},
                        data: {progress: 100}
                    });
                }
            }
        }

        return await prisma.learningGoal.findMany({
            where: {userId, status: {not: 'DELETED'}},
            orderBy: {createdAt: 'desc'}
        });
    } catch (error) {
        logger.error('Failed to fetch goals:', error);
        throw new Error('Failed to retrieve goals');
    }
};

export const updateUserGoal = async (
    userId: number,
    goalId: number,
    data: {
        title?: string;
        description?: string;
        status?: GoalStatus;
        targetDate?: Date;
    }
): Promise<LearningGoal> => {
    try {
        return await prisma.learningGoal.update({
            where: {id: goalId, userId},
            data
        });
    } catch (error) {
        logger.error('Goal update failed:', error);
        throw new Error('Failed to update goal');
    }
};

export const deleteUserGoal = async (userId: number, goalId: number): Promise<void> => {
    try {
        await prisma.learningGoal.update({
            where: {id: goalId, userId},
            data: {status: 'DELETED'}
        });
    } catch (error) {
        logger.error('Goal deletion failed:', error);
        throw new Error('Failed to delete goal');
    }
};

export const logGoalProgress = async (
    userId: number,
    goalId: number,
    data: {
        notes?: string;
        duration?: number;
    }
) => {
    try {
        const progress = await prisma.progressLog.create({
            data: {
                date: new Date(),
                notes: data.notes,
                duration: data.duration,
                userId,
                goalId
            }
        });

        await prisma.learningGoal.update({
            where: {id: goalId},
            data: {progress: {increment: 5}}
        });

        return progress;
    } catch (error) {
        logger.error('Progress logging failed:', error);
        throw new Error('Failed to log progress');
    }
};

export const getGoalProgressHistory = async (
    userId: number,
    goalId: number
) => {
    try {
        return await prisma.progressLog.findMany({
            where: {goalId, userId},
            orderBy: {date: 'desc'}
        });
    } catch (error) {
        logger.error('Failed to fetch progress:', error);
        throw new Error('Failed to retrieve progress history');
    }
};