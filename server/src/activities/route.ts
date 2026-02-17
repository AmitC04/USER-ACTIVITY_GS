import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiHandler } from '@/lib/api-handler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return ApiHandler.badRequest('User ID is required');
    }

    const where: any = { userId };
    if (type) where.type = type;

    const activities = await prisma.activity.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return ApiHandler.success(activities, 'Activities retrieved successfully');
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to fetch activities');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { activityId, isRead } = body;

    if (!activityId) {
      return ApiHandler.badRequest('Activity ID is required');
    }

    const activity = await prisma.activity.update({
      where: { id: activityId },
      data: { isRead },
    });

    return ApiHandler.success(activity, 'Activity updated successfully');
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to update activity');
  }
}
