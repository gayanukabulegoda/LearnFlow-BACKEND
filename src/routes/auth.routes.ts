import {Router} from 'express';
import {validate} from '../middleware/validate.middleware';
import {loginSchema, registerSchema} from '../validations/auth.schema';
import {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    refreshAccessToken
} from '../controllers/auth.controller';
import {auth} from '../middleware/auth.middleware';
/**
 * @description Router for /auth routes
 * @returns {Router} Express Router
 */
const router = Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/me', auth, getCurrentUser);
router.post('/logout', auth, logoutUser);
router.post('/refresh', refreshAccessToken);

export default router;