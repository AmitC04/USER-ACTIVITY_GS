import { Request, Response } from 'express';
import prisma from '../config/database';
import { ResponseHandler } from '../utils/responseHandler';

export class SessionController {
  static async getActiveSessions(req: Request, res: Response) {
    try {
      const userId = req.userId!;

      const sessions = await prisma.session.findMany({
        where: { userId, isActive: true },
        orderBy: { lastActive: 'desc' },
      });

      return ResponseHandler.success(res, sessions, 'Active sessions retrieved');
    } catch (error) {
      console.error('Get sessions error:', error);
      return ResponseHandler.internalError(res, 'Failed to fetch sessions');
    }
  }

  static async getAllSessions(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.userId!;
      const skip = (Number(page) - 1) * Number(limit);

      const sessions = await prisma.session.findMany({
        where: { userId },
        skip,
        take: Number(limit),
        orderBy: { lastActive: 'desc' },
      });

      const total = await prisma.session.count({ where: { userId } });

      return ResponseHandler.success(
        res,
        { sessions, pagination: { page, limit, total } },
        'Sessions retrieved'
      );
    } catch (error) {
      console.error('Get sessions error:', error);
      return ResponseHandler.internalError(res);
    }
  }

  static async endSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const userId = req.userId!;

      const session = await prisma.session.findUnique({
        where: { id: sessionId },
      });

      if (!session || session.userId !== userId) {
        return ResponseHandler.forbidden(res, 'Not authorized to end this session');
      }

      const updated = await prisma.session.update({
        where: { id: sessionId },
        data: { isActive: false },
      });

      return ResponseHandler.success(res, updated, 'Session ended successfully');
    } catch (error) {
      console.error('End session error:', error);
      return ResponseHandler.internalError(res, 'Failed to end session');
    }
  }

  static async endAllSessions(req: Request, res: Response) {
    try {
      const userId = req.userId!;

      await prisma.session.updateMany({
        where: { userId },
        data: { isActive: false },
      });

      return ResponseHandler.success(res, null, 'All sessions ended successfully');
    } catch (error) {
      console.error('End all sessions error:', error);
      return ResponseHandler.internalError(res);
    }
  }
}
