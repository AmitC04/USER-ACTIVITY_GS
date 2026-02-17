import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { createOrderValidator, handleValidationErrors } from '../utils/validators';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, OrderController.getUserOrders);
router.post('/', authMiddleware, createOrderValidator, handleValidationErrors, OrderController.createOrder);
router.get('/:orderId', authMiddleware, OrderController.getOrderById);

export default router;
