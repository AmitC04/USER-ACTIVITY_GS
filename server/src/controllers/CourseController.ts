import { Request, Response } from 'express';
import prisma from '../config/database';
import { ResponseHandler } from '../utils/responseHandler';

export class CourseController {
  static async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, category, level, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {
        isPublished: true,
      };

      if (category) where.category = category;
      if (level) where.level = level;
      if (search) {
        where.OR = [
          { title: { contains: String(search), mode: 'insensitive' as any } },
          { description: { contains: String(search), mode: 'insensitive' as any } },
        ];
      }

      const courses = await prisma.course.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          duration: true,
          price: true,
          category: true,
          level: true,
          _count: { select: { enrollments: true, reviews: true } },
        },
      });

      const total = await prisma.course.count({ where });

      return ResponseHandler.success(
        res,
        { courses, pagination: { page, limit, total, pages: Math.ceil(total / Number(limit)) } },
        'Courses retrieved successfully'
      );
    } catch (error) {
      console.error('Get courses error:', error);
      return ResponseHandler.internalError(res, 'Failed to fetch courses');
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const course = await prisma.course.findUnique({
        where: { id },
        include: {
          reviews: {
            select: {
              id: true,
              rating: true,
              content: true,
              user: { select: { id: true, name: true, avatar: true } },
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          _count: { select: { enrollments: true, reviews: true } },
        },
      });

      if (!course) {
        return ResponseHandler.notFound(res, 'Course not found');
      }

      return ResponseHandler.success(res, course, 'Course retrieved successfully');
    } catch (error) {
      console.error('Get course error:', error);
      return ResponseHandler.internalError(res, 'Failed to fetch course');
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { title, description, thumbnail, duration, price, category, level } = req.body;

      const course = await prisma.course.create({
        data: {
          title,
          description,
          thumbnail,
          duration,
          price,
          category,
          level,
        },
      });

      return ResponseHandler.success(res, course, 'Course created successfully', 201);
    } catch (error) {
      console.error('Create course error:', error);
      return ResponseHandler.internalError(res, 'Failed to create course');
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, thumbnail, duration, price, category, level, isPublished } = req.body;

      const course = await prisma.course.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(thumbnail && { thumbnail }),
          ...(duration && { duration }),
          ...(price && { price }),
          ...(category && { category }),
          ...(level && { level }),
          ...(isPublished !== undefined && { isPublished }),
        },
      });

      return ResponseHandler.success(res, course, 'Course updated successfully');
    } catch (error) {
      console.error('Update course error:', error);
      return ResponseHandler.internalError(res, 'Failed to update course');
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.course.delete({
        where: { id },
      });

      return ResponseHandler.success(res, null, 'Course deleted successfully');
    } catch (error) {
      console.error('Delete course error:', error);
      return ResponseHandler.internalError(res, 'Failed to delete course');
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const stats = await prisma.course.aggregate({
        _count: true,
        _avg: { price: true },
      });

      const byCategory = await prisma.course.groupBy({
        by: ['category'],
        _count: true,
      });

      return ResponseHandler.success(
        res,
        {
          total: stats._count,
          averagePrice: stats._avg.price,
          byCategory,
        },
        'Course statistics retrieved'
      );
    } catch (error) {
      console.error('Get stats error:', error);
      return ResponseHandler.internalError(res, 'Failed to get statistics');
    }
  }
}
