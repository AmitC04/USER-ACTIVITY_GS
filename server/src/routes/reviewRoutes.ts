import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { reviewValidator, handleValidationErrors } from '../utils/validators';
import { authMiddleware, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/course/:courseId', optionalAuth, ReviewController.getCourseReviews);

// Protected routes
router.get('/', authMiddleware, ReviewController.getUserReviews);
router.post('/', authMiddleware, reviewValidator, handleValidationErrors, ReviewController.createReview);
router.put('/:reviewId', authMiddleware, ReviewController.updateReview);
router.delete('/:reviewId', authMiddleware, ReviewController.deleteReview);

export default router;
