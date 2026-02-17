import { Request, Response } from 'express';
import prisma from '../config/database';
import { ResponseHandler } from '../utils/responseHandler';

export class ActivityController {
  static async getUserActivities(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, type } = req.query;
      const userId = req.userId!;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = { userId };
      if (type) where.type = type;

      const activities = await prisma.activity.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.activity.count({ where });

      return ResponseHandler.success(
        res,
        { activities, pagination: { page, limit, total } },
        'Activities retrieved successfully'
      );
    } catch (error) {
      console.error('Get activities error:', error);
      return ResponseHandler.internalError(res, 'Failed to fetch activities');
    }
  }

  static async markAsRead(req: Request, res: Response) {
    try {
      const { activityId } = req.params;
      const userId = req.userId!;

      const activity = await prisma.activity.findUnique({
        where: { id: activityId },
      });

      if (!activity || activity.userId !== userId) {
        return ResponseHandler.forbidden(res, 'Not authorized');
      }

      const updated = await prisma.activity.update({
        where: { id: activityId },
        data: { isRead: true },
      });

      return ResponseHandler.success(res, updated, 'Activity marked as read');
    } catch (error) {
      console.error('Mark as read error:', error);
      return ResponseHandler.internalError(res);
    }
  }

  static async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.userId!;

      await prisma.activity.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      return ResponseHandler.success(res, null, 'All activities marked as read');
    } catch (error) {
      console.error('Mark all read error:', error);
      return ResponseHandler.internalError(res);
    }
  }

  static async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = req.userId!;

      const count = await prisma.activity.count({
        where: { userId, isRead: false },
      });

      return ResponseHandler.success(res, { unreadCount: count }, 'Unread count retrieved');
    } catch (error) {
      console.error('Get unread count error:', error);
      return ResponseHandler.internalError(res);
    }
  }
}
