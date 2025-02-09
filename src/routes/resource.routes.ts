import {Router} from 'express';
import {
    getRecommendations,
    trackInteraction
} from '../controllers/resources.controller';
import {auth} from '../middleware/auth.middleware';
import {interactionSchema} from '../validations/resource.schema';
import {validate} from '../middleware/validate.middleware';

const router = Router();

router.use(auth);

router.get('/recommendations', getRecommendations);
router.post('/interact', validate(interactionSchema), trackInteraction);

export default router;