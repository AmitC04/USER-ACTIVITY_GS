import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiHandler } from '@/lib/api-handler';
import { ValidationSchemas, validateInput } from '@/lib/validation';
import { z } from 'zod';

const enrollSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  courseId: z.string().min(1, 'Course ID is required'),
  expiresAt: z.string().optional(),
});

const updateEnrollmentSchema = z.object({
  enrollmentId: z.string().min(1, 'Enrollment ID is required'),
  progress: z.number().min(0).max(100).optional(),
  status: z.enum(['active', 'completed', 'expired']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateInput(enrollSchema, body);

    if (!validation.success) {
      return ApiHandler.badRequest('Invalid input', validation.errors);
    }

    const { userId, courseId, expiresAt } = validation.data as any;

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return ApiHandler.badRequest('Already enrolled in this course');
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      },
      include: {
        course: true,
      },
    });

    // Log activity
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    await prisma.activity.create({
      data: {
        userId,
        type: 'course_enrolled',
        description: `Enrolled in ${course?.title}`,
      },
    });

    return ApiHandler.success(enrollment, 'Enrolled in course successfully', 201);
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to enroll in course');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateInput(updateEnrollmentSchema, body);

    if (!validation.success) {
      return ApiHandler.badRequest('Invalid input', validation.errors);
    }

    const { enrollmentId, progress, status } = validation.data as any;

    const enrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        ...(progress !== undefined && { progress }),
        ...(status && { status }),
        ...(status === 'completed' && { completedAt: new Date() }),
      },
    });

    return ApiHandler.success(enrollment, 'Enrollment updated successfully');
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to update enrollment');
  }
}
