import { Router } from 'express';
import { ActivityController } from '../controllers/ActivityController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, ActivityController.getUserActivities);
router.get('/unread/count', authMiddleware, ActivityController.getUnreadCount);
router.patch('/:activityId/read', authMiddleware, ActivityController.markAsRead);
router.patch('/read/all', authMiddleware, ActivityController.markAllAsRead);

export default router;
