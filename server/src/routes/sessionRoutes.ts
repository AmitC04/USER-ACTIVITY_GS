import { Router } from 'express';
import { SessionController } from '../controllers/SessionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, SessionController.getActiveSessions);
router.get('/all', authMiddleware, SessionController.getAllSessions);
router.delete('/:sessionId', authMiddleware, SessionController.endSession);
router.post('/logout-all', authMiddleware, SessionController.endAllSessions);

export default router;
