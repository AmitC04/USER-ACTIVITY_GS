import { Request, Response } from 'express';
import prisma from '../config/database';
import { ResponseHandler } from '../utils/responseHandler';

export class DashboardController {
  static async getDashboardData(req: Request, res: Response) {
    try {
      const userId = req.userId;

      // Get dashboard metrics for the user
      const [enrollments, completedCourses, orders, reviews] = await Promise.all([
        prisma.enrollment.count({
          where: { userId }
        }),
        prisma.enrollment.count({
          where: { 
            userId,
            status: 'completed'
          }
        }),
        prisma.order.count({
          where: { userId }
        }),
        prisma.review.count({
          where: { userId }
        })
      ]);

      // Get recent activities
      const recentActivities = await prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true,
          type: true,
          description: true,
          createdAt: true,
          isRead: true
        }
      });

      // Get user's stats for the current month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const monthlyStats = await prisma.activity.groupBy({
        by: ['type'],
        where: {
          userId,
          createdAt: {
            gte: startOfMonth
          }
        },
        _count: true
      });

      const dashboardData = [
        { id: '1', title: 'Total Enrollments', value: enrollments.toString(), type: 'metric', period: 'all' },
        { id: '2', title: 'Active Courses', value: (enrollments - completedCourses).toString(), type: 'metric', period: 'current' },
        { id: '3', title: 'Certifications Completed', value: completedCourses.toString(), type: 'metric', period: 'all' },
        { id: '4', title: 'Current Streak', value: '7 Days', type: 'streak', period: 'current' }
      ];

      return ResponseHandler.success(res, {
        dashboardData,
        recentActivities,
        monthlyStats,
        quickStats: {
          loginDays: 15,
          totalDays: 31,
          testsCompleted: 4,
          reviewsWritten: 2,
          learningTime: '12h 35m'
        }
      }, 'Dashboard data retrieved successfully');
    } catch (error) {
      console.error('Get dashboard data error:', error);
      return ResponseHandler.internalError(res, 'Failed to get dashboard data');
    }
  }

  static async getDashboardStats(req: Request, res: Response) {
    try {
      const userId = req.userId;

      // Get various statistics for charts and graphs
      const [courseProgress, monthlyOrders, recentReviews] = await Promise.all([
        // Course progress data
        prisma.enrollment.findMany({
          where: { userId },
          include: {
            course: {
              select: {
                title: true
              }
            }
          },
          take: 5
        }),
        
        // Monthly orders data
        prisma.order.groupBy({
          by: ['createdAt'],
          where: {
            userId,
            createdAt: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) // Last 6 months
            }
          },
          _sum: {
            totalAmount: true
          }
        }),
        
        // Recent reviews
        prisma.review.findMany({
          where: { userId },
          include: {
            course: {
              select: {
                title: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        })
      ]);

      return ResponseHandler.success(res, {
        courseProgress: courseProgress.map(enrollment => ({
          course: enrollment.course.title,
          progress: enrollment.progress
        })),
        monthlyOrders: monthlyOrders.map(order => ({
          date: order.createdAt.toISOString().split('T')[0],
          amount: order._sum.totalAmount || 0
        })),
        recentReviews
      }, 'Dashboard stats retrieved successfully');
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return ResponseHandler.internalError(res, 'Failed to get dashboard stats');
    }
  }
}