import { Request, Response } from 'express';
import prisma from '../config/database';
import { ResponseHandler } from '../utils/responseHandler';

export class ReviewController {
  static async getCourseReviews(req: Request, res: Response) {
    try {
      const { courseId, page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const reviews = await prisma.review.findMany({
        where: { courseId: String(courseId) },
        skip,
        take: Number(limit),
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.review.count({ where: { courseId: String(courseId) } });
      const avgRating = await prisma.review.aggregate({
        where: { courseId: String(courseId) },
        _avg: { rating: true },
      });

      return ResponseHandler.success(
        res,
        {
          reviews,
          stats: { average: avgRating._avg.rating || 0, total },
          pagination: { page, limit, total },
        },
        'Reviews retrieved successfully'
      );
    } catch (error) {
      console.error('Get reviews error:', error);
      return ResponseHandler.internalError(res, 'Failed to fetch reviews');
    }
  }

  static async getUserReviews(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.userId!;
      const skip = (Number(page) - 1) * Number(limit);

      const reviews = await prisma.review.findMany({
        where: { userId },
        skip,
        take: Number(limit),
        include: {
          course: { select: { id: true, title: true, thumbnail: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.review.count({ where: { userId } });

      return ResponseHandler.success(
        res,
        { reviews, pagination: { page, limit, total } },
        'User reviews retrieved'
      );
    } catch (error) {
      console.error('Get user reviews error:', error);
      return ResponseHandler.internalError(res, 'Failed to fetch reviews');
    }
  }

  static async createReview(req: Request, res: Response) {
    try {
      const { courseId, rating, comment } = req.body;
      const userId = req.userId!;

      // Check if already reviewed
      const existingReview = await prisma.review.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      if (existingReview) {
        return ResponseHandler.badRequest(res, 'You have already reviewed this course');
      }

      // Check enrollment
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      if (!enrollment) {
        return ResponseHandler.badRequest(res, 'You must be enrolled in the course to review it');
      }

      const review = await prisma.review.create({
        data: {
          userId,
          courseId,
          rating,
          content: comment,
        },
        include: {
          course: { select: { id: true, title: true } },
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          userId,
          type: 'review_submitted',
          description: `Submitted a ${rating}-star review for ${review.course.title}`,
        },
      });

      return ResponseHandler.success(res, review, 'Review created successfully', 201);
    } catch (error) {
      console.error('Create review error:', error);
      return ResponseHandler.internalError(res, 'Failed to create review');
    }
  }

  static async updateReview(req: Request, res: Response) {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.userId!;

      const review = await prisma.review.findUnique({
        where: { id: reviewId },
      });

      if (!review || review.userId !== userId) {
        return ResponseHandler.forbidden(res, 'Not authorized to update this review');
      }

      const updated = await prisma.review.update({
        where: { id: reviewId },
        data: {
          ...(rating && { rating }),
          ...(comment && { content: comment }),
        },
      });

      return ResponseHandler.success(res, updated, 'Review updated successfully');
    } catch (error) {
      console.error('Update review error:', error);
      return ResponseHandler.internalError(res, 'Failed to update review');
    }
  }

  static async deleteReview(req: Request, res: Response) {
    try {
      const { reviewId } = req.params;
      const userId = req.userId!;

      const review = await prisma.review.findUnique({
        where: { id: reviewId },
      });

      if (!review || review.userId !== userId) {
        return ResponseHandler.forbidden(res, 'Not authorized to delete this review');
      }

      await prisma.review.delete({
        where: { id: reviewId },
      });

      return ResponseHandler.success(res, null, 'Review deleted successfully');
    } catch (error) {
      console.error('Delete review error:', error);
      return ResponseHandler.internalError(res, 'Failed to delete review');
    }
  }
}
