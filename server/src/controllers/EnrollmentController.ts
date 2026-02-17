import { Request, Response } from 'express';
import prisma from '../config/database';
import { ResponseHandler } from '../utils/responseHandler';

export class EnrollmentController {
  static async enroll(req: Request, res: Response) {
    try {
      const { courseId, expiresAt } = req.body;
      const userId = req.userId!;

      // Check if already enrolled
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      if (existingEnrollment) {
        return ResponseHandler.badRequest(res, 'Already enrolled in this course');
      }

      // Enroll user
      const enrollment = await prisma.enrollment.create({
        data: {
          userId,
          courseId,
          expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        },
        include: {
          course: {
            select: { id: true, title: true, thumbnail: true },
          },
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          userId,
          type: 'course_enrolled',
          description: `Enrolled in ${enrollment.course.title}`,
        },
      });

      return ResponseHandler.success(res, enrollment, 'Enrolled in course successfully', 201);
    } catch (error) {
      console.error('Enrollment error:', error);
      return ResponseHandler.internalError(res, 'Failed to enroll in course');
    }
  }

  static async getUserEnrollments(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const userId = req.userId!;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = { userId };
      if (status) where.status = status;

      const enrollments = await prisma.enrollment.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnail: true,
              duration: true,
              price: true,
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      });

      const total = await prisma.enrollment.count({ where });

      return ResponseHandler.success(
        res,
        { enrollments, pagination: { page, limit, total } },
        'User enrollments retrieved'
      );
    } catch (error) {
      console.error('Get enrollments error:', error);
      return ResponseHandler.internalError(res, 'Failed to fetch enrollments');
    }
  }

  static async updateProgress(req: Request, res: Response) {
    try {
      const { enrollmentId, progress, status } = req.body;
      const userId = req.userId!;

      // Verify ownership
      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
      });

      if (!enrollment || enrollment.userId !== userId) {
        return ResponseHandler.forbidden(res, 'Not authorized to update this enrollment');
      }

      const updated = await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
          ...(progress !== undefined && { progress }),
          ...(status && { status }),
          ...(status === 'completed' && { completedAt: new Date() }),
        },
        include: { course: { select: { title: true } } },
      });

      return ResponseHandler.success(res, updated, 'Progress updated successfully');
    } catch (error) {
      console.error('Update progress error:', error);
      return ResponseHandler.internalError(res, 'Failed to update progress');
    }
  }

  static async getProgress(req: Request, res: Response) {
    try {
      const { enrollmentId } = req.params;
      const userId = req.userId!;

      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
      });

      if (!enrollment || enrollment.userId !== userId) {
        return ResponseHandler.forbidden(res);
      }

      return ResponseHandler.success(res, enrollment, 'Progress retrieved');
    } catch (error) {
      console.error('Get progress error:', error);
      return ResponseHandler.internalError(res);
    }
  }
}
