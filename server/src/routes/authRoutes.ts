import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { registerValidator, loginValidator, handleValidationErrors } from '../utils/validators';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerValidator, handleValidationErrors, AuthController.register);
router.post('/login', loginValidator, handleValidationErrors, AuthController.login);
router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/profile', authMiddleware, AuthController.updateProfile);

export default router;
