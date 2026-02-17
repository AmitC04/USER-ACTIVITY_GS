import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { createCourseValidator, handleValidationErrors, idValidator } from '../utils/validators';
import { authMiddleware, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', optionalAuth, CourseController.getAll);
router.get('/stats', CourseController.getStats);
router.get('/:id', optionalAuth, CourseController.getById);

// Admin/Instructor routes (with auth)
router.post('/', authMiddleware, createCourseValidator, handleValidationErrors, CourseController.create);
router.put('/:id', authMiddleware, CourseController.update);
router.delete('/:id', authMiddleware, CourseController.delete);

export default router;
