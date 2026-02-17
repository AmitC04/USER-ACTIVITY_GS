import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiHandler } from '@/lib/api-handler';
import { ValidationSchemas, validateInput } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');

    const where: any = {};
    if (userId) where.userId = userId;
    if (courseId) where.courseId = courseId;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ApiHandler.success(reviews, 'Reviews retrieved successfully');
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to fetch reviews');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateInput(ValidationSchemas.createReview, body);

    if (!validation.success) {
      return ApiHandler.badRequest('Invalid input', validation.errors);
    }

    const { userId, courseId, rating, comment } = validation.data as any;

    const review = await prisma.review.create({
      data: {
        userId,
        courseId,
        rating,
        content: comment,
      },
      include: {
        course: true,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId,
        type: 'review_submitted',
        description: `Submitted review for ${review.course.title}`,
      },
    });

    return ApiHandler.success(review, 'Review created successfully', 201);
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to create review');
  }
}
