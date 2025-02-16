import {Request, Response} from 'express';
import * as resourceService from '../services/resources.service';
/**
 * @description API endpoint to manage resource recommendations & interactions
 * @param req - Request object
 * @param res - Response object
 */
const getRecommendations = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({success: false, message: 'Unauthorized'});
            return;
        }

        const recommendations = await resourceService.getUserRecommendations(req.user.id);
        res.status(200).json({success: true, data: recommendations});
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get recommendations';
        res.status(500).json({success: false, message});
    }
};

const trackInteraction = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({success: false, message: 'Unauthorized'});
            return;
        }

        const interaction = await resourceService.createResourceInteraction(
            req.user.id,
            {
                recommendationId: Number(req.body.recommendationId),
                type: req.body.type
            }
        );

        res.status(201).json({success: true, data: interaction});
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to track interaction';
        res.status(500).json({success: false, message});
    }
};

export {getRecommendations, trackInteraction};