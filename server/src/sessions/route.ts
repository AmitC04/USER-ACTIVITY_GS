import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiHandler } from '@/lib/api-handler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return ApiHandler.badRequest('User ID is required');
    }

    const sessions = await prisma.session.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        lastActive: 'desc',
      },
    });

    return ApiHandler.success(sessions, 'Sessions retrieved successfully');
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to fetch sessions');
  }
}
