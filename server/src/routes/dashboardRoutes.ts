import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/data', authMiddleware, DashboardController.getDashboardData);
router.get('/stats', authMiddleware, DashboardController.getDashboardStats);

export default router;