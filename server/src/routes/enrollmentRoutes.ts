import { Router } from 'express';
import { EnrollmentController } from '../controllers/EnrollmentController';
import { enrollmentValidator, handleValidationErrors } from '../utils/validators';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, enrollmentValidator, handleValidationErrors, EnrollmentController.enroll);
router.get('/', authMiddleware, EnrollmentController.getUserEnrollments);
router.patch('/progress', authMiddleware, EnrollmentController.updateProgress);
router.get('/:enrollmentId', authMiddleware, EnrollmentController.getProgress);

export default router;
