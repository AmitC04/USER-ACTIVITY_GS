import { Request, Response } from 'express';
import prisma from '../config/database';
import { ResponseHandler } from '../utils/responseHandler';

export class OrderController {
  static async getUserOrders(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.userId!;
      const skip = (Number(page) - 1) * Number(limit);

      const orders = await prisma.order.findMany({
        where: { userId },
        skip,
        take: Number(limit),
        include: {
          items: {
            include: {
              course: { select: { id: true, title: true, thumbnail: true, price: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.order.count({ where: { userId } });

      return ResponseHandler.success(
        res,
        { orders, pagination: { page, limit, total } },
        'Orders retrieved successfully'
      );
    } catch (error) {
      console.error('Get orders error:', error);
      return ResponseHandler.internalError(res, 'Failed to fetch orders');
    }
  }

  static async createOrder(req: Request, res: Response) {
    try {
      const { items, paymentMethod } = req.body;
      const userId = req.userId!;

      // Calculate total
      const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          orderNumber,
          totalAmount,
          paymentMethod,
          status: 'completed',
          items: {
            create: items.map((item: any) => ({
              courseId: item.courseId,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              course: { select: { id: true, title: true } },
            },
          },
        },
      });

      // Create enrollments for each course
      for (const item of items) {
        await prisma.enrollment.upsert({
          where: {
            userId_courseId: { userId, courseId: item.courseId },
          },
          update: { status: 'active', enrolledAt: new Date() },
          create: { userId, courseId: item.courseId, status: 'active' },
        });
      }

      // Log activity
      await prisma.activity.create({
        data: {
          userId,
          type: 'order_placed',
          description: `Order placed: ${orderNumber} (₹${totalAmount})`,
        },
      });

      return ResponseHandler.success(res, order, 'Order created successfully', 201);
    } catch (error) {
      console.error('Create order error:', error);
      return ResponseHandler.internalError(res, 'Failed to create order');
    }
  }

  static async getOrderById(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.userId!;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              course: { select: { id: true, title: true, thumbnail: true, price: true } },
            },
          },
        },
      });

      if (!order || order.userId !== userId) {
        return ResponseHandler.notFound(res, 'Order not found');
      }

      return ResponseHandler.success(res, order, 'Order retrieved successfully');
    } catch (error) {
      console.error('Get order error:', error);
      return ResponseHandler.internalError(res, 'Failed to fetch order');
    }
  }
}
