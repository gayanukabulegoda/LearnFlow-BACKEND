import {Request, Response} from 'express';
import * as goalService from '../services/goals.service';

const createGoal = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({success: false, message: 'Unauthorized'});
            return;
        }

        const goal = await goalService.createGoal(req.user.id, {
            title: req.body.title,
            description: req.body.description,
            targetDate: req.body.targetDate
        });

        res.status(201).json({success: true, data: goal});
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create goal';
        res.status(500).json({success: false, message});
    }
};

const getGoals = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({success: false, message: 'Unauthorized'});
            return;
        }

        const goals = await goalService.getUserGoals(req.user.id);
        res.status(200).json({success: true, data: goals});
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch goals';
        res.status(500).json({success: false, message});
    }
};

const updateGoal = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({success: false, message: 'Unauthorized'});
            return;
        }

        const goal = await goalService.updateUserGoal(
            req.user.id,
            parseInt(req.params.id),
            {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                targetDate: req.body.targetDate
            }
        );

        res.status(200).json({success: true, data: goal});
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update goal';
        res.status(500).json({success: false, message});
    }
};

const deleteGoal = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({success: false, message: 'Unauthorized'});
            return;
        }

        await goalService.deleteUserGoal(req.user.id, parseInt(req.params.id));
        res.status(204).end();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete goal';
        res.status(500).json({success: false, message});
    }
};

const logProgress = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({success: false, message: 'Unauthorized'});
            return;
        }

        const progress = await goalService.logGoalProgress(
            req.user.id,
            parseInt(req.params.id),
            {
                notes: req.body.notes,
                duration: req.body.duration
            }
        );

        res.status(201).json({success: true, data: progress});
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to log progress';
        res.status(500).json({success: false, message});
    }
};

const getGoalProgress = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({success: false, message: 'Unauthorized'});
            return;
        }

        const progress = await goalService.getGoalProgressHistory(
            req.user.id,
            parseInt(req.params.id)
        );

        res.status(200).json({success: true, data: progress});
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch progress';
        res.status(500).json({success: false, message});
    }
};

export {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
    logProgress,
    getGoalProgress
};