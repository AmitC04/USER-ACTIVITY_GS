import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiHandler } from '@/lib/api-handler';
import { ValidationSchemas, validateInput } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // Get user's enrolled courses
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: true,
        },
        orderBy: {
          enrolledAt: 'desc',
        },
      });

      return ApiHandler.success(enrollments, 'User courses retrieved successfully');
    }

    // Get all courses
    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ApiHandler.success(courses, 'Courses retrieved successfully');
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to fetch courses');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateInput(ValidationSchemas.createCourse, body);

    if (!validation.success) {
      return ApiHandler.badRequest('Invalid input', validation.errors);
    }

    const { title, description, thumbnail, duration, price } = validation.data as any;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        duration,
        price,
      },
    });

    return ApiHandler.success(course, 'Course created successfully', 201);
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to create course');
  }
}
