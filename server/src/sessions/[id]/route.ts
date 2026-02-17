import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiHandler } from '@/lib/api-handler';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    await prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });

    return ApiHandler.success(null, 'Session ended successfully');
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to end session');
  }
}
