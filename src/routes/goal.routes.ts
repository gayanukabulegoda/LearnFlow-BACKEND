import {Router} from 'express';
import {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
    logProgress,
    getGoalProgress
} from '../controllers/goals.controller';
import {auth} from '../middleware/auth.middleware';
import {
    goalCreateSchema,
    progressSchema
} from '../validations/goal.schema';
import {validate} from '../middleware/validate.middleware';
/**
 * @description Router for /goals routes
 * @returns {Router} Express Router
 */
const router = Router();

router.use(auth);

router.route('/')
    .post(validate(goalCreateSchema), createGoal)
    .get(getGoals);

router.route('/:id')
    .patch(validate(goalCreateSchema), updateGoal)
    .delete(deleteGoal);

router.post('/:id/progress', validate(progressSchema), logProgress);
router.get('/:id/progress', getGoalProgress);

export default router;