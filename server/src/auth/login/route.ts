import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiHandler } from '@/lib/api-handler';
import { ValidationSchemas, validateInput } from '@/lib/validation';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateInput(ValidationSchemas.login, body);

    if (!validation.success) {
      return ApiHandler.badRequest('Invalid input', validation.errors);
    }

    const { email, password } = validation.data as { email: string; password: string };

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return ApiHandler.unauthorized('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return ApiHandler.unauthorized('Invalid credentials');
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        device: request.headers.get('user-agent') || 'Unknown',
        browser: request.headers.get('user-agent') || 'Unknown',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown',
        location: 'Unknown',
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'login',
        description: 'Logged in successfully',
      },
    });

    return ApiHandler.success({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      sessionId: session.id,
    }, 'Login successful');
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to login');
  }
}
